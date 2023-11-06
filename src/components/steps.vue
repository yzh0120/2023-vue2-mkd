<!--
 * @Author: wjs
 * @Date: 2022-03-21 14:51:30
 * @Description: 步骤条组件
 * @FilePath: \receive-platform\src\views\components\steps.vue
 * 
-->
<template>
  <div class="my-steps">
    <mSteps :active="computed_active" class="mb15" style="margin-top:60px;">
      <mStep title="填写项目信息" :description="fn(0)"></mStep>
      <mStep title="金融机构审核" :description="fn(1)"></mStep>
      <mStep title="签署合同" :description="fn(2)"></mStep>
      <mStep title="支付保费" :description="fn(3)"></mStep>
      <mStep title="出具保函" :description="fn(4)" :status="(info.financialAuditStatus === -1 && active == 4) ? 'error' : ''"></mStep>
    </mSteps>
  </div>
</template>

<script>
export default {
  name: "steps",
  props: {
    active: {
      type: Number,
      default: 0
    },
    info: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    computed_active() { 
      return this.active
      // if (this.active == 2) {
      //   return 999999999999
      // } else if (this.active >= 2) { 
      //   return this.active - 1
      // }
      // else { 
      //   return this.active
      // }
    }
  },
  methods: {
    // 描述
    fn(noww) {
      if (noww > Number(this.active)) {
        return ""
      } else if (noww == Number(this.active)) {
        // if (noww == 4 && this.info.guaranteeStatus == 2) {
        //   return "已完成"
        // }else  if (noww == 4 && this.info.financialAuditStatus == -1) {
        //   return "开具失败"
        // }

        // else { 
        //   return "进行中"
        // }
        return "进行中"
       
      } else if (noww < Number(this.active)) {
        return "已完成"
      }
    }
  }
}
</script>

<style lang="scss">
// .my-steps {
//   .el-step__main {
//     position: absolute;
//     left: 60%;
//     top: -10px;
//     background: #ffffff;
//     padding: 0 10px;
//   }
// }
</style>
