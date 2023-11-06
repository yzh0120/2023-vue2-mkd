
const screenHeight = Number(clientHeight());
function clientHeight() {
  return document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
}
export default {
  namespaced: true,
  state: {
    isCollapse: false,
    alert401: false,
    dataItem: [],//数据字典
    tableheight: screenHeight - 280 + "px",//vxetable高度
    navTableHeight: screenHeight - 120 + "px",//vxetable高度,
    needLogin:false,
    
  },
  mutations: {
    m_setCollapse(state, val) {
      state.isCollapse = val;
    }
  },

  actions: {

  }
}

