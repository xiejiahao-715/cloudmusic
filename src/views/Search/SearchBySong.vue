<template>
  <div style="margin-bottom: 50px;overflow: hidden;margin-top: -1px">
    <!--歌曲列表-->
    <el-table
        :data="songList" ref="playTableRef"
        highlight-current-row border stripe
        @row-dblclick="playMusic"
        style="cursor: context-menu;margin-bottom: 10px">
      <el-table-column label="#" type="index">
        <template #default="scope">
          <img v-if="curId === scope.row.id" src="@/assets/img/isPlay.png" alt="">
          <p v-else>{{scope.$index+1}}</p>
        </template>
      </el-table-column>
      <el-table-column label="音乐标题" prop="name"></el-table-column>
      <el-table-column label="歌手">
        <template #default="scope">
          <span
              v-for="(item,index) in scope.row.artists" :key="index"
              style="cursor: pointer" @click="toSingerPage(item.id)">
            {{index === 0 && scope.row.artists.length > 1 && index !== scope.row.artists.length-1 ? item.name +' / ' : item.name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="专辑名" prop="album.name"></el-table-column>
      <el-table-column label="时长" prop="duration"></el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
        layout="prev, pager, next" :page-size="queryInfo.limit" background
        :total="songTotal" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "SearchBySong",
  data(){
    return {
      search: decodeURIComponent(this.$route.params.data),
      // 当前的搜索条件
      queryInfo:{
        keywords: decodeURIComponent(this.$route.params.data),
        limit: 30,
        offset: 0,
        type: 1
        /* type 默认为1
            1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
        */
      },
      //查询结果总数
      songTotal: 0,
      //歌曲数的结果集
      songList: [],
      //父组件当前播放的音乐的id
      curId: window.localStorage.getItem('curPlayMusicId') === null ? 0 : parseInt(window.localStorage.getItem('curPlayMusicId')),
    }
  },
  created() {
    window.addEventListener('setCurPlayMusicId',this.listenSetCurPlayMusicId);
    // 获取搜索的结果集
    this.getSearchResult();
  },
  beforeDestroy() {
    // 组件销毁前删除监听器
    window.removeEventListener('setCurPlayMusicId',this.listenSetCurPlayMusicId);
  },
  methods:{
    // 监听父组件中歌曲id改变的事件
    listenSetCurPlayMusicId(){
      this.curId = parseInt(window.localStorage.getItem('curPlayMusicId'));
    },
    // 获取搜索的结果
    getSearchResult(){
      this.$http.get({
        url: '/search',
        params: this.queryInfo
      }).then(({data:res})=>{
        if(res.code === 200){
          this.songList = res.result.songs === undefined ? [] : res.result.songs;
          this.songTotal = res.result.songCount;
          // 处理时长
          this.songList.forEach(item=>{
            // 将毫秒转换为秒
            let time = item.duration / 1000;
            // 分钟
            let minute = time / 60;
            let minutes = parseInt(minute);
            if(minutes < 10){
              minutes = '0' + minutes;
            }
            // 秒
            let second = time %60;
            let seconds = Math.round(second);
            if(seconds < 10){
              seconds = '0' + seconds;
            }
            item.duration = `${minutes}:${seconds}`;
          })
        }
      })
    },
    //双击歌曲添加数据进去,并循环播放(向父组件传递参数)
    playMusic(row){
      this.$http.get({
        url: '/song/url',
        params: {id: row.id}
      }).then(({data:res})=>{
        if(res.code === 200 && res.data[0].code === 200){
          let url = res.data[0].url;
          this.$http.get({
            url: '/song/detail',
            params: {ids: row.id}
          }).then(({data:res})=>{
            if(res.code === 200 && res.songs.length > 0){
              this.$emit('setMusicUrl',url,res.songs[0]);
            }
          })
        }else{
          this.$message.error('没有该歌曲的资源');
        }
      })
    },
    //跳转歌手
    toSingerPage(id) {
      this.$router.push('/singer/' + id)
    },
    // 分页插件页数改变
    handleCurrentChange(newPage){
      this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit;
      this.$nextTick(()=>{
        let main = window.document.getElementById('main');
        main.scrollTop = 0;
      });
      if (this.queryInfo.offset >= this.songTotal)
        this.queryInfo.offset = this.songTotal;
      this.getSearchResult();
    }
  }
}
</script>

<style scoped>
/* 解决el-table标题栏边框与下面内容显示区不重合的情况*/
.el-table /deep/th.gutter{
  display: table-cell!important;
}
</style>