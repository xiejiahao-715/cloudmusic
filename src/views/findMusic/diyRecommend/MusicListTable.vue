<template>
  <!--歌曲列表-->
  <el-table
      :data="currentMusicListInfo"
      ref="playMusicListTableRef"
      style="cursor: context-menu;"
      @row-dblclick="playMusicList"
      highlight-current-row border stripe>
    <el-table-column label="#" type="index">
      <template #default="scope">
        <el-image
            v-if="curId === scope.row.id"
            :src="require('@/assets/img/isPlay.png')"></el-image>
        <p v-else>{{scope.$index+1}}</p>
      </template>
    </el-table-column>
    <el-table-column label="音乐标题" prop="name"></el-table-column>
    <el-table-column label="歌手">
      <template #default="scope">
        <span v-for="(item,index) in scope.row.ar" :key="index" style="cursor: pointer">
          {{ index === 0 && scope.row.ar.length > 1 && index !== scope.row.ar.length-1 ? item.name +' / ' : item.name}}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="专辑名" prop="al.name"></el-table-column>
    <el-table-column label="时长" prop="dt" width="80px;"></el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "MusicListTable",
  data(){
    return {
      //接受传递来的参数
      queryIds: this.$route.params.ids ? this.$route.params.ids : window.localStorage.getItem('queryIds'),
      //查询当前歌单所有音乐的name url 作者等等
      currentMusicListInfo: [],
      //歌单的歌曲id合集
      songListInfo: [],
      //父组件当前播放的音乐的id
      curId: parseInt(window.localStorage.getItem('curPlayMusicId')),
    }
  },
  mounted() {
    //放入上一个组件传递来的参数
    window.localStorage.setItem('queryIds', this.queryIds)
  },
  created() {
    this.handlerSongList();
    window.addEventListener('setItem',this.listenerSetItem);
  },
  beforeDestroy() {
    window.addEventListener('setItem',this.listenerSetItem);
  },
  methods:{
    //处理歌单所有歌曲信息的查询(根据id)
    handlerSongList(){
      this.$http.get({
        url: 'song/detail',
        params:{ids: this.queryIds}
      }).then(({data:res})=>{
        if(res.code === 200){
          this.currentMusicListInfo = res.songs;
          // 处理时长数据
          this.currentMusicListInfo.forEach(item=>{
            const dt = new Date(item.dt)
            const mm = (dt.getMinutes() + '').padStart(2, '0')
            const ss = (dt.getSeconds() + '').padStart(2, '0')
            item.dt = mm + ':' + ss
          })
          // 设置歌单所有歌曲的id信息
          this.setSongListInfo();
        }else{
          this.$message.error('连接服务器失败');
        }
      })
    },
    //设置歌单所有歌曲的id
    setSongListInfo() {
      this.songListInfo = [];
      this.currentMusicListInfo.forEach(item => {
        this.songListInfo.push(item.id)
      })
    },
    // 监听main.js的自定义事件
    listenerSetItem(){
      this.curId = parseInt(localStorage.getItem('curPlayMusicId'));
    },
    //双击歌曲添加数据进去,并循环播放(向父组件传递参数)
    playMusicList(row) {
      this.$emit('setSongListInfo', this.songListInfo, row.id)
    },
  }
}
</script>

<style scoped>
/deep/ .el-table_1_column_4 .cell {
  cursor: pointer !important;
}
</style>