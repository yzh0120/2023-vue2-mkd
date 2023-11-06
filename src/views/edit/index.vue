<template>
  <div>
    <step1 :info="info" v-if="info.applyProcessStatus == 0"></step1>
    <step2 :info="info" v-if="info.applyProcessStatus == 1"></step2>
    <step3 :info="info" v-if="info.applyProcessStatus == 2"></step3>
    <step4 :info="info" v-if="info.applyProcessStatus == 3"></step4>
    <step5 :info="info" v-if="info.applyProcessStatus == 4"></step5>
  </div>
</template>

<script>
import step1 from "./step1.vue"
import step2 from "./step2.vue"
import step3 from "./step3.vue"
import step4 from "./step4.vue"
import step5 from "./step5.vue"
export default {
  components: {
    step1,
    step2,
    step3,
    step4,
    step5
  },
  data() {
    return {
      info: {
        applyProcessStatus:0
      },
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() { 
      
      // let applyNo = this.applyNo ? this.applyNo : this.info.applyNo
      // mkdApi.applyNo({ applyNo: applyNo }).then((res) => {
      //   if (res.code == 200) {
      //     this.info = res.data
      //   } else {
      //     this.$message.error(res.info)
      //   }
      // })
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
