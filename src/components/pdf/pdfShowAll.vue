<template>
  <div class="pdfBox">
    <pdf ref="morePDF" :src="pdfSrc" :page="i" v-for="i in numPages" :key="i"></pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js';
import axios from 'axios';
import * as eleFileApi from "@/api/eleFile"
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
      pdfSrc: "",
      currentPage: 1,//当前页
      numPages: 0,//总数
    }
  },
  mounted() {
    //  this.download({ fileId: "1691994924131065857" })
    this.download()
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
          var blob = new Blob([response.data], { type: 'application/pdf' })
          let pdfSrc = URL.createObjectURL(blob);
          this.getPDFnums(pdfSrc)
        })
        .catch(err => {
          reject(err)
        })

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
  }
}
</script>

<style lang="scss" scoped>
</style>
