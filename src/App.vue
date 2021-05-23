<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default{
  watch:{
    $route(to){
      if(to.path === '/findMusic'){
        this.$router.push(window.sessionStorage.getItem('findMusic_activePath') === null ? '/diyRecommend' : window.sessionStorage.getItem('findMusic_activePath'));
      }
    }
  },
}
</script>

<style lang="less">

</style>
