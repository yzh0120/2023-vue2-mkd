export default {
  namespaced: true,
  state: {
    userInfo: {},
  },
  mutations: {
    m_set_userInfo(state, data) {
      state.userInfo = data
    },
  },

  actions: {
    //store.dispatch("user/commit", res.data); //保存用户信息
    a_set_userInfo({
      commit
    }, data) {
      commit('m_set_userInfo', data)
      // return new Promise(resolve => {
      //   commit('m_set_userInfo', data)
      //   resolve(data)
      // })
    }
  }
}
