<template>
  <div style="margin-bottom: 55px">
    <!--头部介绍歌单的部分-->
    <div style="position: relative;display: flex;">
      <!--歌单图标-->
      <el-image
          ref="imageRef"
          :src="currentSongList.coverImgUrl" alt=""
          style="width: 220px;height: 220px;flex: 0 0 220px"></el-image>
      <!--中间区域介绍歌单-->
      <div style="margin-left: 20px;flex: 1;">
        <!--标签及名字-->
        <div>
          <el-tag type="danger" style="background-color: white;">精品歌单</el-tag>
          <span style="font-weight: 400;font-size: 20px;vertical-align: middle;margin-left: 10px">{{currentSongList.name}}</span>
        </div>
        <!--作者信息-->
        <div style="margin-top: 10px;">
          <el-image
              :src="currentSongList.creator.avatarUrl"
              style="width: 35px;height: 35px;border-radius:15px;"></el-image>
          <span style="margin-left: 10px;vertical-align:50%">{{currentSongList.creator.nickname}}</span>
          <span style="margin-left: 10px;vertical-align:50%;opacity: 0.7;">{{currentSongList.createTime | dateFormat}} 创建</span>
        </div>
        <!--按钮组-->
        <div style="margin-top: 10px;">
          <el-button @click="setSongListInfo(playList,playList[0])" type="danger" size="mini" icon="el-icon-video-play">播放全部</el-button>
          <el-button icon="el-icon-folder-add" size="mini" style="color: black;">收藏({{currentSongList.subscribedCount}})</el-button>
          <el-button icon="el-icon-share" size="mini" style="color: black;">分享({{currentSongList.shareCount}})</el-button>
          <!--标签信息-->
          <span style="margin-left: 10px">标签:
            <span
                v-for="(item,index) in currentSongList.tags" :key="index"
                style="color: rgb(12,115,194);cursor: pointer">
              {{index+1 === currentSongList.tags.length ? item : item+' / '}}
            </span>
          </span>
          <!--简介信息-->
          <el-collapse v-model="introduceCollapse">
            <el-collapse-item
                name="1"
                :title="'简介: ' + (currentSongList.description + '').substr(0,40) + '...' ">
              <p>{{currentSongList.description}}</p>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <!--右侧歌曲信息-->
      <div style="margin-left: auto;color: gray;text-align:left;flex:  0 0 120px">
        <div style="opacity: 0.6">
          <p>歌曲数: {{currentSongList.trackCount}}</p>
          <p>播放量: {{(currentSongList.playCount/10000).toFixed(0)}}万</p>
        </div>
      </div>
    </div>
    <!--主体区域-->
    <div>
      <el-menu :default-active='activePath' class="el-menu-demo" mode="horizontal" style="width: 280px;">
        <el-menu-item index="1" @click="toMusicListPage">歌曲列表</el-menu-item>
        <el-menu-item index="2" @click="toCommentPage">评论({{currentSongList.commentCount}})</el-menu-item>
      </el-menu>
      <keep-alive>
        <router-view @setSongListInfo="setSongListInfo"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: "SongList",
  data(){
    return {
      //前一个组件传递过来的值 放入localStorage保存
      currentId: this.$route.params.id ? this.$route.params.id : window.localStorage.getItem('currentId'),
      //当前歌单信息
      currentSongList: {
        //创建人信息
        creator: {
          avatarUrl: '',
          nickname: '',
        },
        trackIds: []
      },
      // 介绍面板默认展开
      introduceCollapse: "1",
      //当前歌单所有歌曲id信息
      playList: [],
      // 歌单页面当前的子路由
      activePath: window.sessionStorage.getItem('SongList_active') !== null ?  window.sessionStorage.getItem('SongList_active') : '1',
    }
  },
  created() {
    this.getSongListInfo();
    //注册监听的事件 在main.js中定义了
    window.addEventListener('setItem', this.listenerSetItem);
  },
  beforeDestroy() {
    window.removeEventListener('setItem',this.listenerSetItem);
    window.sessionStorage.removeItem('SongList_active');
  },
  mounted() {
    //把上一个页面传递来的参数放入localstorage 防止页面刷新 参数没了
    window.localStorage.setItem('currentId', this.currentId);
  },
  methods:{
    //获取歌单信息并处理歌单所有歌曲数据
    getSongListInfo(){
      this.$http.get({
        url: 'playlist/detail',
        params:{id: this.currentId}
      }).then(({data:res})=>{
        this.currentSongList = res.playlist;
        this.playList = [];
        this.currentSongList.trackIds.forEach(item=>{
          this.playList.push(item.id);
        });
        // 判断是否为第一次加载，如果是刷新则不需要自动跳转
        if(/^\/songlist\/\d+$/.test(this.$route.fullPath)) {
          //等待数据赋值后,马上自执行一次路由跳转加载子组件
          if (this.activePath === '1') {//如果为自跳转则执行
            this.toMusicListPage();
          } else if (this.activePath === '2') {
            this.toCommentPage();
          } else {
            this.toMusicListPage();
          }
        }
      })
    },
    // 路由跳转并携带歌单ids数组参数
    toMusicListPage(){
      this.$router.push({
        name: 'musicPage',
        params:{
          ids: this.playList.join(',')
        }
      });
      window.sessionStorage.setItem('SongList_active','1');
    },
    //路由跳转携带参数
    toCommentPage() {
      this.$router.push('/comment/' + this.currentId);
      window.sessionStorage.setItem('SongList_active','2');
    },
    //子组件传递来的歌单所有歌曲id信息,和当前播放的音乐的id
    setSongListInfo(songList, curId) {
      this.$emit('setSongListInfo', songList, curId);
    },
    // 监听在main.js中定义的setItem事件
    listenerSetItem(){
      //这里是为了从主页进入的歌单 页面不进行变化 所以加一个localstorage监听器 监听当前歌单变化
      //如果有变化直接就重新查询数据 替换掉之前的数据  实现刷新页面
      this.currentId = parseInt(localStorage.getItem('currentId'))
      //重新加载数据(暂有BUG未修)
      this.getSongListInfo();
    },
  }
}
</script>

<style scoped>
/deep/.el-collapse-item__content{
  padding-bottom: 0;
}
/deep/.el-collapse-item__header{
  height: 24px;
  line-height: 24px;
}
.el-collapse{
  margin-top: 5px;
}
</style>