const getters = {
  tagsViewList: state => state.tagsView.tagsViewList,
  currentTagView: state => state.tagsView.currentTagView,
  routes: state => state.router.routes,
  isCollapse: state => state.config.isCollapse,
  userInfo: state => state.user.userInfo,
}
export default getters
