
<template>
  <el-container class="container">
    <template v-if="$store.state.config.needLogin">
      <el-header class="headerstyle">
        <div style="display: flex;align-items: left;width:50px">
          <img :src="require(`@/assets/logo.png`)" alt style="cursor: pointer;width:100%" @click="toHome" />
        </div>

        <el-menu :default-active="$route.path" router mode="horizontal" text-color="#000000" active-text-color="#F6384C">
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/myGuarantee">我的订单</el-menu-item>
          <el-menu-item index="/checkGuarantee">保函查验</el-menu-item>
          <el-menu-item index="/info">用户信息</el-menu-item>

        </el-menu>
        <div class="right">
          <el-button v-if="!userInfo.id" type="info" size="small" @click="tologin" class="loginBtn">登录</el-button>
          <el-dropdown v-else :show-timeout="70" :hide-timeout="50" @command="onDropdownCommand">
            <span>
              <span v-if="userInfo.userName">{{ userInfo.userName }}</span>
              <span v-else-if="userInfo.phone">{{ userInfo.phone }}</span>
              <span v-else>未登录</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>
      </el-header>

      <!-- 主体 -->
      <el-main class="layout-main">
        <el-scrollbar style="height: 100%; ">
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </template>
    <template v-else>
      <div style="width: 1000px; margin: 0 auto;">
        <el-scrollbar style="height: 100%; ">
        <router-view></router-view>
      </el-scrollbar>
      </div>
    </template>

  </el-container>
</template>

<script>
import * as cookieFn from '@/utils/cookie.js';
export default {
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  data() {
    return {

    }
  },
  methods: {
    toHome() {
      this.$router.push({ path: "/" })
    },
    tologin() {
      this.$router.push({ path: "/login" })
    },
    onDropdownCommand(path) {
      if (path == "logOut") {
        cookieFn.removeCookie(process.env.VUE_APP_TOKEN);
        // this._closeAllTagsView(this.$route)
        // this.$store.state.router.routes = []//
        this.$router.push({ name: "login" }).then(() => {
          // window.location.reload();
        });
      } else {
        this.$router.push(path);
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .headerstyle {
    width: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    height: 90px !important;


    .right {
      .loginBtn {
        background: #F5F5F5;
        border-color: #F5F5F5;
        color: #000000;
        padding: 9px 26px;
        font-size: 16px;

        &:hover {
          background: #F6384C;
          border-color: #F6384C;
          color: #ffffff;
        }
      }
    }
  }

  .layout-main {
    width: 1000px;
    margin: 0 auto;
    // padding: 0 2px;
  }
}

::v-deep {
  .el-scrollbar__wrap {
    overflow: auto
  }

  .el-menu--horizontal {
    border: 0px;

    .el-menu-item {
      font-size: 16px;
      border: 0px;
    }
  }

  .el-dropdown-menu__item {
    &:hover {
      background-color: #FEEBED;
      color: #F86070;
    }

  }
}
</style>
