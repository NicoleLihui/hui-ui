<template>
  <fm-generate-form
    :data="parseFormJson(formList, 'data')"
    :value="formValue"
    :edit="renderedTaskCurrent"
    ref="generateForm"
    v-if="refresh"
  >
  </fm-generate-form>
  <!-- <fm-generate-form
    :data="parseFormJson(formList, 'file')"
    :edit="renderedTaskCurrent"
    ref="generateAttachmentForm"
  >
  </fm-generate-form> -->
</template>

<script lang="ts" setup name="FormMaker">
import { JSON_DATA } from './const'
import { PropType } from 'vue'
import $bus from '../../../utils/bus'
// 接口
interface JsonStrObject {
  /**
   * 当actionType为handle的时候, 返回的formList需要传给这个表单组件, 用于表单渲染
   * 其中参数需要这个页面处理:
   * 主表单 formJson,
   * 附件表单: attachmentFormJson,
   * 表单值(用于回显): formValueJson
   * 表单是否可编辑: isEdit,
   * appScene 表单的使用场景, PC_GL是pc端
   */
  formValueJson: string
  appScene?: string
  formJson: { [key: string]: any }
  attachmentFormJson: { [key: string]: any }
  isEdit: number
}
interface EditableFormValue {
  editable_form: { [key: string]: any }
  // 这两个原来版本代码没有注释清楚是什么东西，暂时写在这里
  isImpactCustomerRelation?: number | string
  impactComment?: any
}
const props = defineProps({
  formList: {
    type: Array as PropType<
      {
        /**
         * 当actionType为handle的时候, 返回的formList需要传给这个表单组件, 用于表单渲染
         * 其中参数需要这个页面处理:
         * 主表单 formJson,
         * 附件表单: attachmentFormJson,
         * 表单值(用于回显): formValueJson
         * 表单是否可编辑: isEdit,
         * appScene 表单的使用场景, PC_GL是pc端
         */
        formValueJson: string
        appScene?: string
        formJson: { [key: string]: any }
        attachmentFormJson: { [key: string]: any }
        isEdit: number
      }[]
    >,
    default: () => {
      return []
    },
  },
})

// data
let generateForm = ref()
let renderedTaskCurrent = ref(false)
let isValid = ref(true)
// let isValidFile = ref(true)
// let formAttachValue = reactive({})
let refresh = ref(true)
let formValue = reactive({})
let isValidMessage = ref('')
watch(
  () => props.formList,
  val => {
    renderedTaskCurrent.value = val[0]?.isEdit === 1 ? true : false
    getFormValueJson(val)
  },
  {}
)
function getFormValueJson(jsonStrList: JsonStrObject[]) {
  if (jsonStrList.length > 0 && jsonStrList[0]?.formValueJson) {
    const value = JSON.parse(jsonStrList[0]?.formValueJson) || {}
    if (renderedTaskCurrent.value) {
      // 当前节点, 可编辑
      value.editable_form['isFormEditable'] = true
    } else {
      value.editable_form['isFormEditable'] = false
    }
    formValue = value
  }
}

function parseFormJson(jsonStrList: JsonStrObject[], type: string) {
  try {
    let jsonData
    if (jsonStrList && jsonStrList.length) {
      jsonStrList.forEach(item => {
        if (item.appScene === 'PC_GL') {
          jsonData = type === 'data' ? item.formJson : item.attachmentFormJson
        }
      })
    }
    return jsonData ? JSON.parse(jsonData) : JSON_DATA
  } catch {
    return JSON_DATA
  }
}
function handleSubmit() {
  return new Promise(resolve => {
    generateForm.value
      .getData()
      .then((data: EditableFormValue) => {
        $bus.emit('validFormValue')
        setTimeout(() => {
          if (isValid.value) {
            const formValue = setFormValue(data)
            resolve(formValue)
          } else {
            resolve(false)
          }
        }, 100)
      })
      .catch(() => {})
  })
}
function setFormValue(data: EditableFormValue) {
  if (data && data?.editable_form) {
    return Object.assign({}, data.editable_form, {
      editable_form: true,
    })
  } else {
    // 非自定义表单直接提交数据
    return data
  }
}
function forceRefresh() {
  refresh.value = false
  nextTick(function () {
    refresh.value = true
  })
}
function setValid(val: boolean, msg: string) {
  isValid.value = val
  isValidMessage.value = msg
}

defineExpose({ forceRefresh: forceRefresh, handleSubmit: handleSubmit })

onMounted(() => {
  $bus.on('validFormResult', () => {
    setValid
  })
})
onUnmounted(() => {
  $bus.off('validFormResult')
})
</script>

<style lang="scss" scoped></style>
