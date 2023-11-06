
<template>
  <!-- 
    自定义路径
<oneFile  pathUrl="/face/project/import" style="display: inline-block;margin-left: 20px;"></oneFile>

新增弹窗的文件
<oneFile :uploadObj="uploadObj" :projectId="oneFormAlert.data.id" mode="onlyOne"  :fileId="oneFormAlert.data.currentFileId"></oneFile>
   -->
  <span>
    <el-progress :percentage="percentage" :text-inside="true" :stroke-width="15" v-if="percentage"></el-progress>

    <el-upload :disabled="btnDisabled" class="i-upload" :action="uploaduUrl" :http-request="changeFile"
      :show-file-list="false" multiple :on-change="handleChange" :on-progress="progress">
      <el-button :disabled="btnDisabled" :size="btnSize" :type="btnType">{{ btnText }}
      </el-button>
    </el-upload>


  </span>
</template>
 
<script>
import * as eleFileApi from "@/api/eleFile";
import axios from 'axios';
// import {
//   getCookie
// } from '@/utils/auth.js';
import * as cookieFn from '@/utils/cookie.js';
export default {
  props: {
    selfClass: {
      type: String,
      default: true,
    },
    //模式
    mode: {
      type: String,
      default: "",
    },
    //项目的文件id
    fileId: {
      type: [String, Number],
      default: "",
    },
    //项目id
    projectId: {
      type: [String, Number],
      default: "",
    },
    //文件对象信息
    uploadObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    //上传路径可选
    pathUrl: {
      type: String,
      default: "",
    },
    //按钮名称
    btnText: {
      type: String,
      default: "上传资料",
    },
    //按钮大小
    btnSize: {
      type: String,
      default: "mini",
    },
    //文件按钮颜色
    btnType: {
      type: String,
      default: "primary",
    }
  },
  data() {
    return {
      currentNum: 0,//控制上传数量
      percentage: 0,//控制进度条
      // uploaduUrl: "", //process.env.VUE_APP_down_API + "/v1/base/file/upload", //上传地址
      btnDisabled: false,
    };
  },
  created() {
    this.getFiles(); //获取历史文件///////////////////切换

  },
  computed: { 
    folderId(){ 
      if (this.uploadObj.projectId) {
        return this.uploadObj.projectId
      } else { 
        return  this.projectId
      }
    },
  },
  methods: {
    //获取文件
    getFiles() {
      ///////////////////切换
      if (this.folderId) {
        eleFileApi.queryList(
          {
            companyName:this.selfClass,
            folderId: this.folderId,
            taskName: this.uploadObj.taskName,
          }
        ).then((res) => {
          if (res.code == 200) {
            this.$emit("getFile", {data:res.data})
            this.uploadObj.detail = res.data;
            //如果是onlyOne模式 那个只会显示和id匹配的一个
            if (this.mode == "onlyOne") {
              if (!this.fileId) {
                this.uploadObj.detail = []
                return this.$message.error("文件id是空！")

              }
              // this.uploadObj.detail = [ res.data[res.data.length - 1] ];
              let activeFile = res.data.find((e) => {
                return e.id == this.fileId
              })
              if (activeFile) {
                this.uploadObj.detail = [activeFile]
              }

            }
          } else {
            this.$message.error(res.msg);
          }
        })
      }

    },

    //1 点击上传文件时的改变事件
    handleChange() {
      console.log("文件改变事件")
      this.btnDisabled = !this.btnDisabled;
    },
    //2 取消默认上传事件
    changeFile(file) { //
      console.log("自定义上传事件")
      let url = "/system/file_annexes/uploadFile"
      let fd = new FormData()
      if (this.pathUrl) {
        url = this.pathUrl
        fd.append('file', file.file)// 传文件
      } else {
        fd.append('file', file.file)// 传文件
        fd.append('folderId', this.folderId)
        fd.append('taskName', this.uploadObj.taskName)//selfClass
        fd.append('companyName', this.selfClass)//selfClass
      }

      let headers = {
        'Authorization': "Bearer " + cookieFn.getCookie(process.env.VUE_APP_TOKEN),
        'content-type': 'multipart/form-data'
      }


      axios({
        baseURL: process.env.VUE_APP_API,
        url: url,
        method: 'post',
        headers: headers,
        data: fd,
        onUploadProgress: (progressEvent) => { this.progress(progressEvent) }
      }).then((res) => {
        this.btnDisabled = !this.btnDisabled;
        console.log(res, "res")
        let { data } = res//data是包含人工code的对象
        if (data.code == 200) {//上传成功
          this.upLoadSuccess(data.data, file.file)
        } else { //上传失败
          this.$message.error(data.msg);
          this.currentNum--
        }
      })

    },
    //3 上传图片之前
    beforeUpload(file, item) {
      console.log("文件校验是否合法事件")
      let activeFileType = file.name.split(".").pop();//文件类型
      if (item.num && item.detail.length + this.currentNum >= item.num) {
        this.btnDisabled = !this.btnDisabled;
        this.$message.error(`只能上传${item.num}个`);
        return false;
      }
      else if (
        item.type &&
        item.type.length &&
        !item.type.includes(activeFileType)
      ) {
        this.$message.error(`请上传正确的文件类型`);
        this.btnDisabled = !this.btnDisabled;
        return false;
      }
      else if (item.size && ((file.size / 1024 / 1024) > item.size)) {
        this.$message.error(`文件最大为${item.size}M`)
        this.btnDisabled = !this.btnDisabled;
        return false;
      }
      else {
        this.currentNum++;
        return true;
      }
    },
    //文件上传中
    progress(progressEvent) {
      console.log(progressEvent, "progressEvent")
      let uploadPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      this.percentage = 0;
      this.$nextTick(() => {
        this.percentage = Number(uploadPercent.toFixed(0));
        if (this.percentage >= 100) {
          this.percentage = 0;
        }
      });
      console.log("文件上传中,对于自定义上传貌似没用")
      // this.percentage = 0;
      // this.$nextTick(() => {
      //   this.percentage = Number(file.percentage.toFixed(0));
      //   if (this.percentage >= 100) {
      //     this.percentage = 0;
      //   }
      // });
    },
    //5 文件上传成功
    upLoadSuccess(data, file) {
      console.log("文件上传成功")
      this.currentNum = 0;
      this.$message.success(data.fileName + "上传成功！");
      //如果是自定义的上传文件路径
      if (this.pathUrl) {
        this.$emit("success", {
          taskName: this.uploadObj.taskName,
          data,
          file,
        });
      }
      //如果有项目id并且没有模式  
      else if (this.folderId && this.mode == "") {
        eleFileApi.queryList(
          {
            folderId: this.folderId,
            taskName: this.uploadObj.taskName,
          }
        ).then((res) => {
          if (res.code == 200) {
            this.uploadObj.detail = res.data;
            this.$emit("success", {
              taskName: this.uploadObj.taskName,
              data: res.data,
              file,
            });
          } else {
            this.$message.error(res.msg);
          }
        })
      }
      //如果只有taskName并且 mode == "onlyOne"
      else if (this.uploadObj.taskName || this.mode == "onlyOne") {
        console.log(data, "data")
        this.uploadObj.detail = [data];//data是单个文件
        console.log(data.onlinePreviewUrl, 'onlinePreviewUrlonlinePreviewUrlonlinePreviewUrl');
        this.$emit("success", {
          taskName: this.uploadObj.taskName,
          data: data,
          file,
        });
      }
    },

  },
};
</script>
 
<style style="scss" scoped>
.downloadFile {
  cursor: pointer;
}
</style>
 