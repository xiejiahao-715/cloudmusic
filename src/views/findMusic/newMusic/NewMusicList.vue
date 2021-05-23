<template>
  <div>
    <el-row style="margin-top: 25px">
      <p>
        <span>语种:</span>
        <span
            v-for="(item,index) in musicType" :key="index"
            :class="{'isActive':queryInfo.type === item.type}"
            @click="changeType(item.type)"
            style="margin-left: 25px;cursor: pointer;">{{item.name}}</span>
      </p>
      <el-col :span="20" :offset="2">
        <el-table
            :data="newMusicInfo.slice(0,number)"
            @row-dblclick="dblclickPlayMusic"
            stripe :show-header="false">
          <el-table-column type="index">
            <template #default="scope">
              {{scope.$index+1 >= 10 ? scope.$index+1: '0'+(scope.$index+1).toString()}}
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="scope">
              <i class="el-icon-video-play"
                 @click="changeNewUrl(scope.row.id)"
                 style="position: absolute;font-size: 25px;top: 35px;left:35px;z-index: 8;cursor:pointer;"></i>
              <el-image
                  :src="scope.row.album.picUrl" lazy
                  @click="changeNewUrl(scope.row.id)"
                  style="width: 75px;height: 75px;cursor:pointer;"></el-image>
              <span style="position: absolute;top: 25px;font-size: 15px;font-weight: 500;left: 100px">
                {{scope.row.name}}
              </span>
              <span style="position: absolute;bottom: 25px;font-size: 12px;font-weight: 500;left: 100px">
                {{scope.row.album.name}}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {throttle} from "@/utils/public";

export default {
  name: "newMusicList",
  data(){
    return {
      //筛选条件
      queryInfo: {
        type: 0
      },
      //标签数据
      musicType: [
        {type: 0, name: '全部'},
        {type: 7, name: '华语'},
        {type: 96, name: '欧美'},
        {type: 16, name: '韩国'},
        {type: 8, name: '日本'}
      ],
      // 最新音乐的数据
      newMusicInfo:[],
      // 当前获取数据的条数 设置成这样主要是练习异步加载
      number: 0
    }
  },
  created() {
    this.getNewMusic();
  },
  methods:{
    // 获取最新音乐数据
    getNewMusic(){
      return this.$http.get({
        url: '/top/song',
        params:this.queryInfo
      }).then(({data:res})=>{
        this.number += 10;
        res.data.slice(this.number - 10,this.number).forEach((item)=>{
          this.newMusicInfo.push(item);
        })
      })
    },
    // 判断滚动条滚到底部  节流 间隔为1s
    handleScroll: throttle(function (){
      // 判断是否是本页面
      if(this.$route.fullPath === '/newMusicList') {
        // 获取主体区域的dom对象
        let main = window.document.getElementById('main');
        // scrollTop 返回元素上边缘与视图之间的距离。
        let scrollTop = main.scrollTop;
        // height是	返回元素的整体高度。
        let scrollHeight = main.scrollHeight;
        // clientHeight 返回可视区的高度
        let clientHeight = main.clientHeight;
        //滚动条到底部的条件
        if (scrollTop + clientHeight + 0.4 >= scrollHeight) {
          this.$nextTick(async () => {
            await this.getNewMusic();
            main.scrollTop = scrollTop;
          });
        }
      }
    },1000),
    // 改变筛选条件
    changeType(typeId){
      this.queryInfo.type = typeId;
      this.number = 0;
      this.getNewMusic();
    },
    // 播放点击的最新音乐
    changeNewUrl(musicId){
      let playlist = []
      this.newMusicInfo.forEach(item => {
        playlist.push(item.id)
      })
      this.$emit('setSongListInfo', playlist, musicId);
    },
    // 双击表单事件
    dblclickPlayMusic(row){
      this.changeNewUrl(row.id);
    }
  },
  mounted() {
    let main = window.document.getElementById('main');
    main.addEventListener('scroll',this.handleScroll);
  },
  beforeDestroy() {
    // 组件销毁前移除事件监听
    let main = window.document.getElementById('main');
    main.removeEventListener('scroll',this.handleScroll);
  },
  watch:{
    $route(to,from){
      let main = window.document.getElementById('main');
      if(from.fullPath === '/newMusicList'){
        // 离开本页面取消滚动条监听
        main.removeEventListener('scroll',this.handleScroll);
      }else if(to.fullPath === '/newMusicList'){
        // 重新回到本页面
        main.addEventListener('scroll',this.handleScroll);
      }
    }
  }
}
</script>

<style scoped>
.isActive {
  color: red;
}
</style>