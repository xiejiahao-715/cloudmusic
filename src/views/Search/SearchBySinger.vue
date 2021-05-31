<template>
  <div style="margin-bottom: 50px;">
    <el-row
        v-for="(item,index) in singerList" :key="index"
        style="margin-top: 25px;">
      <el-col
          :span="12" :offset="6"
          style="display: flex;align-items: center"
          :style="index % 2 === 0 ? 'background: rgb(245,245,247)' : ''">
        <el-image v-if="item.picUrl !== null" :src="item.picUrl" style="width: 100px;height: 100px;cursor: pointer;" @click="toSingerPage(item.id)"></el-image>
        <el-image v-else :src="item.img1v1Url" style="width: 100px;height: 100px;cursor: pointer;" @click="toSingerPage(item.id)"></el-image>
        <div style="margin-left: 20px">{{item.name}}</div>
      </el-col>
    </el-row>
    <div v-if="this.singerList.length === 0" style="text-align: center;margin-top: 15px">无法搜索到适合的歌手</div>
    <!--分页-->
    <div style="display:flex;margin-top: 15px;justify-content: center">
      <el-pagination
          background
          layout="prev, pager, next" :page-size="queryInfo.limit"
          :total="singerTotal" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBySinger",
  data(){
    return {
      searchData: decodeURIComponent(this.$route.params.data),
      queryInfo: {
        keywords: this.$route.params.data,
        limit: 30,
        offset: 0,
        type: 100
        /* type
            默认为1
            1: 单曲
            100:歌手
            1000:歌单
            1014:视频
        */
      },
      //查询结果总数
      singerTotal: 0,
      //歌曲数的结果集
      singerList: [],
    }
  },
  created() {
    this.getSingerResult();
  },
  methods:{
    // 查询搜索的歌手结果集
    getSingerResult(){
      this.$http.get({
        url: '/search',
        params: this.queryInfo
      }).then(({data:res})=>{
        this.singerList = res.result.artists;
        this.singerTotal = res.result.artistCount;
      })
    },
    //跳转歌手页
    toSingerPage(id) {
      this.$router.push('/singer/' + id)
    },
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit;
      if (this.queryInfo.offset >= this.songTotal) this.queryInfo.offset = this.songTotal;
      this.$nextTick(()=>{
        let main = window.document.getElementById('main');
        main.scrollTop = 0;
      });
      this.getSingerResult();
    }
  }
}
</script>

<style scoped>

</style>