import axios from 'axios';
import {
  Notification,
  Message,
  MessageBox
} from 'element-ui';
//路由配置
import router from '@/router'
import * as cookieFn from '@/utils/cookie.js';
import store from '@/store/index' //vuex

import md5 from "js-md5"
import aes from "@/utils/aes"

const service = axios.create({
  baseURL: process.env.VUE_APP_API,//ip
  timeout: 600000,//超时
})

//http response 拦截器
service.interceptors.response.use(
  //code == 200
  response => {
    if (response.status === 200) { // 如果状态码是200  会执行.then的第一个函数

      // 未设置状态码则默认成功状态
      const code = response.data.code;
      if (code == 200) {
        return Promise.resolve(response.data)
      }
      //token失效
      else if (code == 401) {
        if (!store.state.config.alert401) {
          store.state.config.alert401 = true;
          MessageBox.alert("未授权，请重新登录", "提示", {
            confirmButtonText: '确定',
            callback: action => {
              cookieFn.removeCookie(process.env.VUE_APP_TOKEN);
              router.push({
                path: '/login'
              });

            }
          })
        }
      }
      //其他自定义code
      else {
        Notification.error({
          title: response.data.info
        })
        return Promise.reject(response)
      }
    } else { //除了200 在2xx的范围 会执行.then的第二个函数  Promise.reject(res)  1
      return Promise.reject(response)
    }
  },
  //code != 200
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '错误请求'
          break;
        case 401:
          if (!store.state.config.alert401) {
            store.state.config.alert401 = true;
            MessageBox.alert("未授权，请重新登录", "提示", {
              confirmButtonText: '确定',
              callback: action => {
                removeCookie(process.env.VUE_APP_TOKEN);
                router.push({
                  path: '/login'
                });

              }
            })
          }
          break;
        case 403:
          err.message = '拒绝访问'
          break;
        case 404:
          err.message = '请求错误,未找到该资源'
          break;
        case 405:
          err.message = '请求方法未允许'
          break;
        case 408:
          err.message = '请求超时'
          break;
        case 500:
          err.message = '服务器端出错'
          break;
        case 501:
          err.message = '网络未实现'
          break;
        case 502:
          err.message = '网络错误'
          break;
        case 503:
          err.message = '服务不可用'
          break;
        case 504:
          err.message = '网络超时'
          break;
        case 505:
          err.message = 'http版本不支持该请求'
          break;
        default:
          err.message = `连接错误${err.response.status}`
      }
    } else {
      err.message = "连接到服务器失败"
    }
    Message({
      message: err.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(err.response);
  }
)

//请求拦截器
service.interceptors.request.use(
  config => {
    config.headers = { //配置请求token
      "Authorization": cookieFn.getCookie(process.env.VUE_APP_TOKEN) || ""
    }

    /*
    某些需要再链接后面带一个标识
    */
    // if (config.method == "get") {
    //   if (config.url.includes("?")) {
    //     config.url = config.url + `&timestamp=${new Date().getTime()}`
    //   } else {
    //     config.url = config.url + `?timestamp=${new Date().getTime()}`
    //   }
    // }

     /*
    加密
    */
    // let Pdata = {
    //     "appid": process.env.VUE_APP_AES_APPID,
    //     "p": aes.encrypt(JSON.stringify(config.data)),
    //     "sign": md5(JSON.stringify(config.data) + process.env.VUE_APP_AES_SIGN).toUpperCase(),
    // }
    // console.log(Object.assign(Pdata, config.data),"Object.assign(Pdata, config.data)")
    // config.data = Object.assign(Pdata, config.data)

    return config;
  },
  error => {
    return Promise.reject(error);
  }
)


export default service;
