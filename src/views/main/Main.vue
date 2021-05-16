<template>
  <el-container>
    <!--头部区域 -->
    <el-header height="60px">
      <img src="@/assets/img/logo.png" alt="网易云音乐" class="logo">
      <span>网易云音乐</span>
      <!--头部搜索区域-->
      <el-input v-model="searchData" placeholder="搜索单曲,歌手,视频,歌单" suffix-icon="el-icon-search" size="mini">
        <el-button #suffix class="searchBtn" size="mini"></el-button>
      </el-input>
      <!--右侧登录区域-->
      <div class="rightContainer" style="display: flex">
        <img v-if="currentUserInfo === null" src="@/assets/img/UserIcon.png" alt="" class="userIcon">
        <img v-else :src="currentUserInfo.avatarUrl" alt="" class="userIcon">
        <span v-if="currentUserInfo === null" @click="handleLogin" style="cursor:pointer;">未登录</span>
        <span v-else>{{currentUserInfo.nickname}}</span>
        <el-button
            @click="logout" disabled
            v-if="currentUserInfo !== null"
            type="danger" size="mini"
            style="height: 50%;margin-top: 12px;margin-left: 5px;">退出</el-button>
      </div>
    </el-header>
    <el-container style="position: relative;" class="contentContainer">
      <!--侧边栏区域-->
      <el-aside width="200px">
        <el-menu default-active="/findMusic" :router="true">
          <el-menu-item-group>
            <template #title>推荐</template>
            <el-menu-item index="/findMusic">发现音乐</el-menu-item>
            <el-menu-item index="/video">视频</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template #title>我的音乐</template>
            <el-menu-item index="/cloudMusic">我的音乐云盘</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template #title>创建的歌单</template>
            <template #default>
              <el-menu-item
                  v-for="item in createdPlayList" :key="item.id"
                  :index="'/songlist/'+item.id">{{item.name}}</el-menu-item>
            </template>
          </el-menu-item-group>
          <el-menu-item-group>
            <template #title>收藏的歌单</template>
            <template #default>
              <el-menu-item
                  v-for="item in favoritePlayList" :key="item.id"
                  :index="'/songlist/'+item.id">{{item.name}}
              </el-menu-item>
            </template>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <!--主体区域-->
      <el-main>
        <!--
        setMusicUrl:设置当前需要播放的url连接,子路由(DiyRecommend.vue)的banner调用传递url
        setSongListInfo:设置当前歌单信息,子路由(MusicListTable.vue)的点击事件传递歌单信息
        musicDuration给子组件传递值  子组件prop接收
        curId给子组件传值
        -->
        <router-view
            ref="child"
            @setMusicUrl="setMusicUrl"
            @setSongListInfo="setSongListInfo"
            :musicDuration="musicDuration"
            :isPlay="isPlay" :curId="curId"
            @refreshPrivatePlaylist="getUserPrivatePlayList"></router-view>
      </el-main>
    </el-container>
    <el-footer height="60px">
      <!--底部播放信息显示-->
      <!--点击左下角角标 跳转歌曲详情界面-->
      <div style="height: 100%;width: 15%;display: flex">
        <img :src="music.al.picUrl" alt="" style="width: 60px;height: 60px;cursor:pointer;">
        <div style="margin-left: 5%;overflow: hidden">
          <p style="margin: 5px 0 8px 0;text-align: center;">{{music.name}}</p>
          <p style="margin: 0;font-size: 10px;color: gray;cursor: pointer;text-align: center;">{{music.ar[0].name}}</p>
        </div>
      </div>
      <!--进度条及一些组件-->
      <div style="width: 85%;height: 100%;">
        <el-row>
          <!--一首 暂停 下一首控件-->
          <el-col :span="3" style="font-size: 220%;line-height: 60px">
            <span
                @click="changePrevMusic"
                class="el-icon-caret-left" style="cursor: pointer;"></span>
            <span
                v-if="isPlay"
                @click="playMusic"
                class="el-icon-video-pause" style="cursor: pointer;"></span>
            <span
                v-else
                @click="playMusic"
                class="el-icon-video-play" style="cursor: pointer;"></span>
            <span
                @click="changeNextMusic"
                class="el-icon-caret-right" style="cursor: pointer;"></span>
          </el-col>
          <!--播放音乐进度条-->
          <el-col :span="12" style="display: flex">
            <!--秒数通过 过滤器处理成看得懂的样式-->
            <span style="line-height: 60px;">{{this.musicDuration | timeFormat}}</span>
            <!--音乐播放进度条-->
            <el-slider
                ref="musicSliderRef"
                v-model="musicDuration"
                :max="totalDuration"
                @change="musicDurationChange"
                :disabled="totalDuration === 0"
                :format-tooltip="formatMusicSlider"
                :show-tooltip="true"></el-slider>
            <span style="line-height: 60px;">{{totalDuration | timeFormat}}</span>
          </el-col>
          <!--调节音量-->
          <el-col :span="8">
            <div style="display: flex">
              <!--音量控制-->
              <div style="margin-top: 18px;margin-left: 5%">
                <span
                    v-if="musicVolume!==0"
                    @click="silence"
                    class="iconfont icon-laba" style="cursor: pointer;"></span>
                <span
                    v-else
                    @click="silence"
                    class="iconfont icon-jingyin" style="cursor: pointer;"></span>
              </div>
              <el-slider
                  v-model="musicVolume"
                  @change="musicVolumeChange"
                  :show-tooltip="true"
                  style="width: 30%;margin-left: 20px;margin-right: 10px"></el-slider>
              <div style="margin-top: 18px;">
                <span class="iconfont icon-liebiao" style="cursor: pointer;"></span>
              </div>
            </div>
          </el-col>
      </el-row>
      </div>

      <audio :src="musicUrl" id="audio" autoplay></audio>
    </el-footer>
    <!-- 登陆的对话框 -->
    <el-dialog
        title="请用手机扫描下方二维码登陆" center width="30%"
        :visible.sync="loginDialogVisible"
        :close-on-click-modal="false"
        lock-scroll>
      <!-- 验证码图片-->
      <img @click="handleLogin" v-if="QRcodeStatus" :src=qrimg alt="" style="cursor:pointer;">
      <span v-else @click="handleLogin" style="cursor:pointer;">请点击文字重新获取二维码</span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: "Main",
  data(){
    return {
      // 顶部搜索框的搜索信息
      searchData:'',
      // 当前用户的信息
      currentUserInfo: window.localStorage.getItem('currentUserInfo') === 'null' ? null: JSON.parse(window.localStorage.getItem('currentUserInfo')),
      // 控制登陆对话框的显示与隐藏
      loginDialogVisible:false,
      // 二维码图片的base64编码
      qrimg: '',
      // 二维码的显示状态
      QRcodeStatus: false,
      // 是否处于二维码登陆的确定状态
      loginConfirmStatus: false,
      // 当前用户的歌单
      currentUserPlayList:[],
      //播放音乐的链接
      musicUrl: '',
      //当前音乐详情对象
      music: {
        name: '歌曲',
        al: {
          picUrl: ''
        },
        ar: [
          {
            name: '歌手'
          }
        ]
      },
      // 是否在播放
      isPlay: false,
      //音乐的音量
      musicVolume: 20,
      //当前音乐的进度条
      musicDuration: 0,
      //当前音乐的id
      curId: 0,
      //总进度条
      totalDuration: 0,
      // 播放列表信息
      playListInfo: window.localStorage.getItem('playList').length === 0 ? []:window.localStorage.getItem('playList').split(','),
      //当前播放的歌单的所有歌曲的url和其他信息
      currentMusicListInfo: [],
      //当前播放的歌单的id
      songListInfo: [],
    }
  },
  created() {
    if(this.currentUserInfo !== null){
      // 用户已登陆，获取歌单
      this.getUserPrivatePlayList();
    }
  },
  computed:{
    // 创建的歌单
    createdPlayList(){
      return this.currentUserPlayList.filter(item=>{
        return item.subscribed === false;
      });
    },
    // 收藏的歌单
    favoritePlayList(){
      return this.currentUserPlayList.filter(item=>{
        return item.subscribed === true;
      })
    }
  },
  mounted() {
    // 初始化播放器
    let audio = window.document.getElementById('audio');
    audio.addEventListener('timeupdate',this.formatAudio);
  },
  beforeDestroy() {
    let audio = window.document.getElementById('audio');
    audio.removeEventListener('timeupdate',this.formatAudio);
  },
  methods:{
    // 点击未登录的文字按钮显示对话框 并且发送请求获取请求生成二维码
    async handleLogin(){
      this.loginDialogVisible = true;
      const {data:res1} = await this.$http.get({url:'/login/qr/key'});
      if(res1.code === 200){
        // 状态码为200说明请求成功
        const key = res1.data.unikey;
        const {data:res2} = await this.$http.get({
          url:'/login/qr/create',
          params:{key,qrimg: true}
        });
        if(res2.code === 200) {
          this.qrimg = res2.data.qrimg;
          this.QRcodeStatus = true;
        }
        else{
          this.$message.error('获取验证码失败');
          this.QRcodeStatus = false;
        }
        // 轮询此接口可获取二维码扫码状态，间隔为1s
        const loginTimer = setInterval(async ()=>{
          if(this.loginDialogVisible === true) {
            const {data: res3} = await this.$http.get({url: '/login/qr/check', params: {key}});
            if(res3.code === 803){
              this.$http.get({url:'/login/status'})
              .then(({data:res})=>{
                //保存用户信息,退出时删除
                window.localStorage.setItem('currentUserInfo', JSON.stringify(res.data.profile))
                //放入用户的信息
                this.currentUserInfo = res.data.profile;
                // 获取歌单信息
                this.getUserPrivatePlayList();
              });
              //保存cookie的信息
              window.localStorage.setItem('musicCookie', res3.cookie);
              this.$message.success(res3.message);
              //隐藏弹窗
              this.loginDialogVisible = false;
              this.loginConfirmStatus = false;
            }else if(res3.code === 802 && this.loginConfirmStatus === false){
              // 暂时放入用户的信息 确保用户处于验证状态
              this.loginConfirmStatus = true;
              this.$message.success(res3.message);
            }else if(res3.code === 800){
              this.$message.warning(res3.message);
              this.loginConfirmStatus = false;
              clearInterval(loginTimer);
              this.QRcodeStatus = false;
            }
          }
          else{
            clearInterval(loginTimer);
          }
        },2000)
      }
      else{
        this.$message.error('获取验证码失败');
      }
    },
    // 退出
    logout(){
      this.$http.get({url:'/logout'})
      .then(({data:res})=>{
        if(res.code === 200) {
          //当前用户信息设置为null
          this.currentUserInfo = null
          //存储用户信息的localstorage设置为null
          window.localStorage.setItem('currentUserInfo', null);
          window.localStorage.setItem('musicCookie',null);
          this.currentUserPlayList = []
        }else {
          this.$message.error('此时无网络连接，无法退出');
        }
      })
    },
    // 获取用户的私人歌单
    getUserPrivatePlayList(){
      this.$http.get({
        url: 'user/playlist',
        params:{uid: this.currentUserInfo.userId}
      }).then(({data:res})=>{
        if(res.code === 200){
          this.currentUserPlayList = res.playlist;
        }else{
          this.$message.error('返回的歌单数据异常');
        }
      }).catch(()=>{
        this.$message.error('获取个人歌单失败');
      })
    },
    // 设置当前播放的url
    setMusicUrl(musicUrl,detail){
      //设置关于音乐的链接和歌曲信息
      this.musicUrl = musicUrl;
      this.music = detail;
      this.curId = detail.id;
      // 更新状态
      this.isPlay = true;
    },
    //控制暂停播放
    playMusic() {
      let audio = window.document.getElementById('audio');
      if (this.musicUrl !== '') {
        if (!audio.paused) {
          audio.pause()
        } else {
          audio.play()
        }
        this.isPlay = !this.isPlay;
      }
    },
    //接受子路由传递过来的歌单信息
    async setSongListInfo(songList, curId){
      console.log('设置歌单');
      this.playListInfo = songList;
      //将当前歌单信息放入localStorage
      window.localStorage.setItem('playList', songList);
      //设置当前歌单点击需要播放的音乐链接
      const {data:res} = await this.$http.get({url:'song/url', params: {id: curId}});
      if(res.data[0].url === null){
        this.$message.info('当前歌曲暂不可用,已为您自动跳过');
        this.curId = curId;
        this.changeNextMusic();
      }else {
        this.musicUrl = res.data[0].url;
        //设置当前歌单的详细信息
        await this.$http.get({url:'song/detail', params: {ids: curId}}).then(({data:res}) => {
          this.music = res.songs[0];
        });
        //设置当前播放音乐的id
        this.curId = curId
        // 跟新状态
        this.isPlay = true;
      }
    },
    //根据id获取音乐详情
    getMusicDetail(musicId) {
      return  this.$http.get({url:'song/detail', params: {ids: musicId}}).then(({data:res}) => {
        this.music = res.songs[0];
      })
    },
    //根据id获取音乐url
    getMusicUrl(musicId) {
      return this.$http.get({url:'song/url',params: {id: musicId}}).then(({data:res}) => {
        this.musicUrl = res.data[0].url;
      })
    },
    // 切换下一首歌
    changeNextMusic(){
      if(this.playListInfo.length>0) {
        // 下一个音乐的下标
        const nextMusicIndex = this.playListInfo.findIndex(target => {
          return target === this.curId;
        }) + 1;
        // 判断下标是否合法
        if(nextMusicIndex>=0&&nextMusicIndex<this.playListInfo.length)
          this.setSongListInfo(this.playListInfo, this.playListInfo[nextMusicIndex]);
        else{
          // 下标溢出播放第一首歌
          this.setSongListInfo(this.playListInfo, this.playListInfo[0]);
        }
      }
      this.$message.error('没有下一首歌曲');
    },
    // 切换上一首歌
    changePrevMusic() {
      if(this.playListInfo.length>0) {
        // 下一个音乐的下标
        const prevMusicIndex = this.playListInfo.findIndex(target => {
          return target === this.curId;
        }) - 1;
        // 判断下标是否合法
        if(prevMusicIndex>=0&&prevMusicIndex<this.playListInfo.length)
          this.setSongListInfo(this.playListInfo, this.playListInfo[prevMusicIndex]);
        else{
          // 下标溢出播放最后一首歌
          this.setSongListInfo(this.playListInfo, this.playListInfo[this.playListInfo.length]);
        }
      }
      this.$message.error('没有上一首歌曲');
    },
    //表单的双击事件,双击表单播放歌曲
    playRightMusicList(row) {
      //右下角点击事件生效  播放该音乐
      this.setSongListInfo(this.playListInfo, row.id)
    },
    //音乐进度条值变化的方法
    musicDurationChange(){
      let audio = window.document.getElementById('audio');
      audio.currentTime = this.musicDuration;
      audio.play();
    },
    //改变音量的函数
    volumeChange(volum) {
      let audio = window.document.getElementById('audio');
      audio.volume = volum;
    },
    // 静音和改变图标
    silence(){
      if(this.musicVolume !== 0){
        this.volumeChange(0);
        this.musicVolume = 0;
      }else {
        this.volumeChange(0.2);
        this.musicVolume = 20;
      }
    },
    // 音量变化
    musicVolumeChange() {
      this.volumeChange(this.musicVolume / 100)
    },
    // 初始化audio,当进度改变时触发,当timeupdate事件触发时调用
    formatAudio(){
      let audio = window.document.getElementById('audio');
      // 获取歌曲的总长度 单位为秒
      this.totalDuration = audio.duration;
      // 获取播放的进度 单位为秒 当音乐进度条被拖拽时不实时触发
      if(this.$refs.musicSliderRef.dragging === false) {
        this.musicDuration = audio.currentTime
      }
      // 当前歌曲播放完毕自动播放下一首
      if(audio.currentTime >= audio.duration){
        this.changeNextMusic();
      }
    },
    // 播放音乐进度条的显示
    formatMusicSlider(value){
      return this.$options.filters['timeFormat'](value);
    },
  },
  watch:{
    // 监听组件中的当前音乐id的变化 发生变化则加入歌单 放入localstorage中供给各个组件使用
    curId(newVal){
      console.log("播放列表:"+this.playListInfo);
      console.log("播放的音乐id:"+newVal);
    }
  }
}
</script>

