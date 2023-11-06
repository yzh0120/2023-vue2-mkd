<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  watch: {
            "$store.state.user.userInfo.id": {
          handler(newVal, oldVal) {
            if (newVal && newVal.length > 0) {
              //存在
              // console.log("1111111111111")
              this.$socket.io.opts.query = {
                token: 123, //localStorage.getItem("token") || '没有token'
              };
              this.$socket.open();
            } else {
              this.$socket.disconnect(); //中断socket连接
            }
          },
          immediate: true,
        },
  },
  sockets: {
    //内置事件
    //1 连接成功
    connect() {
      console.log("连接成功", this.$socket);
    },
    //2 断开连接
    disconnect(data) {
      console.log("连接断开", this.$socket);
    },
    //3 重连中...... 服务器端断开,客户端自动执行
    reconnecting() {
      console.log("重连中......");
    },
    //4 重连成功 // 服务器端断开重连成功,客户端自动执行
    reconnect() {
      console.log("重连成功");
    },

    //自定义///////////////////////////////////////////////
    /* 有新消息*/
    newInfo(data) {
      // console.log(data, "newInfo");
      this.$message.success(data);
    },
    /* 非法链接断开*/
    illegal(data) {
      /* this.$socket.disconnect(); //中断socket连接
      this.$socket.connect(); //重新socket连接 */
    },
  },
}
</script>

<style>

</style>
