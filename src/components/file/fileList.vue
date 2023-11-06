<template>
  <div>
    <panel>
      <div slot="header">
        资料文件信息
      </div>
      <table class="table row">
        <tbody>
          <tr>
            <td width="30%">资料名称</td>
            <td>详情</td>
            <td width="13%" v-if="showUploadBtn">操作</td>
          </tr>
          <tr v-for="(item, index) in fileList" :key="index">
            <!-- 资料名称 -->
            <td>
              {{ item.name }}
              <span style="color: red" v-if="item.require || item.required">*</span>
            </td>
            <!-- 详情 -->
            <td>
              <file-list-show :arr="item.detail" :del="candelete" />
            </td>
            <!-- 操作 -->
            <td class="text-center">
              <oneFile :projectId="projectId" :uploadObj="item" :selfClass="selfClass"></oneFile>
            </td>
          </tr>
        </tbody>
      </table>
    </panel>
  </div>
</template>

<script>
export default {
  props: {
    selfClass: {
      type: String,
      default: true,
    },
    /**
     * 是否显示上传按钮
     */
    showUploadBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示删除按钮
     */
    candelete: {
      type: Boolean,
      default: true,
    },
    projectId: {
      type: [String, Number],
      default: "",
    },
    //文件列表
    fileList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
    };
  },
  methods: {
    check() {
      let checkOK = true;
      try {
        this.fileList.forEach((item) => {
          if (item.required || item.require) {
            if (!item.detail[0]) {
              this.$message.error(`请上传${item.name}`);
              checkOK = false;
              throw new Error("EndIterative");
            }
          }
        });
      } catch (e) {
        if (e.message != "EndIterative") throw e;
      }
      if (!checkOK) {
        return false;
      } else {
        return true;
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




