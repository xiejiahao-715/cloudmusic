<template>
  <el-row style="margin-bottom: 75px;">
    <!-- 左侧区域 播放mv和显示评论 -->
    <el-col :span="14" :offset="1">
      <!--头部信息区域-->
      <el-row>
        <el-tag size="mini" type="danger" style="background-color: white;border: 1px solid red">MV</el-tag>
        <span style="margin-left: 10px;">{{mvDetailInfo.data.name}}</span>
        <span style="margin-left: 10px;font-size: 5px;">{{mvDetailInfo.data.artistName}}</span>
      </el-row>
      <!--视频播放区域-->
      <el-row style="margin-top: 5px">
        <video :src="mvUrl" width="100%" controls="controls" @play="videoPlay">
          很抱歉,您的浏览器当前不支持最新播放标签!
        </video>
      </el-row>
      <!--评论区域-->
      <el-row>
        <p style="margin-top: 15px;font-size: 18px;">评论({{commentTotal}})</p>
        <div style="background-color: rgb(240,240,242);height: 100px;margin-top: 15px;">
          <el-input
              type="text" show-word-limit maxlength="140" size="medium"
              style="display: inline-block;width: 98%;margin: 15px 15px;">
          </el-input>
          <el-button size="mini" style="float:right;margin-right: 14px;">评论</el-button>
        </div>
        <!--用于定位的盒子 , 盒子必须有大小-->
        <div id="comment" style="height: 20px"></div>
        <!--精彩评论-->
        <h4 style="font-weight: 300;color: red;" v-if="queryInfo.offset === 0 && mvHotComment.length!==0">精彩评论</h4>
        <div
            v-for="(item,index) in mvHotComment" :key="'mvHotComment'+index"
            style="position: relative;border-top: 2px solid rgb(240,240,242);
            border-bottom: 1px solid rgb(240,240,242);padding: 15px 0;font-size: 15px;">
          <div>
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
              <p style="display:block;font-size: 13px;color: gray;opacity: 0.7">
                {{item.time |dateFormat}}
              </p>
            </div>
          </div>
        </div>
        <!--所有评论-->
        <h4 style="font-weight: 300;margin-top: 25px;">最新评论({{commentTotal}})</h4>
        <div
            v-for="(item,index) in mvCommentList" :key="'mvComment'+index"
            style="position: relative;border-top: 2px solid rgb(240,240,242);
            border-bottom: 1px solid rgb(240,240,242);padding: 15px 0;font-size: 15px;margin-bottom: 20px">
          <div>
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
                  : {{citem.content}}
                </p>
              </div>
              <p style="display:block;font-size: 13px;color: gray;opacity: 0.7">
                {{item.time |dateFormat}}
              </p>
            </div>
          </div>
        </div>
        <!--分页-->
        <el-pagination
            background
            :current-page.sync = "currentPage"
            layout="prev, pager, next"  :page-size="queryInfo.limit"
            :total="commentTotal" @current-change="handleCurrentChange">
        </el-pagination>
      </el-row>
    </el-col>
    <!--右侧mv的详细信息-->
    <el-col :span="7" :offset="1">
      <el-row style="border-bottom: 1px solid rgb(230,230,230);padding-bottom: 10px;">
        <span style="margin-left: 10px;font-size: 20px;font-weight: 400">MV介绍</span>
      </el-row>
      <!--播放信息-->
      <el-row style="margin-top: 10px;margin-left: 12px;">
        <span style="font-size: 14px;">发布时间:
          <span style="font-size: 14px;">{{mvDetailInfo.data.publishTime}}</span>
        </span>
        <span style="font-size: 14px;margin-left: 15px;float: right">
          播放次数:<span style="font-size: 14px;">{{(mvDetailInfo.data.playCount/10000).toFixed(0)+'万次'}}</span>
        </span>
      </el-row>
      <!--简介-->
      <el-row style="margin-top: 10px;margin-left: 12px;">
        <p style="font-size: 14px;font-weight: 400;">简介: {{mvDetailInfo.data.desc}}</p>
      </el-row>
      <!--相关推荐-->
      <el-row style="margin-top: 45px;border-bottom: 1px solid rgb(230,230,230);padding-bottom: 10px;">
        <span style="margin-left: 10px;font-size: 20px;font-weight: 400">相关推荐</span>
      </el-row>
      <!--可点击的视频推荐区域-->
      <el-row v-for="(item,index) in simiMvList" :key="index" style="margin-top: 25px;">
        <el-col :span="13" style="position: relative">
          <el-image :src="item.cover" @click="toMvPage(item.id)" style="cursor: pointer;" fit="contain"></el-image>
          <!--播放量-->
          <div style="color: white;position:absolute;z-index: 10;top: 2px;right: 3px">
            <div style="float:right;">
              <i class="el-icon-headset"></i>
              {{(item.playCount/10000).toFixed(0)}}万
            </div>
          </div>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-tag size="mini" type="danger" style="background-color: white;border: 1px solid red">MV</el-tag>
          <span style="margin-left: 5px;cursor: pointer" @click="toMvPage(item.id)">{{item.name}}</span>
          <p style="font-size: 15px;opacity: 0.7;">{{item.duration/1000 | timeFormat}}</p>
          <p style="font-size: 15px;opacity: 0.7;">{{item.artistName}}</p>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "VideoPage",
  data(){
    return {
      //当前mv的id
      curMvId: this.$route.params.id,
      //当前mv的详细数据
      mvDetailInfo: {
        data: {
          name: ''
        }
      },
      //当前mv的url
      mvUrl: '',
      //查询当前评论数据的查询条件
      queryInfo: {
        id: this.$route.params.id,
        limit: 10,
        offset: 0,
      },
      //当前mv的评论数据
      mvCommentList: [],
      //当前mv评论数量
      commentTotal: 0,
      //当前mv的精彩评论
      mvHotComment: [],
      //与当前mv相关的mv
      simiMvList: [],
      // 分页插件的当前页码
      currentPage: 1
    }
  },
  created() {
    //获取当前mv的详细数据
    this.getMvDetailInfo();
    // 获取当前mv的Url
    this.getMvUrl();
    // 获取当前mv的评论数据
    this.getMvCommentList();
    //获取相关mv
    this.getSimiMvs();
  },
  methods:{
    //获取当前mv的详细数据
    getMvDetailInfo(){
      this.$http.get({
        url: '/mv/detail',
        params: {mvid: this.curMvId}
      }).then(({data:res})=>{
        if(res.code === 200) {
          this.mvDetailInfo = res;
        }
      })
    },
    // 获取当前mv的url
    getMvUrl(){
      this.$http.get({
        url: '/mv/url',
        params: {id: this.curMvId}
      }).then(({data:res})=>{
        if(res.code === 200){
          this.mvUrl = res.data.url;
        }
      })
    },
    // 获取当前mv的评论数据
    getMvCommentList(){
      this.$http.get({
        url: '/comment/mv',
        params: this.queryInfo
      }).then(({data:res})=>{
        if(res.code === 200) {
          this.mvHotComment = res.hotComments === undefined ? [] : res.hotComments;
          this.mvCommentList = res.comments;
          this.commentTotal = res.total;
        }
      })
    },
    // 分页插件页数改变
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage-1)* this.queryInfo.limit;
      this.$nextTick(()=>{
        window.document.getElementById('comment').scrollIntoView({
          block: 'start'
        })
      });
      this.getMvCommentList();
    },
    // 监听mv播放的事件
    videoPlay(){
      this.$emit('videoPlay');
    },
    // 获取相关的mv
    getSimiMvs(){
      this.$http.get({
        url: '/simi/mv',
        params:{mvid: this.curMvId}
      }).then(({data:res})=>{
        if(res.code === 200){
          this.simiMvList = res.mvs;
        }
      })
    },
    //跳转推荐mv界面
    toMvPage(mvId){
      this.$router.push('/toVideoPage/'+mvId);
    }
  },
  watch:{
    $route(to){
      // 模拟路由参数改变后页面自动刷新
      this.curMvId =to.params.id;
      this.queryInfo.id = to.params.id;
      this.queryInfo.offset = 0;
      //获取当前mv的详细数据
      this.getMvDetailInfo();
      // 获取当前mv的Url
      this.getMvUrl();
      // 获取当前mv的评论数据
      this.getMvCommentList();
      //获取相关mv
      this.getSimiMvs();
      // 滚动条回到顶部
      let main = window.document.getElementById('main');
      main.scrollTop = 0;
      this.currentPage = 1;
    }
  }
}
</script>

<style scoped lang="less">

</style>