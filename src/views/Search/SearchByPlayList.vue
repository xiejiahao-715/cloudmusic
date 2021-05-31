<template>
  <div style="margin-bottom: 50px;">
    <el-row
        v-for="(item,index) in playList"  :key="index"
        style="margin-top: 25px;">
      <el-col
          :span="18" :offset="4"
          style="display: flex;align-items: center;"
          :style="index % 2 === 0 ? 'background: rgb(245,245,247)' : ''">
        <el-image :src="item.coverImgUrl" style="width: 100px;height: 100px;" @click.native="toPlayListPage(item.id)"></el-image>
        <div style="display: flex;flex: 1;flex-wrap:wrap;margin-left: 10px;">
          <div style="flex: 1">{{item.name}}</div>
          <div style="flex: 1">{{item.trackCount}}首</div>
          <div style="flex: 1">by {{item.creator.nickname}}</div>
        </div>
      </el-col>
    </el-row>
    <!--分页-->
    <el-pagination
        style="display: block;width: 20%;margin: 15px auto"
        layout="prev, pager, next" :page-size="queryInfo.limit"
        :total="playListTotal" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "SearchByPlayList",
  data(){
    return {
      searchData: decodeURIComponent(this.$route.params.data),
      // 当前的搜索条件
      queryInfo:{
        keywords: decodeURIComponent(this.$route.params.data),
        limit: 12,
        offset: 0,
        type: 1000
      },
      //查询结果总数
      playListTotal: 0,
      //歌曲数的结果集
      playList: [],
    }
  },
  created() {
    this.getPlayListResult();
  },
  methods:{
    // 查询搜索的歌手结果集
    getPlayListResult(){
      this.$http.get({
        url: '/search',
        params: this.queryInfo
      }).then(({data:res})=>{
        this.playList = res.result.playlists;
        this.playListTotal = res.result.playlistCount;
      })
    },
    //跳转歌单页面
    toPlayListPage(id) {
      this.$router.push('/songlist/'+id);
    },
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit;
      if (this.queryInfo.offset >= this.songTotal) this.queryInfo.offset = this.songTotal;
      this.$nextTick(()=>{
        let main = window.document.getElementById('main');
        main.scrollTop = 0;
      });
      this.getPlayListResult();
    }
  }
}
</script>

<style scoped>

</style>