<template>
  <div class="pdfBox">
    <template v-if="numPages <= 1">
      <pdf ref="morePDF" :src="pdfSrc" :page="i" v-for="i in numPages" :key="i"></pdf>
    </template>

    <template v-else>
      <pdf :src="pdfSrc" :page="currentPage" @num-pages="pageCount = $event" @page-loaded="currentPage = $event"
        @error="loadError" />
    </template>

    <el-button @click.stop="prePage">上一页</el-button>
    <span>{{ currentPage }}/{{ numPages }}</span>
    <el-button @click.stop="nextPage">下一页</el-button>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js';
import axios from 'axios';
export default {
  components: {
    pdf
  },
  props: {
    fileId: {
      type: [String, Number]
    },
    preUrl: {
      type: String,
      default: "http://139.199.68.31:9099/Files/MXHPAP2023090633/20230925/d15e94760a544015b9598fbf77fff7dc.pdf"
    },
  },
  data() {
    return {
      pdfSrc:"",
      currentPage: 1,//当前页
      numPages: 0,//总数
    }
  },
  mounted() {
    this.download({ fileId: "1691994924131065857" })
  },
  methods: {
    download() {
      const x = new window.XMLHttpRequest();
      x.open('GET', this.preUrl, true);
      x.responseType = 'blob';
      x.onload = () => {

        // let time = new Date().toLocaleDateString();
        const fileURL = window.URL.createObjectURL(x.response);
        this.pdfSrc = fileURL
        this.getPDFnums(this.pdfSrc)

      };
      x.send()
      return;

      let data = {
      }
      let headers = {}
      axios({
        method: 'get',
        url: "/oa/turn/complex/face/openInvitation",
        baseURL: process.env.VUE_APP_API,
        params: data,
        responseType: 'blob',
        headers: headers
      })
        .then(response => {
          // console.log(response.data,"response")
          var blob = new Blob([response.data], { type: 'application/pdf' })
          let pdfSrc = URL.createObjectURL(blob);
          // console.log( pdfSrc," pdfSrc")
          this.getPDFnums(pdfSrc)
        })
        .catch(err => {
          reject(err)
        })


      // this.pdfSrc = "https://szdbtest.zksj.com.cn/szdb-integrated-api/2023/08/f1f4b37bbad24ca8b6cf1607e86229cb.pdf"
      //  this.getPDFnums(this.pdfSrc)
    },
    //计算pdf页码总数
    getPDFnums(url) {
      let loadURL = pdf.createLoadingTask({
        url: url,//你的pdf地址
        CMapReaderFactory
      })
      loadURL.promise.then(pdf => {
        this.numPages = pdf.numPages
        this.currentPage = 1
      }).catch(err => {

      })
    },
    // 上一页
    prePage() {
      var page = this.currentPage
      page = page > 1 ? page - 1 : this.numPages
      this.currentPage = page
    },

    // 下一页
    nextPage() {
      var page = this.currentPage
      page = page < this.numPages ? page + 1 : 1
      this.currentPage = page
    },
    // 加载失败
    loadError(err) {
      console.log(err)
      // this.$toast.fail('加载pdf失败！')
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
