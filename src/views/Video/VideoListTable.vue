<template>
  <!--该组件对应的路由 /videoPage-->
  <div style="margin-bottom: 50px;margin-top: 10px;">
    <div>
      <el-button @click="showTagDialog" size="mini">全部分类</el-button>
      <span style="margin-left: 10px;">
        当前分类：<el-tag>{{currentTag}}</el-tag>
      </span>
      <el-dialog title="全部标签" :visible.sync="tagDialogTableVisible" :modal="false">
        <el-tag
            @click="changeTag(item.id)"
            v-for="(item,index) in tags" :key="index" class="tag"
            :class="[item.id === queryInfo.id ? 'tagActive' : '']">
          {{item.name}}
        </el-tag>
      </el-dialog>
    </div>
    <!--使flex布局里面的元素自动换行-->
    <el-row :gutter="10" type="flex" style="flex-wrap: wrap">
      <el-col
          :span="6" style="margin-top: 20px;position: relative"
          v-for="(item,index) in videoList" :key="index">
        <!--播放量-->
        <div style="color: white;width: 96%;position:absolute;z-index: 10;">
          <div style="float:right;">
            <i class="el-icon-headset" style="margin-right: 5px;"></i>
            {{item.data.playTime >= 10000 ? (item.data.playTime/10000).toFixed(0)+'万' : item.data.playTime}}
          </div>
        </div>
        <div>
          <el-image
              :src="item.data.coverUrl"
              @click="toVideoPage(item.data.vid)"
              style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
          </el-image>
        </div>
        <h1 @click="toVideoPage(item.data.vid)" style="cursor:pointer;">{{item.data.title}}</h1>
      </el-col>
    </el-row>
    <!--分页-->
    <el-pagination
        ref="paginationRef"
        :current-page.sync="currentPage"
        layout="prev, next" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "VideoListTable",
  data(){
    return {
      // 视屏标签信息
      tags:[],
      tagDialogTableVisible: false,
      // 查询视频条件
      queryInfo:{
        id: 58100,
        offset: 0
      },
      //视频列表
      videoList: [],
      // 当前的页码数
      currentPage: 1,
    }
  },
  computed:{
    currentTag(){
      let index = this.tags.findIndex((currentValue)=>{
        return currentValue.id === this.queryInfo.id;
      });
      if(index > -1){
        return this.tags[index].name;
      }else{
        return '无';
      }
    }
  },
  created() {
    //获取视频标签
    this.getVideoTags();
    //获取视频信息
    this.getVideoList()
  },
  methods:{
    //获取视频标签
    getVideoTags(){
      this.$http.get({
        url:'/video/group/list'
      }).then((res=>{
        this.tags = res.data.data;
      }))
    },
    //获取视频信息
    getVideoList() {
      if (window.localStorage.getItem('currentUserInfo') === 'null' || window.localStorage.getItem('currentUserInfo')===null) {
        return this.$message.error('需要登录获取视频数据!');
      }else{
        this.$http.get({
          url:'/video/group',
          params: this.queryInfo
        }).then(res => {
          this.videoList = res.data.datas;
          // 通过为dom节点添加属性来控制分页插件的 下一页 按钮是否可用
          if(res.data.hasmore === true)
            window.document.getElementsByClassName('btn-next')[0].removeAttribute('disabled');
          else
            window.document.getElementsByClassName('btn-next')[0].setAttribute('disabled','disabled');
          if(this.videoList.length ===0){
            this.$message.warning(res.data.msg);
          }
        })
      }
    },
    //跳转视频播放页
    toVideoPage(id) {
      this.$router.push('/videoPlay/' + id);
    },
    // 展示标签的对话框
    showTagDialog() {
      this.tagDialogTableVisible = true
    },
    //切换标签
    changeTag(tagId) {
      this.queryInfo.id = tagId;
      this.getVideoList();
      this.tagDialogTableVisible = false;
      this.currentPage = 1;
    },
    //处理页面
    handleCurrentChange(newPage) {
      this.queryInfo.offset = (newPage-1)*8;
      this.getVideoList();
    },
  }
}
</script>

<style scoped lang="less">
.tag {
  cursor: pointer;
  margin-left: 15px;
  margin-top: 15px;
  background-color: white;
}
.tagActive{
  color: red;
}
</style>