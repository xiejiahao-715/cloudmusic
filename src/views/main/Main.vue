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
        <router-view></router-view>
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
            <span class="el-icon-caret-left" style="cursor: pointer;"></span>
            <span v-if="isPlay" class="el-icon-video-pause" style="cursor: pointer;"></span>
            <span v-else class="el-icon-video-play" style="cursor: pointer;"></span>
            <span class="el-icon-caret-right" style="cursor: pointer;"></span>
          </el-col>
          <!--播放音乐进度条-->
          <el-col :span="12" style="display: flex">
            <!--秒数通过 过滤器处理成看得懂的样式-->
            <span style="line-height: 60px;">{{this.musicDuration | timeFormat}}</span>
            <!--音乐播放进度条-->
            <el-slider v-model="musicDuration" :max="totalDuration"
                       :show-tooltip="false"></el-slider>
            <span style="line-height: 60px;">{{totalDuration | timeFormat}}</span>
          </el-col>
          <el-col :span="8">
            <div style="display: flex">
              <!--音量控制-->
              <div style="margin-top: 18px;margin-left: 5%">
                <span v-if="musicVolume!==0" class="iconfont icon-laba" style="cursor: pointer;"></span>
                <span class="iconfont icon-jingyin" v-else style="cursor: pointer;"></span>
              </div>
              <el-slider v-model="musicVolume" :show-tooltip="false"
                         style="width: 30%;margin-left: 10px;margin-right: 10px"></el-slider>
              <div style="margin-top: 18px;">
                <span class="iconfont icon-liebiao" style="cursor: pointer;"></span>
              </div>
            </div>
          </el-col>
      </el-row>
      </div>
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
    }
  },
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