<template>
  <div>
    <el-tooltip class="fuJian" placement="top" v-for="(file, index) in arr" :key="index">
      <span slot="content">
        上传用户：{{ file.createUserName }}<br />
        上传时间：{{ file.createTime }}<br />
        文件大小：{{ file.fileSize }}<br />
        下载次数：{{ file.downloadCount }}
      </span>

      <div class="btn-flex">
        <el-button type="text" @click="downloadFile(file)">{{
        file.fileName
        }}</el-button>
        <i class="el-icon-error" style="color: red" @click="fileRemove(file.id, index)" v-if="del"></i>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
/* 
   arr:[
        {
          name: "中标通知书",
          taskName: "中标通知书",
          detail: [],
          require: 0,
        },
        {
          name: "其他辅助资料",
          taskName: "其他辅助资料",
          detail: [],
          require: 0,
        }
      ],
   */
   import * as eleFileApi from "@/api/eleFile";
export default {
  // props: ["arr", "del"],
  props: {
    // 顯示删除按钮
    del: {
      type: Boolean,
      default: true,
    },
    arr: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    // 当前审批时删除文件
    fileRemove(id, eleindex) {
      this.$confirm(`确定移除 ？`)
        .then(() => {
          eleFileApi.removeByIds({ids:id}).then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.arr.splice(eleindex, 1);
              this.$emit("delFile")
            } else {
              this.$message.error(res.info);
            }
          });
        })
        .catch(() => { });
    },
    downloadFile(item) {
      eleFileApi.download({ fileId: item.id });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
