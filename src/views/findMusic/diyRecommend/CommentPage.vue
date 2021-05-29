<template>
  <div>
    <!--头部搜索框-->
    <div style="background-color: rgb(240,240,242);height: 130px;margin-top: 25px;">
      <el-input
          v-model="comment" type="text"
          show-word-limit maxlength="120" size="medium"
          style="display: inline-block;width: 98%;margin: 15px 15px;"></el-input>
      <el-button size="mini" style="float:right;margin-right: 14px;">评论</el-button>
    </div>
    <!--评论区域-->
    <div style="margin-bottom: 35px;">
      <h4 style="font-weight: 300;color: red" v-if="queryInfo.offset === 0 && hotCommentList.length>0">精彩评论</h4>
      <!--精彩评论的信息-->
      <div
          v-for="(item,i) in hotCommentList" :key="'hotCommentList'+i"
          style="position: relative;border-top: 2px solid rgb(240,240,242);
          border-bottom: 1px solid rgb(240,240,242);padding: 15px 0;font-size: 15px;">
        <!--用户头像-->
        <img :src="item.user.avatarUrl" alt=""
             style="display: inline;width: 50px;height: 50px;border-radius: 25px;">
        <!--评论信息-->
        <div style="margin-left: 60px;margin-top: -60px;">
          <p><span style="color: #4d99de;">{{item.user.nickname}}</span>: {{item.content}}</p>
          <br v-if="item.beReplied.length > 0">
          <!--子评论-->
          <div v-if="item.beReplied.length > 0"
               style="background-color: rgb(241,241,244);padding: 5px 5px;">
            <p v-for="(citem,index) in item.beReplied" :key="index">
              <span style="color: #4d99de;">{{citem.user.nickname}}</span>
              : {{citem.content}}</p>
          </div>
          <p style="display:block;font-size: 13px;color: gray;opacity: 0.7">{{item.time | dateFormat}}</p>
        </div>
      </div>
      <h4 style="font-weight: 300;margin-top: 25px;">最新评论({{total}})</h4>
      <!--所有评论的信息-->
      <div
          v-for="(item,i) in commentList" :key="'commentList'+i"
          style="position: relative;border-top: 2px solid rgb(240,240,242);
          border-bottom: 1px solid rgb(240,240,242);padding: 15px 0;font-size: 15px;">
        <!--用户头像-->
        <img :src="item.user.avatarUrl" alt=""
             style="display: inline;width: 50px;height: 50px;border-radius: 25px;">
        <!--评论信息-->
        <div style="margin-left: 60px;margin-top: -60px;">
          <p><span style="color: #4d99de;">{{item.user.nickname}}</span>: {{item.content}}</p>
          <br v-if="item.beReplied.length > 0">
          <!--子评论-->
          <div v-if="item.beReplied.length > 0"
               style="background-color: rgb(241,241,244);padding: 5px 5px;">
            <p v-for="(citem,index) in item.beReplied" :key="index">
              <span style="color: #4d99de;">@{{citem.user.nickname}}</span>
              : {{citem.content}}
            </p>
          </div>
          <p style="display:block;font-size: 13px;color: gray;opacity: 0.7">{{item.time | dateFormat}}</p>
        </div>
      </div>
    </div>
    <!--分页区域-->
    <el-pagination
        layout="prev, pager, next" :page-size="queryInfo.limit"
        :total="total" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
export default {
  name: "CommentPage",
  data(){
    return {
      queryInfo:{
        id: this.$route.params.id,
        limit:  10,
        offset: 0
      },
      // 当前歌单的id
      currentId: this.$route.params.id,
      // 所有评论列表
      commentList: [],
      // 最热评论列表
      hotCommentList: [],
      // 评论总数
      total: 0,
      // 输入的评论信息
      comment: ''
    }
  },
  created() {
    // 获取评论列表
    this.getCommentList();
  },
  methods:{
    // 获取评论列表
    getCommentList(){
      this.$http.get({
        url: '/comment/playlist',
        params: this.queryInfo
      }).then(({data:res})=>{
        if(res.code === 200){
          this.commentList = res.comments;
          this.hotCommentList = res.hotComments === undefined ? [] : res.hotComments;
          this.total = res.total;
        }else{
          return this.$message.error('获取评论数据失败!');
        }
      })
    },
    // 分页插件页数改变
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit;
      this.$nextTick(()=>{
        let main = window.document.getElementById('main');
        main.scrollTop = 0;
      })
      this.getCommentList();
    }
  }
}
</script>

<style scoped>

</style>