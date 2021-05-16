import Vue from 'vue'
import VueRouter from 'vue-router'

const Main = ()=>import('@/views/main/Main')
const FindMusic = ()=>import('@/views/findMusic/FindMusic')
const DiyRecommend = ()=>import('@/views/findMusic/diyRecommend/DiyRecommend')
const MusicListPage = ()=>import('@/views/findMusic/musicList/MusicListPage')
const MusicRank = ()=>import('@/views/findMusic/musicRank/MusicRank')

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
            // 排行榜模块
          {path: '/musicRank',component: MusicRank}
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
