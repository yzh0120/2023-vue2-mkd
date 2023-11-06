<template>
  <!-- <el-form-item :prop="field" :rules="{ required: required, message: '此项不能为空', trigger: ['change','blur'] }" label-width="0px">
    
  
          <timeliness :fvalue="formInfo.data.toTime" :obj="formInfo.data" field="toTime" @transmit="ggg" required
          p="请选择申请人证件有效期结束日" />
        -->
    <DatePicker :id="params.name+params.prop"
    style="width: 100%;"
                v-model="value"
                type="date"
                :picker-options="pickerOptions"
                :popper-class="params.name+params.prop"
                :disabled="params.disabled"
                value-format="yyyy-MM-dd"
                :placeholder="p"
                :default-value="new Date()"
                @input="input()"
                @blur="blur()"
                @focus="focus(params.name+params.prop)" />
  <!-- </el-form-item> -->
</template>

<script>
/**
     * Timeliness 支持选择长期的选择器
 */
import {
  DatePicker
} from 'element-ui'
export default {
  name: 'Timeliness',
  components: {
    DatePicker
  },
  props: {
    p: {
      type: [String],
      default:""
    },
    fvalue: {
      type: [String],
      default:""
    },
    obj: {
      type: Object,
      default: () => { 
        return {

        }
      }
    },
    field: {
      type: [String],
      default:""
    },
    required: {
      type: Boolean,
      default:false
    },
    params: {
      type: Object,
      default: function () {
        return {
          name: 'long_term',
          prop: "new"//'test'
        }
      }
    }

  },
  data() {
    return {
      value: '',
      pickerOptions: {
        shortcuts: [{
          text: '长期',
          onClick(picker) {
            picker.$emit('pick', '9999-12-31')
          }
        }]
      }
    }
  },
  watch: {
    'fvalue': {
      handler(val, oldVal) {
        // 监听父组件传来的默认值
        // if (val) {
          this.value = val
        // }
        console.log(this.val,"val")
        this.$nextTick(() => {
          // 如果默认值是9999-12-31 则认为是长期
          if (val === '9999-12-31') {
            document.querySelector(`#${this.params.name + this.params.prop}`).value = '长期'
          }
        })
      },
      immediate:true
    }
  },
  created() {
  },
  methods: {
    input() {
      // alert(1)
      this.$emit('transmit', this.value)
      this.obj[this.field] = this.value
    },
    blur() {
      // alert(2)
      // 如果在获取焦点的时候清空了时间那么失去焦点的时候再把之前设置的长期时间补回去
      if (this.value === null) {
        this.value = this.fvalue
      }
      this.$nextTick(() => {
        // 如果传递给父组件的时间是一样的不会触发watch事件 所以在这个地方重新设置一下长期或者是具体时间
        if (this.value === '9999-12-31') {
          document.querySelector(`#${this.params.name + this.params.prop}`).value = '长期'
        }
      })
    },
    // 通过将侧边栏的按钮移到底部实现快捷设置长期时间
    focus(event) {
      // alert(3)
      this.$nextTick(() => {
        // 如果当前选择的是长期，那么在获取焦点的时候清空value
        // 因为选了长期的话再次选择的时候起止时间是9999年，用户体验不好
        if (this.value === '9999-12-31') {
          this.value = null
        }
        // 限制dom操作只在当前表单项内操作
        const rootDom = document.querySelector(`.${event}`)
        // 找到侧边栏的长期按钮
        const longTerm = rootDom.querySelector('.el-picker-panel__sidebar').childNodes[0]
        // 如果长期按钮已经移动走了，不重复操作
        if (longTerm) {
          // 收起侧边栏
          rootDom.querySelector('.el-picker-panel__sidebar').style.width = '0px'
          // 展开el-picker-panel__body
          rootDom.querySelector('.el-picker-panel__body').style.marginLeft = '0px'
          // 展开el-picker-panel__content
          rootDom.querySelector('.el-picker-panel__content').style.width = 'auto'
          // 获取此刻按钮
          var beforeBtn = rootDom.querySelector('.el-picker-panel__footer').childNodes[0]
          // 给长期按钮设置和此刻一样的样式
          longTerm.className = 'el-button el-picker-panel__link-btn el-button--text el-button--mini'
          // 将长期按钮插入此刻按钮前面
          rootDom.querySelector('.el-picker-panel__footer').insertBefore(longTerm, beforeBtn)
          rootDom.querySelector('.el-picker-panel__footer').style.display = 'block'
        }
      })
    }
  }
}
</script>

