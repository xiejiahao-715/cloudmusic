import axios from "axios";
function get(config){
  const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    withCredentials: true, // 允许跨域
    method: 'get'
  });
  instance.interceptors.request.use(config=>{
    config.params = {
      ...config.params,
      timestamp: Date.parse(new Date())
    }
    return config;
  });
  return instance(config);
}
export default {
  get
}