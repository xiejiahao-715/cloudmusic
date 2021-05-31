<template>
  <div>
    <!--头部信息-->
    <el-row>
      <el-image :src="singerInfo.artist.img1v1Url" style="width: 300px;height: 300px;"></el-image>
      <el-tag
          type="danger"
          style="position: absolute;left:330px;border: 1px solid rgb(198,47,47);background-color: rgb(198,47,47);color: white">歌手</el-tag>
      <span style="position: absolute;left: 390px;top: 2px;font-size: 20px;">{{singerInfo.artist.name}}</span>
      <i class="el-icon-headset" style="position:absolute;font-size: 15px;top: 80px;left: 330px;">
        单曲数: {{singerInfo.artist.musicSize}}
      </i>
      <i class="el-icon-first-aid-kit" style="position:absolute;font-size: 15px;top: 120px;left: 330px;">
        专辑数: {{singerInfo.artist.albumSize}}
      </i>
      <i class="el-icon-video-play" style="position:absolute;font-size: 15px;top: 160px;left: 330px;">
        MV数: {{singerInfo.artist.mvSize}}
      </i>
    </el-row>
    <el-main>
      <el-menu :default-active="fullActivePath" :router="true" mode="horizontal">
        <el-menu-item :index="'/album/'+`${this.singerId}`">专辑</el-menu-item>
        <el-menu-item :index="'/singerMv/'+`${this.singerId}`">MV</el-menu-item>
        <el-menu-item :index="'/singerDesc/'+`${this.singerId}`">歌手详情</el-menu-item>
      </el-menu>
      <keep-alive>
        <router-view @setSongListInfo="setSongListInfo"></router-view>
      </keep-alive>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "SingerDetail",
  data(){
    return {
      // 当前歌手的id
      singerId: this.$route.params.id,
      // 当前歌手的信息
      singerInfo: {
        artist: {
          img1v1Url: ''
        }
      },
      activePath: window.sessionStorage.getItem('singerDetail_activePath') !== null? window.sessionStorage.getItem('singerDetail_activePath'):'/album/'
    }
  },
  computed:{
    fullActivePath(){
      return this.activePath+this.singerId;
    }
  },
  created() {
    // 获取歌手的信息
    this.getSingerInfo();
    // 第一次进入本组件
    if(window.sessionStorage.getItem('singerDetail_activePath') === null){
      // 避免重复跳转
      if(this.$route.fullPath !== this.fullActivePath) {
        this.$router.push(this.fullActivePath);
      }
    }
  },
  beforeDestroy() {
    window.sessionStorage.removeItem('singerDetail_activePath');
  },
  methods:{
    getSingerInfo(){
      this.$http.get({
        url: '/artists',
        params:{id: this.singerId}
      }).then(({data:res})=>{
        if(res.code === 200){
          this.singerInfo = res;
        }
      })
    },
    //调用父类的方法播放音乐
    setSongListInfo(playList, curId) {
      this.$emit('setSongListInfo', playList, curId)
    }
  },
  watch:{
    $route(to){
      window.sessionStorage.setItem('singerDetail_activePath',/^(\/[a-zA-Z]+?\/)\d+$/.exec(to.fullPath)[1]);
    }
  },
}
</script>

<style scoped>

</style>