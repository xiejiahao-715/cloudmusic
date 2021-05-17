<template>
  <div style="margin-bottom: 50px">
    <div style="height: 80px">
      <p>
        <span>语种:</span>
        <span
            v-for="(item,index) in singerLanguage" :key="index"
            :class="['areas',queryInfo.area === item.id ? 'isActive':'']"
            @click="changeMusicListArea(item.id)"
            style="margin-left: 25px;cursor: pointer;">{{item.name}}</span>
      </p>
      <p>
        <span>分类:</span>
        <span
            v-for="(item,index) in  singerType" :key="index"
            :class="['areas',queryInfo.type === item.id ? 'isActive':'']"
            @click="changeMusicListType(item.id)"
            style="margin-left: 25px;cursor: pointer;">{{item.name}}</span>
      </p>
    </div>
    <div>
      <el-row v-for="(list,i) in showSingerList" :key="i"
          :gutter="10">
        <el-col
            v-for="(item,index) in list" :key="index"
            style="margin-top: 20px;position:relative;"
            :span="4">
          <div>
            <el-image
                :src="item.img1v1Url"
                style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
              <template #placeholder>
                <div>加载中</div>
              </template>
            </el-image>
          </div>
          <h1  style="cursor:pointer;">{{item.name}}</h1>
        </el-col>
      </el-row>
      <!--分页-->
      <el-pagination
          layout="prev,next,jumper" background
          :current-page.sync="currentPage"
          :page-size="queryInfo.limit"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "SingerList",
  data(){
    return {
      //歌手分类查询条件
      queryInfo: {
        type: -1,
        area: -1,
        limit: 12,
        offset: 0,
      },
      //歌手语种分类
      singerLanguage: [
        {id: -1, name: '全部'},
        {id: 7, name: '华语'},
        {id: 96, name: '欧美'},
        {id: 8, name: '日本'},
        {id: 16, name: '韩国'},
        {id: 0, name: '其他'}
      ],
      //歌手类型分类标签
      singerType: [
        {id: -1, name: '全部'},
        {id: 1, name: '男歌手'},
        {id: 2, name: '女歌手'},
        {id: 3, name: '乐队'}
      ],
      //歌手数据
      singerList: [],
      // 当前页数
      currentPage: 1
    }
  },
  created() {
    this.getSingerList();
  },
  computed:{
    // 格式化歌手列表数据，保证每6个为一组进行显示
    showSingerList(){
      const list = [];
      const number = 6;
      for(let i=1;i<=this.singerList.length/number+1;i++){
        list.push(this.singerList.slice((i-1)*number,i*number));
      }
      return list;
    },
  },
  methods: {
    // 获取歌手数据
    getSingerList() {
      return this.$http.get({
        url: '/artist/list',
        params: this.queryInfo
      }).then(({data: res}) => {
        if (res.code === 200) {
          this.singerList = res.artists;
          if(res.artists.length === 0){
            this.$message.error('没有那么多歌手，请减少页数');
          }
        } else {
          this.$message.error('获取歌手数据失败');
        }
      })
    },
    //改变语种分类
    changeMusicListArea(areaId){
      this.queryInfo.area = areaId;
      this.queryInfo.offset = 0;
      if(this.currentPage === 1){
        this.getSingerList();
      }
      this.currentPage = 1;
    },
    //改变类型分类
    changeMusicListType(typeId){
      this.queryInfo.type = typeId;
      this.queryInfo.offset = 0;
      if(this.currentPage === 1){
        this.getSingerList();
      }
      this.currentPage = 1;
    },
  },
  watch:{
    // 使用water监听分页的改变
    async currentPage(newValue,oldValue){
      this.queryInfo.offset = (newValue - 1) * this.queryInfo.limit;
      await this.getSingerList();
      if(this.singerList.length === 0){
        this.currentPage = oldValue;
      }
    }
  }
}
</script>

<style scoped>
.areas:hover{
  color: red;
}
.isActive{
  color: red;
}
</style>