<template>
  <div>
    <el-row>

      <el-col :span="row.a">
        <el-form-item :prop="province" :rules="{ required: required, message: '此项不能为空', trigger: 'change' }"
          label-width="0px" class="city_slot">
          <el-select :disabled="disabled" v-model.trim="item[province]" placeholder="选择省" clearable
            @change="() => { getCitys(item[province]); item[city] = ''; item[areas] = ''; }" :loading="loading"
            filterable>
            <el-option v-for="(key) in division" :value="key.areaCode" :key="key.areaCode" :label="key.areaName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="row.b">
        <el-form-item :prop="city" :rules="{ required: required, message: '此项不能为空', trigger: 'change' }" label-width="0px"
          class="city_slot">
          <el-select :disabled="disabled" v-model.trim="item[city]" placeholder="选择市" clearable
            v-on:change="() => { getAreas(item[city]); item[areas] = ''; }" :loading="loading" filterable>
            <el-option v-for="(key) in cityArr" :value="key.areaCode" :key="key.areaCode" :label="key.areaName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="row.c" v-if="!onlyTwo">
        <el-form-item :prop="areas" :rules="issz" label-width="0px"
          class="city_slot">
          <el-select v-model.trim="item[areas]" placeholder="选择区" @change="areaChange" :loading="loading" clearable>
            <!-- <el-option v-for="key in areaArr" :value="key.value" :key="key.value" :label="key.text"></el-option> -->
            <el-option v-for="key in areaArr" :value="key.areaCode" :key="key.areaCode" :label="key.areaName"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="row.d" v-if="!onlyTwo">
        <el-form-item :prop="adress" :rules="{ required: addressRequired, message: '此项不能为空', trigger: 'blur' }"
          label-width="0px" class="city_slot" v-if="adress">
          <el-input :disabled="disabled" v-model.trim="item[adress]" placeholder="请填写具体地址,如街道门牌号" clearable></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as administrativedivision from "@/api/administrativedivision.js";
export default {
  props: {
    //特殊的操作
    isScope: {
      type: Boolean,
      default: false,
    },
    //只有省市
    onlyTwo: {
      type: Boolean,
      default: false,
    },
    //禁用3
    disabled: {
      type: Boolean,
      default: false,
    },
    //表单对象
    item: {
      type: Object,
      default: () => { },
    },
    //省
    province: {
      type: String,
      default: "",
    },
    //市
    city: {
      type: String,
      default: "",
    },
    //区
    areas: {
      type: String,
      default: "",
    },
    //地址
    adress: {
      type: String,
      default: "",
    },
    //省市必填
    required: {
      type: [Boolean, String],
      default: false,
    },
    //深圳区域必填
    isszRequired: {
      type: [Boolean, String],
      default: true,
    },
    //区必填
    areasRequired: {
      type: [Boolean, String],
      default: true,
    },
    //详细地址必填
    addressRequired: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      division: [],
      cityArr: [],
      areaArr: [],
      loading: false,
    };
  },
  created() {
    this.$watch(
      function () {
        return this.item[this.city];
      },
      {
        handler(v) {
          if (this.item[this.province]) {
            this.getCitys(this.item[this.province]);
          }
        },
        immediate: true,
      }
    );
    this.$watch(
      function () {
        return this.item[this.areas];
      },
      {
        handler(v) {
          // setTimeout(() => {
          //   console.log(this.item[this.city], "vvvv");
          // }, 0)
          if (this.item[this.city]) {
            this.getAreas(this.item[this.city]);
          }
        },
        immediate: true,
      }
    );
  },
  computed: {
    row() {
      if (this.onlyTwo) {
        return {
          a: 12,
          b: 10
        }
      } else {
        return {
          a: 4,
          b: 4,
          c: 4,
          d: 10,
        }
      }
    },
    issz() {
      if (this.areaRequired) {
        return { required: true, message: '此项不能为空', trigger: 'change' }
      }
      if (this.isszRequired) {
        if (this.item[this.city] == '440300') {
          return { required: true, message: '此项不能为空', trigger: 'change' }
        } else {
          return { required: false, message: '此项不能为空', trigger: 'change' }
        }
      }

    }
  },
  mounted() {
    //获取省
    this.getTree();

    // if (this.item[this.city]) {
    //   this.getCitys(this.item[this.province]);
    // }
    // if (this.item[this.areas]) {
    //   this.getAreas(this.item[this.city]);
    // }
  },
  methods: {
    //区域改变
    areaChange() {
      this.$forceUpdate();
    },
    getTree() {
      this.loading = true;
      let data = {}
      if (this.isScope) {
        //data.parentId = "00"
      }
      administrativedivision.getTree(data).then((res) => {
        this.loading = false;
        this.division = res.data;
      });
    },
    async getCitys(province) {
      this.loading = true;
      if (province) {
        let res = await administrativedivision.getTree({
          parentId: province,
        });
        this.cityArr = res.data;
      } else {
        this.cityArr = [];
      }
      this.loading = false;
    },
    async getAreas(province) {
      this.loading = true;
      if (province) {
        let res = await administrativedivision.getTree({
          parentId: province,
        });
        this.areaArr = res.data;
      } else {
        this.areaArr = [];
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-col {
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>


<style lang="scss"> #app {
   .city_slot.el-form-item {
     margin-bottom: 0px !important;
   }
 }
</style>
