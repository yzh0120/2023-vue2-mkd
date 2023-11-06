import Vue from 'vue'
import VueRouter from 'vue-router'
import baseRoutes from './baseRoutes.js'
import store from '@/store/index' //vuex
import * as cookieFn from '@/utils/cookie.js';
import {
  Message,
} from 'element-ui';
Vue.use(VueRouter)
import * as userApi from "@/api/user";

//处理 同一个地方（路由）触发了两次的报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

//路由白名单
const whiteListName = ["login", "404", "401"]


//静态资源目录
function fnStatic() {
  if (process.env.ENV === 'test') {
    return "/test/"
  } else if (process.env.ENV === 'build') {
    return "/build/"
  } else {
    return "/"
  }
}


const router = new VueRouter({
  mode: 'hash',
  base: fnStatic(),
  routes:baseRoutes
})

router.beforeEach(async (to, from, next) => { 
  // console.log(cookieFn.getCookie(process.env.VUE_APP_TOKEN),"cookieFn.getCookie(process.env.VUE_APP_TOKEN)")
  if (store.state.config.needLogin) {
    if (cookieFn.getCookie(process.env.VUE_APP_TOKEN)) { //如果浏览器有token

      if (!store.getters.userInfo.userName) { //如果vuex没有用户信息
        await userApi.getAppSession().then(res => { //通过接口获取用户信息
          store.state.user.userInfo = res.data//保存用户信息//store.dispatch("user/setUserInfo", res.data); 
          
        })
      }
  
      //数据字典
      // await setTimeout(() => {
      //   store.state.config.dataItem = {
      //     a: [{
      //       text: "文字",
      //       value: "1"
      //     }]
      //   }
      //   Promise.resolve()
      // }, 500)
  
      if (to.path === '/login') { //如果去登录页 直接跳转首页
        next("/")
        // NProgress.done()
      } else {
        if (!store.state.router.routes.length) { //如果vuex中的routers（通过接口获取的数组）长度为0
  
          await userApi.getmodulelist({}).then((res) => { //通过接口获取用户权限的路由
            if (res.code == 200) {
              //将用户对应角色的路由保存到vuex中 在left菜单中体现 this.$store.dispatch("router/a_HeBingRoleRoutes",[])
              store.dispatch('router/a_HeBingRoleRoutes', res.data).then((accessRoutes) => {
                //然后合并到路由中
                router.addRoutes(accessRoutes)
                next({
                  ...to,
                  replace: true
                }) //如果参数to不能找到对应的路由的话，就再执行一次beforeEach((to, from, next)直到其中的next({ ...to})能找到对应的路由为止。
                // NProgress.done()
              })
            } else {
              Message({
                message: res.info,
                type: 'error',
                duration: 3 * 1000
              })
            }
          });
        }
        else {
          next() //放行
        }
      }
    } else { 
      if (whiteListName.indexOf(to.name) !== -1) { //白名单
        next() //放行
        // NProgress.done()
      } else { //非白名单，跳转登录页
        store.dispatch("tagsView/delAllTagsView", []).then(() => {
          setTimeout(() => {
            location.reload()
          }, 100);
          next(`/login`)
          // NProgress.done()
        }); //中断当前导航的afterEach,又进入一次路由守卫的beforeEach,等待 next()放行
      }
    }
  } else { 
    next()
  }



 
})

router.afterEach(() => {
  // finish progress bar
  // NProgress.done()
})




export default router
