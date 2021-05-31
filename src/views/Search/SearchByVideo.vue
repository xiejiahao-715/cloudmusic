<template>
  <div style="margin-bottom: 50px;">
    <el-row :gutter="10" v-for="(list,index) in showVideo()" :key="index">
      <el-col
          :span="4" v-for="(item,index) in list" :key="index"
          style="margin-top: 20px;position:relative;">
        <!--播放量-->
        <div style="background: rgba(128,128,128,0.2);color: white;width: 96%;position:absolute;z-index: 10;">
          <div style="float:right;">
            <i class="el-icon-headset" style="margin-right: 5px;"></i>
            {{item.playTime >= 10000 ? (item.playTime/10000).toFixed(0)+'万' : item.playTime}}
          </div>
        </div>
        <div>
          <el-image
              :src="item.coverUrl"
              @click="toVideoPage(item.vid)"
              fit="contain"
              style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
          </el-image>
        </div>
        <h1 @click="toVideoPage(item.vid)" style="cursor:pointer;">{{item.title}}</h1>
      </el-col>
    </el-row>
    <!--分页-->
    <el-pagination
        style="display: block;width: 20%;margin: 15px auto"
        layout="prev, pager, next" :page-size="queryInfo.limit"
        :total="videoTotal" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "SearchByVideo",
  data(){
    return {
      searchData: decodeURIComponent(this.$route.params.data),
      // 当前的搜索条件
      queryInfo:{
        keywords: decodeURIComponent(this.$route.params.data),
        limit: 30,
        offset: 0,
        type: 1014
      },
      //查询结果总数
      videoTotal: 0,
      //歌曲数的结果集
      videoList: [],
    }
  },
  created() {
    this.getVideoResult();
  },
  methods:{
    // 查询搜索的视频结果集
    getVideoResult(){
      this.$http.get({
        url: '/search',
        params: this.queryInfo
      }).then(({data:res})=>{
        this.videoList = res.result.videos;
        this.videoTotal = res.result.videoCount;
      })
    },
    //跳转视频播放页
    toVideoPage(id) {
      // \D 表示匹配一个非数字字符
      if (id.match(/\D/)!=null) {
        this.$router.push('/videoPlay/' + id);
      } else {
        this.$router.push('/toVideoPage/' + id);
      }
    },
    // 展示视频 将数组进行处理
    showVideo(){
      let number = 6;
      let list = [];
      for(let i=1;i<=this.videoList.length/number+1;i++){
        if(this.videoList.slice((i-1)*number,i*number).length>0) {
          list.push(this.videoList.slice((i - 1) * number, i * number));
        }
      }
      return list;
    },
    // 分页插件
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit;
      if (this.queryInfo.offset >= this.songTotal) this.queryInfo.offset = this.songTotal;
      this.$nextTick(()=>{
        let main = window.document.getElementById('main');
        main.scrollTop = 0;
      });
      this.getVideoResult();
    }
  }
}
</script>

<style scoped>

</style>