<template>
  <!--key改变后全部重新渲染-->
  <div :key="$route.params.data">
    <!--头部区域-->
    <el-menu
        :default-active="activePath+`${this.$route.params.data}`"
        :router="true" mode="horizontal"
        style="margin: 0 auto;width: 420px;">
      <el-menu-item :index="/searchBySong/+`${this.$route.params.data}`" ref="songClick">单曲</el-menu-item>
      <el-menu-item :index="/searchBySinger/+`${this.$route.params.data}`">歌手</el-menu-item>
      <el-menu-item :index="/searchByVideo/+`${this.$route.params.data}`">视频</el-menu-item>
      <el-menu-item :index="/searchByPlayList/+`${this.$route.params.data}`">歌单</el-menu-item>
    </el-menu>
    <!--分界线-->
    <div style="border-bottom: 1px solid rgb(230,230,230);position: relative;top: -1px;z-index: -1"></div>
    <keep-alive>
      <router-view ref="child" @setMusicUrl="setMusicUrl"></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "SearchPage",
  data(){
    return{
      // 菜单组件默认激活的状态
      activePath: window.sessionStorage.getItem('search_activePath') === null ? '/searchBySong/' : window.sessionStorage.getItem('search_activePath')
    }
  },
  created() {
    this.toSingSearchPage(1);
  },
  beforeDestroy() {
    window.sessionStorage.removeItem('search_activePath');
  },
  methods:{
    // type = 0 代表是main组件控制的跳转 type =1 代表是本组件控制的跳转
    toSingSearchPage(type) {
      //decodeURIComponent参数解码
      //等待数据赋值后,马上自执行一次路由跳转加载子组件
      const href = this.$route.fullPath;
      if(type === 0) {
        this.activePath = '/searchBySong/';
      }
      if (href === '/search/' + encodeURIComponent(this.$route.params.data)) {
        // 说明第一次进入该组件  进行一次自动跳转
        this.$router.push('/searchBySong/' +encodeURIComponent(this.$route.params.data));
      }
    },
    //调用父类方法
    setMusicUrl(url,detail) {
      this.$emit('setMusicUrl', url,detail);
    }
  },
  watch:{
    $route(to){
      if(to.fullPath.match(/^(\/[A-Za-z]+\/).*$/).length > 0){
        window.sessionStorage.setItem('search_activePath',RegExp.$1);
      }
    }
  }
}
</script>

<style scoped>

</style>