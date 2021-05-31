<template>
  <div style="margin-top: 25px;margin-bottom: 55px;">
    <!--用于定位-->
    <div id="singerMv"></div>
    <el-row v-for="(list,index) in showSingerMv()" :key="index">
      <el-col
          v-for="(item,index) in list" :key="index"
          style="margin-top: 20px"
          :span="8">
        <div style="position: relative;margin:0 auto;">
          <!--播放量-->
          <div style="background: rgba(128,128,128,0.2);color: white;position:absolute;z-index: 10;right: 23%;top: 0">
            <i class="el-icon-headset" style="margin-right: 5px;"></i>
            {{item.playCount >= 10000 ? (item.playCount/10000).toFixed(0)+'万' : item.playCount}}
          </div>
          <el-image
              :src="item.imgurl"
              @click="toMvPage(item.id)"
              style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer;width: 80%">
          </el-image>
          <h1 @click="toMvPage(item.id)" style="cursor:pointer;width: 80%;text-align: center">{{item.name}}</h1>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="singerMvList.length === 0">
      <el-table :border="false" style="border: 1px solid red;margin: 10px 0;"></el-table>
    </el-row>
    <!--分页-->
    <el-pagination background :page-size="queryInfo.limit"
                   layout="prev, next, jumper" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "SingerMv",
  data(){
    return {
      // 当前歌手id
      singerId: this.$route.params.id,
      // 查询条件
      queryInfo:{
        id: this.$route.params.id,
        limit: 9,
        offset: 0
      },
      //当前歌手mv信息
      singerMvList: []
    }
  },
  created() {
    //查询当前歌手mv的信息
    this.getCurrentSingerMv();
  },
  methods:{
    // 查询当前歌手的信息
    getCurrentSingerMv(){
      this.$http.get({
        url: '/artist/mv',
        params: this.queryInfo
      }).then(({data:res})=>{
        if(res.code === 200){
          this.singerMvList = res.mvs;
        }
      })
    },
    // 要展示的Mv信息列表，一行3个
    showSingerMv(){
      const number = 3;
      let list  = [];
      for(let i=1;i<=this.singerMvList.length/number+1;i++){
        list.push(this.singerMvList.slice((i-1)*number,i*number));
      }
      return list;
    },
    //跳转mv界面
    toMvPage(mvId) {
      this.$router.push('/toVideoPage/'+mvId)
    },
    //分页插件页数改变
    handleCurrentChange(newPage) {
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit;
      this.$nextTick(()=>{
        window.document.getElementById('singerMv').scrollIntoView({
          block: 'start',
        })
      });
      this.getCurrentSingerMv();
    },
  }
}
</script>

<style scoped>

</style>