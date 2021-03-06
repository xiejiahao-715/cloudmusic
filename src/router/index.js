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
const Video = ()=>import('@/views/Video/Video')
const VideoListTable = ()=>import('@/views/Video/VideoListTable')
const MvListTable = ()=>import('@/views/Video/MvListTable')
const VideoPlayPage = ()=>import('@/views/Video/VideoPlayPage')
const CloudMusic = ()=>import('@/views/Cloud/CloudMusic')

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
            // ????????????
          {path: '/diyRecommend',component: DiyRecommend},
            // ????????????
          {path: '/musicListPage',component: MusicListPage},
            // ?????????????????????
          {path: '/musicRank',component: MusicRank},
            // ?????????????????????
          {path: '/singerList',component: SingerList},
            // ??????????????????
          {path: '/newMusicList',component: NewMusicList}
        ]
      },
      // ???????????????????????????
      {
        path: '/songList/:id',
        component: SongList,
        // ???????????????????????????(????????????,??????,??????)
        children: [
          {path: '/musicPage',component:MusicListTable,name:'musicPage'},
          {path: '/comment/:id',component:CommentPage}
        ]
      },
      //??????mv????????????
      {
        path: '/toVideoPage/:id', component: VideoPage
      },
      // ??????????????????
      {
        path: '/singer/:id',
        component: SingerDetail,
        redirect: '/album/:id',
        children: [
          //???????????????
          {path: '/album/:id', component: SingerAlbum},
          //????????????MV??????
          {path: '/singerMv/:id', component: SingerMv},
          //??????????????????
          {path: '/singerDesc/:id', component: SingerDesc}
        ]
      },
      // ????????????????????? ????????????
      {
        path: 'musicDetail/:id',
        component: PlayMusicDetailPage
      },
      // ???????????????
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
      },
      // ????????????
      {
        path: '/video',
        component: Video,
        redirect: '/videoPage',
        children: [
          {
            path: '/videoPage',
            component: VideoListTable,
          },
          {
            path: '/mvPage',
            component: MvListTable
          }
        ]
      },
      // ???????????????
      {
        path:'/videoPlay/:id',
        component: VideoPlayPage
      },
      //????????????
      {
        path: '/cloudMusic',
        component: CloudMusic
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
