<template>
  <div>
    <!--官方榜单信息渲染-->
    <el-row style="border-bottom: 2px solid rgb(230,230,230)">
      <p style="margin-bottom: 10px;font-size: 22px;">官方榜</p>
    </el-row>
    <el-row style="margin-top: 25px;">
      <el-col
          v-for="(item,index) in officialRankList.slice(0,3)" :key="index"
          :offset="index === 0 ? 1 : 2"
          style="margin-top: 25px;"
          :span="6">
        <el-image
            :src="item.coverImgUrl" fit="fitHeight"
            @click="toSongListPage(item.id)"
            style="height: 200px;border-radius: 15px;cursor:pointer;"></el-image>
        <el-table
            :data="item.tracks"
            :show-header="false" stripe>
          <el-table-column type="index">
            <template #default="scope">
              <span style="color: red;font-weight: 400">{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="first"></el-table-column>
          <el-table-column>
            <template #default="scope">
              <span>{{scope.row.second}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top: 25px;">
      <el-col :span="6" :offset="1" style="margin-top: 25px;">
        <el-image
            :src="singerRankInfo.coverUrl"
            style="height: 200px;border-radius: 15px;"></el-image>
        <el-table :data="singerRankInfo.artists"
                  stripe :show-header="false">
          <el-table-column>
            <template #default="scope">
              <span style="color: red;font-weight: 400">{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="first"></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!--全球榜-->
    <el-row style="border-bottom: 2px solid rgb(230,230,230)">
      <p style="margin-bottom: 10px;font-size: 22px;">全球榜</p>
    </el-row>
    <el-row :gutter="10" v-for="(list,i) in globalRankList" :key="i" style="margin-top: 10px">
      <el-col
          v-for="(item,index) in list"
          :key="index" style="margin-top: 20px;position:relative;"
          :span="4">
        <!--播放量-->
        <div style="background: rgba(128,128,128,0.2);color: white;width: 96%;position:absolute;z-index: 10;">
          <div style="float:right;">
            <i class="el-icon-headset" style="margin-right: 5px;"></i>
            {{item.playCount >= 10000 ? (item.playCount/10000).toFixed(0)+'万' : item.playCount}}
          </div>
        </div>
        <div>
          <el-image
              @click="toSongListPage(item.id)"
              :src="item.coverImgUrl" style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer"></el-image>
        </div>
        <h1 @click="toSongListPage(item.id)" style="cursor:pointer;">{{item.name}}</h1>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "MusicRank",
  data(){
    return {
      // 官方排行榜的所有数据
      officialRankList: [],
      // 歌手榜信息
      singerRankInfo: [],
    }
  },
  created() {
    this.getOfficialRankList();
  },
  computed:{
    globalRankList(){
      const list= [];
      const number = 6;
      for(let i=1;i<=this.officialRankList.length/number+1;i++){
        list.push(this.officialRankList.slice((i-1)*number,i*number));
      }
      return list;
    }
  },
  methods:{
    //获得官方榜单的数据
    getOfficialRankList(){
      this.$http.get({url:'/toplist/detail'})
      .then(({data:res})=>{
        this.officialRankList = res.list;
        this.singerRankInfo = res.artistToplist;
      })
    },
    // 点击歌单跳转界面
    toSongListPage(id) {
      this.$router.push('/songlist/' + id)
    },
  },
}
</script>

<style scoped lang="less">
</style>