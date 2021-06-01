import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式表
import '@/assets/css/global.css'

// 导图阿里图标库
import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont'

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

//全局vue过滤器(时间戳过滤器成2020-08-23)
Vue.filter('dateFormatToYMD',function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+ 1 +'').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
  return `${y}-${m}-${d}`
})

//全局vue过滤器(时间戳过滤器)
Vue.filter('dateFormat',function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+ 1 +'').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

//监听localstorage中的 curPlayMusicId
Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'curPlayMusicId') {
    // 创建一个StorageEvent事件
    let newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        localStorage.setItem(k, val);
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setCurPlayMusicId', false, false, k, null, val, null, null);
        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal);
  }else if(key === 'currentId'){
    // 创建一个StorageEvent事件
    let newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        localStorage.setItem(k, val);
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setCurrentId', false, false, k, null, val, null, null);
        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal);
  }
}

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
