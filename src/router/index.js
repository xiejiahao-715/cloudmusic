import Vue from 'vue'
import VueRouter from 'vue-router'

const Main = ()=>import('@/views/main/Main')
const FindMusic = ()=>import('@/views/findMusic/FindMusic')
const DiyRecommend = ()=>import('@/views/findMusic/diyRecommend/DiyRecommend')
const MusicListPage = ()=>import('@/views/findMusic/musicList/MusicListPage')
const MusicRank = ()=>import('@/views/findMusic/musicRank/MusicRank')
const SingerList = ()=>import('@/views/findMusic/singer/SingerList')
const NewMusicList = ()=>import('@/views/findMusic/newMusic/NewMusicList')
const SongList = ()=>import('@/views/findMusic/diyRecommend/SongList')
const MusicListTable = ()=>import('@/views/findMusic/diyRecommend/MusicListTable')
const CommentPage = ()=>import('@/views/findMusic/diyRecommend/CommentPage')
const VideoPage = ()=>import('@/views/findMusic/diyRecommend/VideoPage')
const SingerDetail = ()=>import('@/views/findMusic/singer/SingerDetail')
const SingerAlbum = ()=>import('@/views/findMusic/singer/SingerAlbum')
const SingerMv = ()=>import('@/views/findMusic/singer/SingerMv')
const SingerDesc = ()=>import('@/views/findMusic/singer/SingerDesc');
const PlayMusicDetailPage = ()=>import('@/views/findMusic/PlayMusicPage/PlayMusicDetailPage')
const SearchPage = ()=>import('@/views/Search/SearchPage')
const SearchBySong = ()=>import('@/views/Search/SearchBySong')
const SearchBySinger = ()=>import('@/views/Search/SearchBySinger')
const SearchByVideo = ()=>import('@/views/Search/SearchByVideo')
const SearchByPlayList = ()=>import('@/views/Search/SearchByPlayList')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
    redirect: '/findMusic',
    children:[
      {
        path: 'findMusic',
        component: FindMusic,
        children:[
            // 个性推荐
          {path: '/diyRecommend',component: DiyRecommend},
            // 歌单模块
          {path: '/musicListPage',component: MusicListPage},
            // 歌曲排行榜模块
          {path: '/musicRank',component: MusicRank},
            // 歌手排行榜模块
          {path: '/singerList',component: SingerList},
            // 最新音乐模块
          {path: '/newMusicList',component: NewMusicList}
        ]
      },
      // 点击跳转到歌单页面
      {
        path: '/songList/:id',
        component: SongList,
        // 歌单页面中的子组件(歌曲列表,评论,收藏)
        children: [
          {path: '/musicPage',component:MusicListTable,name:'musicPage'},
          {path: '/comment/:id',component:CommentPage}
        ]
      },
      //跳转mv视频模块
      {
        path: '/toVideoPage/:id', component: VideoPage
      },
      // 歌手详情页面
      {
        path: '/singer/:id',
        component: SingerDetail,
        children: [
          //歌手专辑页
          {path: '/album/:id', component: SingerAlbum},
          //歌手推荐MV页面
          {path: '/singerMv/:id', component: SingerMv},
          //歌手详细页面
          {path: '/singerDesc/:id', component: SingerDesc}
        ]
      },
      // 播放的详情页面 歌词等等
      {
        path: 'musicDetail/:id',
        component: PlayMusicDetailPage
      },
      // 搜索结果页
      {
        path: '/search/:data',
        component: SearchPage,
        children: [
          {
            path: '/searchBySong/:data',
            component: SearchBySong
          },
          {
            path: '/searchBySinger/:data',
            component: SearchBySinger
          },
          {
            path: '/searchByVideo/:data',
            component: SearchByVideo
          },
          {
            path: '/searchByPlayList/:data',
            component: SearchByPlayList
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
