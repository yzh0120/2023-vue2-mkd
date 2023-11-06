import request from "@/utils/request";

/**
 * 获取用户基础信息
 * @param {*} params 
 * @returns 
 */
export function getAppSession(data) {
  return request({
    url: "/user/getUserInfo",
    method: "get",
    params: data
  })
}


/**
 * 获取菜单列表
 * @param {*} params 
 * @returns 
 */
export function getmodulelist(params) {
  return request({
    url: "/user/getmodulelist",
    method: "get",
    params: params
  })
}


/**
 * 用户登录
 * @param {*} params 
 * @returns 
 */
export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data: data
  })
}
