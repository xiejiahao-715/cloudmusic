<template>
  <div>
    <div style="display: flex;width: 100%;justify-content: center;">
      <el-menu
          :default-active="videoPageActivePath" :router="true" mode="horizontal" @select="selectMenuItem">
        <el-menu-item index="/videoPage">视频</el-menu-item>
        <el-menu-item index="/mvPage">MV</el-menu-item>
      </el-menu>
    </div>
    <div style="border-top: solid 1px #e6e6e6;position: relative;top: -1px;"></div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "VideoPlayPage",
  data(){
    return {
      // video模块的菜单展开项
      videoPageActivePath : window.sessionStorage.getItem('videoPageActivePath')===null ? '/videoPage' :  window.sessionStorage.getItem('videoPageActivePath'),
    }
  },
  beforeDestroy() {
    window.sessionStorage.removeItem('videoPageActivePath');
  },
  methods:{
    selectMenuItem(index) {
      if(index !== this.videoPageActivePath){
        this.videoPageActivePath = index;
        window.sessionStorage.setItem('videoPageActivePath',index);
      }
    }
  }
}
</script>

<style scoped lang="less">
.el-menu.el-menu--horizontal {
  border-bottom: 0;
}
.el-menu-item.is-active {
  color: black;
  border-bottom: 2px solid red !important;
}
</style>