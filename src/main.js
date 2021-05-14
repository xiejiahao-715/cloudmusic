import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式表
import '@/assets/css/global.css'

// 导图阿里图标库
import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont'
// 导入element ui及其样式表
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 导入封装好的方法，挂载到原型对象上
import http from '@/network/request'
Vue.prototype.$http = http

//全局过滤器(秒数转化为分钟)
Vue.filter('timeFormat',function (time) {
  //分钟
  let minute = time / 60;
  let minutes = parseInt(minute);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  //秒
  let second = time % 60;
  let seconds = Math.round(second);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return `${minutes}:${seconds}`;
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
