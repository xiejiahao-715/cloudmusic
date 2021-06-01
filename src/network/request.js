import axios from "axios";
function get(config){
  const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    withCredentials: true, // 允许跨域
    method: 'get'
  });
  instance.interceptors.request.use(config=>{
    // 为请求体添加时间戳
    config.params = {
      ...config.params,
      timestamp: Date.parse(new Date())
    }
    if(window.localStorage.getItem('musicCookie') !== null || window.localStorage.getItem('musicCookie') !== 'null'){
      config.params.cookie = encodeURIComponent(window.localStorage.getItem('musicCookie'));
    }
    return config;
  });
  return instance(config);
}
export default {
  get
}