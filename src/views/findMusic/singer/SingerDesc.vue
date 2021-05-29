<template>
  <div>
    <div v-for="(item,index) in singerDesc" :key="index">
      <h4>{{item.ti}}</h4>
      <span v-html="item.txt"></span>
    </div>
    <div v-if="singerDesc.length === 0" style="text-align: center">无(该页面有待完善)</div>
  </div>
</template>

<script>
export default {
  name: "Singer",
  data(){
    return {
      // 当前歌手id
      singerId: this.$route.params.id,
      // 当前歌手详情
      singerDesc: []
    }
  },
  created() {
    // 获取该歌手的详细经历
    this.getSingerDesc();
  },
  methods:{
    // 获取该歌手的详情
    getSingerDesc(){
      this.$http.get({
        url: '/artist/desc',
        params:{id:this.singerId}
      }).then(({data:res})=>{
        if(res.code === 200) {
          this.singerDesc = res.introduction;
          this.singerDesc.forEach(item => {
            item.txt = item.txt.replace(/▪/g, '<br/>▪');
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>