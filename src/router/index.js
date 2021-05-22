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
