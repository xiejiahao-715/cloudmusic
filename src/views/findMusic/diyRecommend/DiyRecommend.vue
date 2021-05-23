<template>
  <div style="margin-top: 25px;margin-bottom: 45px;padding: 0 1px">
    <div>
      <!--轮播图-->
      <el-carousel
          type="card" :interval="5000"
          :height="bannerHeight+'px'"
          element-loading-text="拼命加载图片中,请尝试刷新页面"
          element-loading-spinner="el-icon-loading"
          v-loading="bannerInfo.length === 0" >
        <el-carousel-item v-for="(item,index) in bannerInfo" :key="index">
          <el-image
              @click="changeUrl(item.targetId)"
              :src="item.imageUrl"
              fit="contain"></el-image>
          <el-tag
              :type="item.typeTitle === '独家' ? 'danger' : 'primary'"
              effect="dark" style="margin: 0;position:relative;transform: translate(-100%,-100%);top: -4px;left: 100%">
            {{item.typeTitle}}
          </el-tag>
        </el-carousel-item>
      </el-carousel>
      <div>
        <!--推荐歌单的模块渲染-->
        <el-row style="border-bottom: 2px solid rgb(230,230,230)">
          <p style="margin-bottom: 10px;font-size: 22px;">推荐歌单</p>
        </el-row>
        <el-row :gutter="10" v-for="(list,index) in showMusicList" :key="index">
          <el-col :span="4" v-for="(item,index) in list" :key="index"
                  style="margin-top: 20px;position:relative;">
            <!--播放量-->
            <div style="background: rgba(128,128,128,0.2);color: white;width: 96%;position:absolute;z-index: 10;">
              <div style="float:right;">
                <i class="el-icon-headset" style="margin-right: 5px;"></i>
                {{item.playCount >= 10000 ? (item.playCount/10000).toFixed(0)+'万' : item.playCount}}
              </div>
            </div>
            <div>
              <el-image
                  :src="item.coverImgUrl"
                  @click="toSongListPage(item.id)"
                  style="width: 100%;height:100%;box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
              </el-image>
            </div>
            <h1 @click="toSongListPage(item.id)" style="cursor:pointer;" :title="item.name">
              {{item.name.toString().length >= 30 ? item.name.toString().substring(0,27) + '···' :
                item.name}}</h1>
          </el-col>
        </el-row>

        <!--独家放送的模块渲染-->
        <el-row style="border-bottom: 2px solid rgb(230,230,230)">
          <p style="margin-bottom: 10px;font-size: 22px;">独家放送</p>
        </el-row>
        <el-row :gutter="40" style="margin-top: 25px;">
          <el-col :span="8" v-for="item in privateList" :key="item.id">
            <i class="el-icon-video-play"
               style="color: rgba(255,255,255,0.4);font-size: 45px;position: absolute;top: 10px;z-index: 10"></i>
            <el-image
                :src="item.sPicUrl"
                @click="toVideoPage(item.id)"
                style="box-shadow: 0 0 2px 2px gray;border-radius: 5px;cursor:pointer;"></el-image>
            <h1 @click="toVideoPage(item.id)" style="cursor: pointer">{{item.name}}</h1>
          </el-col>
        </el-row>

        <!--最新音乐的模块渲染-->
        <el-row style="border-bottom: 2px solid rgb(230,230,230)">
          <p style="margin-bottom: 10px;font-size: 22px;">最新音乐</p>
        </el-row>
        <el-row style="margin-top: 25px;">
          <!--左侧-->
          <el-col :span="12">
            <el-table
                :data="newMusicList.slice(0,5)" stripe
                @row-dblclick="dblclickPlayMusic"
                :show-header="false">
              <el-table-column type="index">
                <template #default="scope">
                  {{'0'+(scope.$index+1).toString()}}
                </template>
              </el-table-column>
              <el-table-column>
                <template #default="scope">
                  <i
                      @click="changeUrl(scope.row.id)"
                      class="el-icon-video-play"
                     style="position: absolute;font-size: 25px;top: 35px;left:35px;z-index: 10;cursor:pointer;"></i>
                  <el-image
                      :src="scope.row.picUrl"
                      @click="changeUrl(scope.row.id)"
                      style="width: 75px;height: 75px;cursor:pointer;"></el-image>
                  <span style="position: absolute;top: 25px;font-size: 15px;font-weight: 500;margin-left: 10px">{{scope.row.name}}</span>
                  <span style="cursor:pointer;position: absolute;bottom: 25px;font-size: 12px;font-weight: 500;margin-left: 10px">
                    {{scope.row.song.artists[0].name}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <!--右侧-->
          <el-col :span="12">
            <el-table
                @row-dblclick="dblclickPlayMusic"
                :data="newMusicList.slice(5)" stripe
                :show-header="false">
              <el-table-column type="index">
                <template slot-scope="scope">
                  {{scope.$index >= 4 ? scope.$index+6 : '0'+(scope.$index+6).toString()}}
                </template>
              </el-table-column>
              <el-table-column>
                <template #default="scope">
                  <i
                      @click="changeUrl(scope.row.id)"
                      class="el-icon-video-play"
                     style="position: absolute;font-size: 25px;top: 35px;left:35px;z-index: 10;cursor:pointer;"></i>
                  <el-image
                      @click="changeUrl(scope.row.id)"
                      :src="scope.row.picUrl"
                      style="width: 75px;height: 75px;cursor:pointer;"></el-image>
                  <span style="position: absolute;top: 25px;font-size: 15px;font-weight: 500;margin-left: 10px">{{scope.row.name}}</span>
                  <span style="cursor:pointer;position: absolute;bottom: 25px;font-size: 12px;font-weight: 500;margin-left: 10px">
                    {{scope.row.song.artists[0].name}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DiyRecommend",
  data(){
    return {
      // 轮播图数据列表
      bannerInfo:[],
      // 轮播图的高度
      bannerHeight: 0,
      // 浏览器的宽度
      screenWidth: 0,
      //推荐歌单的数据
      musicList: [],
      //独家放送的信息
      privateList: [],
      //最新音乐的推送列表
      newMusicList: [],
      //需要播放的音乐地址
      musicUrl: '',
      //当前音乐的详情对象
      music: {},
    }
  },
  props:{},
  created() {
    //获取轮播图数据
    this.getBannerInfo();
    //获取推荐歌单数据
    this.getMusicList();
    //获取独家放送的数据
    this.getPrivateList();
    //获取最新音乐
    this.getNewMusicList();
  },
  computed:{
    showMusicList(){
      const list = [];
      for(let i = 1;i<= this.musicList.length/6+1;i++){
        list.push(this.musicList.slice((i-1)*6,i*6));
      }
      return list;
    }
  },
  methods:{
    // 获取轮播图数据
    getBannerInfo(){
      this.$http.get({url: `/banner`})
      .then(({data:res})=>{
        if(res.code ===200){
          this.bannerInfo = res.banners;
        } else{
          this.$message.error('轮播图数据获取失败');
        }
      })
    },
    // 点击banner轮播图向父组件传递切换对应的音乐,和专辑封面
    async changeUrl(musicId){
      if(musicId === null) return;
      await this.getMusicUrl(musicId);
      await this.getMusicDetail(musicId);
      //防止url未获得提交信息到父组件
      if (this.musicUrl.length>0 && this.music !== {}) {
        this.$emit('setParentMusicUrl', this.musicUrl, this.music);
      }else{
        this.$message.error('该链接无法播放音乐');
      }
    },
    //根据id获取音乐url
    getMusicUrl(musicId){
      return this.$http.get({url:'/song/url', params: {id: musicId}}).then(({data:res}) => {
        if(res.code === 200 && res.data[0].code === 200) {
          this.musicUrl = res.data[0].url;
        }
        else{
          this.musicUrl = '';
        }
      })
    },
    //根据id获取音乐详情
    getMusicDetail(musicId) {
      return this.$http.get({url:'/song/detail', params: {ids: musicId}}).then(({data:res}) => {
        if(res.code === 200 && res.songs.length>0) {
          this.music = res.songs[0];
        }
        else{
          this.music = {};
        }
      })
    },
    // 通过浏览器的宽度来动态计算轮播图的高度 初始高度为屏幕宽度的1/4
    setSize(){
      if(this.screenWidth <940){
        this.screenWidth = 940;
      }
      this.bannerHeight = 300/1920 * this.screenWidth;
    },
    //获取歌单数据
    getMusicList(){
      //随机取出精品歌单,避免数据是流动的
      this.$http.get({url:'/top/playlist',
        params: {
          offset: (Math.random() * 1297).toFixed(0) - 12,
          limit: 12
        }}).then(res => {
        this.musicList = res.data.playlists;
      })
    },
    //获取独家放送数据
    getPrivateList() {
      this.$http.get({url:'/personalized/privatecontent'}).then(res => {
        this.privateList = res.data.result;
      })
    },
    //推荐最新音乐
    getNewMusicList() {
      this.$http.get({url:'/personalized/newsong'}).then(res => {
        this.newMusicList = res.data.result;
      })
    },
    // 双击播放音乐
    dblclickPlayMusic(row){
      this.changeUrl(row.id);
    },
    //点击歌单跳转界面
    toSongListPage(id) {
      this.$router.push('/songlist/' + id)
    },
    toVideoPage(mvId){
      this.$router.push('/toVideoPage/'+ mvId)
    }
  },
  mounted() {
    this.screenWidth = window.innerWidth;
    this.setSize();
    window.addEventListener('resize',()=>{
      this.screenWidth = window.innerWidth;
      this.setSize();
    },false);
  }
}
</script>

<style scoped lang="less">
</style>