<template>
  <!--该组件对应的路由 /mvPage-->
  <div style="margin-top: 10px;margin-bottom: 20px;">
    <div class="header">
      <p>
        地区:
        <span
            @click="changeQueryInfo('area',item.name)"
            :class="[item.name === queryInfo.area ? 'isActive' : '']"
            v-for="(item,index) in areas" :key="index">
          {{item.name}}
        </span>
      </p>
      <p>
        分类:
        <span
            @click="changeQueryInfo('type',item.name)"
            :class="[item.name === queryInfo.type ? 'isActive' : '']"
            v-for="(item,index) in types" :key="index">
          {{item.name}}
        </span>
      </p>
      <p>
        排序:
        <span
            @click="changeQueryInfo('order',item.name)"
            :class="[item.name === queryInfo.order ? 'isActive' : '']"
            v-for="(item,index) in order" :key="index">
          {{item.name}}
        </span>
      </p>
    </div>
    <el-row :gutter="10" type="flex" style="flex-wrap: wrap">
      <el-col
          :span="6"
          v-for="(item,index) in mvList" :key="index"
          style="margin-top: 20px;position:relative;">
        <div>
          <el-image :src="item.cover" @click="toMvPage(item.id)"
                    style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
          </el-image>
        </div>
        <!--播放量-->
        <div style="color: white;width: 96%;position:absolute;top:0;z-index: 10;">
          <div style="float:right;">
            <i class="el-icon-headset" style="margin-right: 5px;"></i>
            {{item.playCount >= 10000 ? (item.playCount/10000).toFixed(0)+'万' : item.playCount}}
          </div>
        </div>
        <h1 @click="toMvPage(item.id)" style="cursor:pointer;word-wrap:break-word;">{{item.name}}</h1>
      </el-col>
    </el-row>
    <!--分页-->
    <el-pagination
        background
        :current-page="currentPage"
        layout="prev,next"  :page-size="queryInfo.limit"
        @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "MvListTable",
  data(){
    return {
      //分类查询条件
      queryInfo: {
        type: '全部',
        area: '全部',
        order: '上升最快',
        limit: 12,
        offset: 0,
      },
      //类型分类标签
      types: [
        {id: -1, name: '全部'},
        {id: 1, name: '官方版'},
        {id: 2, name: '原生'},
        {id: 3, name: '现场版'},
        {id: 4, name: '网易出品'}
      ],
      //地区分类
      areas: [
        {id: -1, name: '全部'},
        {id: 7, name: '内地'},
        {id: 96, name: '港台'},
        {id: 8, name: '欧美'},
        {id: 16, name: '日本'},
        {id: 0, name: '韩国'}
      ],
      //排序数据
      order: [
        {id: 1, name: '上升最快'},
        {id: 2, name: '最热'},
        {id: 3, name: '最新'}
      ],
      //mv数据
      mvList: [],
      // 当前的页数
      currentPage: 1
    }
  },
  created() {
    this.getMvList();
  },
  methods:{
    //获取Mv数据
    getMvList(){
      this.$http.get({
        url: '/mv/all',
        params: this.queryInfo
      }).then(res=>{
        this.mvList = res.data.data;
        // 通过为dom节点添加属性来控制分页插件的 下一页 按钮是否可用
        if(res.data.hasmore === true)
          window.document.getElementsByClassName('btn-next')[0].removeAttribute('disabled');
        else
          window.document.getElementsByClassName('btn-next')[0].setAttribute('disabled','disabled');
        if(this.mvList.length ===0){
          this.$message.warning(res.data.msg);
        }
      })
    },
    // 更改查询条件
    changeQueryInfo(select,name){
      this.queryInfo[select] = name;
      this.getMvList();
      this.currentPage = 1;
    },
    //跳转MV详情页
    toMvPage(id) {
      this.$router.push('/toVideoPage/' + id);
    },
    //分页插件页数改变
    handleCurrentChange(newPage) {
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
      this.getMvList();
    },
  }
}
</script>

<style scoped lang="less">
.header{
  span{
    margin-left: 25px;
    cursor: pointer;
  }
  span:hover{
    color: red;
  }
}
.isActive{
  color: red;
}
</style>