<style scoped lang="less">
.el-header{
   width: 100%;
   min-width: 1100px;
   position: relative;
   background-color: rgb(236, 65, 65);
   display: flex;
   border-bottom: 1px;
   z-index: 10;
   flex-shrink: 0;
   .logo{
     width: 25px;
     height: 25px;
     margin: 15px 10px;
     border-radius: 10px;
   }
   span{
     font-size: 20px;
     font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
     font-weight: 500;
     margin-top: 15px;
     color: white;
   }
   .el-input{
     width: 275px;
   }
   /deep/.el-input__inner{
     // 设置透明度的属性
     opacity: 0.8;
     margin-top: 15px;
     margin-left: 50px;
     width: 225px;
     height: 25px;
     border-radius: 12px;
   }
}
.rightContainer{
   margin-left: auto;
   .userIcon{
     width: 30px;
     height: 30px;
     border-radius: 50%;
     margin-top: 15px;
     margin-right: 10px;
     background-color: white;
   }
   span {
     font-size: 17px;
     margin-right: 30px;
     color: white;
   }
}
/deep/.el-dialog{
   min-width: 500px;
   min-height: 300px;
   .el-dialog__body{
     text-align: center;
   }
}
/deep/.el-aside{
 overflow-y: visible;
 border-right: solid 1px #e6e6e6;
 .el-menu{
   border-right: 0;
 }
}
.el-menu-item {
  height: 45px;
  line-height: 3.45em;
}
.el-menu-item.is-active {
  color: black;
  border-left: 2px solid red !important;
}
.el-container {
 // 隐藏右边滚动条
 overflow: hidden;
 height: 100%;
}
.el-footer {
  padding: 0;
  position: relative;
  bottom: 0;
  margin: 0;
  width: 100%;
  z-index: 100;
  background-color: white;
  display: flex;
  flex-shrink: 0;
  border-top: 1px solid red;
  min-width: 1100px;
}
/deep/ .el-slider__button {
  border: 2px solid rgb(198, 47, 47) !important;
}
/deep/ .el-slider__button {
  width: 10px !important;
  height: 10px !important;
}
/deep/ .el-slider__bar {
  background-color: rgb(198, 47, 47);
}
/deep/.el-slider__runway{
  position: relative;
  top: 10px;
}
.el-slider {
  width: 80%;
  margin: 0 5%;
}
.contentContainer{
  max-height: calc(100% - 120px);
  flex-shrink: 0;
}
</style>