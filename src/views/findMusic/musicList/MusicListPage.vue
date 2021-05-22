<template>
  <div>
    <div style="display: flex;">
      <p>热门标签:</p>
      <p style="margin-left: 15px;cursor: pointer;"
         v-for="(item,index) in hotMusicListTags" :key="index"
         @click="changeMusicListCat(item.name)"
         :class="{'tag':true,'active':queryInfo.cat === item.name}">{{item.name}}</p>
    </div>
    <div>
      <el-row :gutter="10" v-for="(list,i) in formatGoodMusicList()" :key="i">
        <el-col
            v-for="(item,index) in list" :key="index"
            style="margin-top: 20px;position:relative;"
            :span="4">
          <!--播放量-->
          <div style="background-color: rgba(128,128,128,0.2);color: white;width: 96%;position:absolute;z-index: 10;">
            <div style="float:right;">
              <i class="el-icon-headset" style="margin-right: 5px;"></i>
              {{item.playCount >= 10000 ? (item.playCount/10000).toFixed(0)+'万' : item.playCount}}
            </div>
          </div>
          <div>
            <el-image
                :src="item.coverImgUrl"
                @click="toSongListPage(item.id)"
                style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
            </el-image>
          </div>
          <h1 @click="toSongListPage(item.id)" style="cursor:pointer;">{{item.name}}</h1>
        </el-col>
      </el-row>
      <!--分页-->
      <el-pagination
          :page-size="queryInfo.limit"
          :total="goodMusicListTotal"
          @current-change="handleCurrentChange"
          layout="prev, pager, next">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "MusicListPage",
  data(){
    return {
      // 热门歌单分类标签
      hotMusicListTags: [],
      //精品歌单的列表
      goodMusicList: [],
      //精品歌单分类查询条件
      queryInfo: {
        cat: '全部',
        limit: 24,
        offset: 0,
      },
      //精品歌单的总数
      goodMusicListTotal: 0,
    }
  },
  created() {
    this.getHotMusicListTags();
    this.getGoodMusicList();
  },
  methods:{
    // 获取热门歌单标签信息
    getHotMusicListTags(){
      this.$http.get({url:'playlist/hot'})
      .then(({data:res})=>{
        this.hotMusicListTags = res.tags;
      })
    },
    //获取精品歌单
    getGoodMusicList(){
      this.$http.get({
        url: '/top/playlist',
        params:this.queryInfo
      }).then(({data:res})=>{
        this.goodMusicList =res.playlists;
        this.goodMusicListTotal = res.total;
      })
    },
    // 格式化歌单数组
    formatGoodMusicList(){
      const list = [];
      for(let i = 1;i<=this.goodMusicList.length/6+1;i++){
       list.push(this.goodMusicList.slice((i-1)*6,i*6));
      }
      return list;
    },
    // 当换页时触发
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit;
      this.getGoodMusicList();
    },
    //点击标签筛选
    changeMusicListCat(newCat){
      console.log(newCat);
      if(this.queryInfo.cat === newCat){
        this.queryInfo.cat = '全部';
      }else{
        this.queryInfo.cat = newCat;
      }
      this.getGoodMusicList();
    },
    // 点击歌单跳转页面
    toSongListPage(id){
      this.$router.push('/songlist/'+id);
    }
  },
}
</script>

<style scoped lang="less">
.tag:hover{
  color: red;
}
// 被点击的分类标签类名显示的颜色
.active{
  color: red;
}
</style>