<template>
  <div style="overflow-x: hidden">
    <div style="border-bottom: 1px solid rgb(230,230,230);height: 60px">
      <el-menu
          :default-active=activePath
          :router="true"
          mode="horizontal"
          style="margin: 0 auto;width: 420px;">
        <el-menu-item index="/diyRecommend">个性推荐</el-menu-item>
        <el-menu-item index="/musicListPage">歌单</el-menu-item>
        <el-menu-item index="/musicRank">排行榜</el-menu-item>
        <el-menu-item index="/singerList">歌手</el-menu-item>
        <el-menu-item index="/newMusicList">最新音乐</el-menu-item>
      </el-menu>
    </div>
    <keep-alive>
      <router-view
          ref="child"
          @setParentMusicUrl="setParentMusicUrl"
          @setSongListInfo="setSongListInfo"></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "FindMusic",
  data(){
    return {
      activePath: window.sessionStorage.getItem('findMusic_activePath') ? window.sessionStorage.getItem('findMusic_activePath'): '/diyRecommend'
    }
  },
  watch:{
    $route(to){
      window.sessionStorage.setItem('findMusic_activePath',to.fullPath);
    }
  },
  methods:{
    //调用父组价设置音乐url
    setParentMusicUrl(url,detail) {
      this.$emit('setMusicUrl',url,detail)
    },
    //调用父组件设置歌单信息, 跟当前曲目
    setSongListInfo(playlist,musicId){
      this.$emit('setSongListInfo', playlist, musicId)
    }
  }
}
</script>

<style scoped lang="less">
  .el-menu.el-menu--horizontal {
    border-bottom: 0;
  }
  /deep/.el-menu-item.is-active {
    color: black;
    border-bottom: 2px solid red ;
  }
</style>