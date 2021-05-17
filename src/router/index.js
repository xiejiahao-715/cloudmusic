import Vue from 'vue'
import VueRouter from 'vue-router'

const Main = ()=>import('@/views/main/Main')
const FindMusic = ()=>import('@/views/findMusic/FindMusic')
const DiyRecommend = ()=>import('@/views/findMusic/diyRecommend/DiyRecommend')
const MusicListPage = ()=>import('@/views/findMusic/musicList/MusicListPage')
const MusicRank = ()=>import('@/views/findMusic/musicRank/MusicRank')
const SingerList = ()=>import('@/views/findMusic/singer/SingerList')
const NewMusicList = ()=>import('@/views/findMusic/newMusic/NewMusicList')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
    redirect: '/findMusic',
    children:[
      {
        path: 'findMusic',
        redirect:'/diyRecommend',
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
