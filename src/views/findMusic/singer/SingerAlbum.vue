<template>
  <div style="margin-bottom: 50px;margin-top: 15px">
    <!--默认的头部热门50首-->
    <el-row>
      <el-col :span="4">
        <el-image :src="require('@/assets/img/top50.png')" fit="contain"></el-image>
      </el-col>
      <el-col :span="8" :offset="1">
        <span>热门50曲</span>
        <el-table
            :data=hot50Songs.slice(0,defaultShow)
            @row-dblclick="playHot50Music"
            highlight-current-row stripe
            :show-header="false"
            style="cursor: context-menu;border: 1px solid rgb(230,230,230);border-bottom: none">
          <el-table-column type="index" label="#">
            <template #default="scope">
              <img v-if="curId === scope.row.id" src="@/assets/img/isPlay.png" alt="">
              <p v-else>{{scope.$index+1 >= 10 ? scope.$index+1 : ('0'+(scope.$index+1)).toString()}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70px;">
            <i class="el-icon-star-off" style="font-size: 18px;cursor: pointer"></i>
            <i class="el-icon-download" style="margin-left: 10px;font-size: 18px;cursor:pointer;"></i>
          </el-table-column>
          <el-table-column label="音乐标题" prop="name" align="center"></el-table-column>
          <el-table-column label="时长" prop="dt" width="80px;"></el-table-column>
        </el-table>
        <el-button
            v-if="buttonVisible"
            @click="changeDefaultNum"
            style="margin-top: 5px"
            type="danger" size="mini">查看全部50首</el-button>
        <el-button
            v-else
            @click="changeDefaultNum"
            style="margin-top: 5px"
            type="danger" size="mini">收起</el-button>
      </el-col>
    </el-row>
    <!--所有专辑信息-->
    <el-row
        v-for="(item,index) in albumMusicInfo" :key="index"
        style="border-top: solid 1px #e6e6e6;padding-bottom: 10px;margin-top: 20px;padding-top: 5px">
      <el-col :span="4">
        <div style="display: inline-block;">
          <el-image :src="item.album.picUrl" fit="contain"></el-image>
          <p style="margin: 5px 0 0 0;text-align: center">{{item.album.publishTime | dateFormatToYMD}}</p>
        </div>
      </el-col>
      <el-col :span="8" :offset="1">
        {{item.album.name}}
        <el-table
            @row-dblclick="playAlbumMusic"
            :data="item.songs"
            highlight-current-row stripe
            style="margin-top: 15px;cursor: context-menu;border: 1px solid rgb(230,230,230);border-bottom: none"
            :show-header="false">
          <el-table-column type="index">
            <template scope="scope">
              <img v-if="curId === scope.row.id" src="@/assets/img/isPlay.png" alt="">
              <p v-else>{{scope.$index+1 >= 10 ? scope.$index+1 : ('0'+(scope.$index+1)).toString()}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70px;">
            <i class="el-icon-star-off" style="font-size: 18px;cursor: pointer"></i>
            <i class="el-icon-download" style="margin-left: 10px;font-size: 18px;cursor:pointer;"></i>
          </el-table-column>
          <el-table-column label="音乐标题" prop="name" align="center"></el-table-column>
          <el-table-column label="时长" prop="dt" width="80px;"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--分页-->
  </div>
</template>

<script>
export default {
  name: "SingerAlbum",
  data(){
    return {
      // 歌手专辑查询条件
      queryInfo:{
        id: this.$route.params.id,
        limit: 4,
        offset: 0,
      },
      // 当前歌手的id
      singerId:this.$route.params.id,
      //歌手热门50首
      hot50Songs: [],
      //50首默认展示10首
      defaultShow: 10,
      //父组件当前播放的音乐的id
      curId: parseInt(window.localStorage.getItem('curPlayMusicId')),
      //当前歌手热门专辑信息(不包含专辑内含的歌曲)
      hotAlbum: [],
      //当前歌手专辑内歌曲信息
      albumMusicInfo: [],
      // 是否显示显示50首的按钮
      buttonVisible: true
    }
  },
  created() {
    //获取歌曲热门50首歌
    this.getHot50Music();
    //获得歌手的热门专辑信息
    this.getHotAlbum()
    /**
     * 注册监听的事件 在main.js中定义了
     * (监听当前播放音乐的id变化 响应式的切换当前播放的音乐的前缀图标)
     */
    window.addEventListener('setCurPlayMusicId',this.listenerSetCurPlayMusicId);
  },
  beforeDestroy() {
    window.removeEventListener('setCurPlayMusicId',this.listenerSetCurPlayMusicId)
  },
  methods:{
    listenerSetCurPlayMusicId(){
      this.curId = parseInt(localStorage.getItem('curPlayMusicId'));
    },
    //获取歌曲热门50首歌
    getHot50Music(){
      this.$http.get({
        url:'/artist/top/song',
        params:{id: this.singerId}
      }).then(({data:res})=>{
        if(res.code === 200){
          this.hot50Songs = res.songs;
          //处理时长数据
          this.hot50Songs.forEach(item => {
            const dt = new Date(item.dt);
            const mm = (dt.getMinutes() + '').padStart(2, '0');
            const ss = (dt.getSeconds() + '').padStart(2, '0');
            item.dt = mm + ':' + ss
          })
        }
      })
    },
    // 获取歌手热门专辑
    getHotAlbum(){
      this.$http.get({
        url: '/artist/album',
        params: this.queryInfo
      }).then(({data:res})=>{
        if(res.code === 200){
          this.hotAlbum = res.hotAlbums;
          this.hotAlbum.forEach(item => {
            this.$http.get( {
              url: '/album',
              params: {id: item.id}
            }).then(res => {
              //处理时长 再放入数据
              res.data.songs.forEach(item => {
                const dt = new Date(item.dt)
                const mm = (dt.getMinutes() + '').padStart(2, '0')
                const ss = (dt.getSeconds() + '').padStart(2, '0')
                item.dt = mm + ':' + ss
              })
              this.albumMusicInfo.push(res.data)
            })
          })
          //处理时长数据
          this.hotAlbum.forEach(item => {
            const dt = new Date(item.dt)
            const mm = (dt.getMinutes() + '').padStart(2, '0')
            const ss = (dt.getSeconds() + '').padStart(2, '0')
            item.dt = mm + ':' + ss
          })
        }
      })
    },
    // 切换当前显示热门50首
    changeDefaultNum(){
      if(this.defaultShow === 10) {
        let main = window.document.getElementById('main');
        let scrollTop = main.scrollTop;
        this.defaultShow = 50;
        this.buttonVisible = false;
        this.$nextTick(() => {
          main.scrollTop = scrollTop;
        })
      }else{
        this.defaultShow = 10;
        this.buttonVisible = true;
      }
    },
    //播放专辑中的歌曲
    playAlbumMusic(row) {
      this.$emit('setSongListInfo', window.localStorage.getItem('playList').split(','), row.id)
    },
    //播放热门五十首
    playHot50Music(row) {
      let playList = []
      this.hot50Songs.forEach(item => {
        playList.push(item.id);
      });
      this.$emit('setSongListInfo', playList, row.id)
    },
  }
}
</script>

<style scoped>

</style>