<template>
  <ElTooltip :content="value + ''" :open-delay="500" :effect="effect" :disabled="!ifOverFlow" popper-class="my-tooltip">
    <ElInput
      type="textarea"
      v-model="value"
      :autosize="autoSize"
      :show-word-limit="showWordLimit"
      :placeholder="placeholder"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :disabled="disabledInput"
      :maxlength="maxLength"
      @mouseenter.native="$event => mouseEnter($event)"
      @focus="focusInput"
      @input="onInput"
    >
    </ElInput>
  </ElTooltip>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'HuiTextarea',
  inheritAttrs: false,
})
const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    prefixIcon?: string
    suffixIcon?: string
    disabledInput?: boolean
    maxLength?: number
    effect?: 'light' | 'dark'
    autoSize?: { minRows: number; maxRows: number } | boolean
    showWordLimit?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '请输入',
    disabledInput: false,
    maxLength: 1000,
    effect: 'light',
    prefixIcon: '',
    suffixIcon: '',
    autoSize: () => {
      return { minRows: 2, maxRows: 5 }
    },
    showWordLimit: true,
  }
)
const emit = defineEmits(['update:modelValue', 'focusInput', 'input'])
let value = ref('')
watch(
  () => props.modelValue,
  (v1, v2) => {
    value.value = v1
  },
  { immediate: true }
)
function onInput(value: string) {
  emit('update:modelValue', value)
  emit('input', value)
}
let ifOverFlow = ref(false)
function mouseEnter(e: Event) {
  const target = e.target as Element
  if (target) {
    const inputNode = target.querySelectorAll('.el-textarea__inner')[0] as HTMLTextAreaElement
    if (inputNode && inputNode.value.trim().length > 0 && inputNode.scrollHeight > inputNode.clientHeight) {
      // 说明: 1. 输入了有效内容 2.有效内容的长度超出了输入框长度
      ifOverFlow.value = true
    } else {
      ifOverFlow.value = false
    }
  }
}
function focusInput(e: Event) {
  emit('focusInput', e)
}
</script>

<style lang="scss" scoped>
:deep .el-textarea__inner {
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  &::-webkit-scrollbar {
    width: 8px;
    /*滚动条宽度*/
    height: 8px;
    /*滚动条高度*/
    background-color: white;
  }

  &::-webkit-scrollbar-track {
    height: 8px;
    width: 8px;
    background-color: #efefef;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }

  /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 3px rgba(22, 22, 24, 0.3);
    background-color: rgba(221, 222, 224, 0.5);
    /*滚动条的背景颜色*/
    background-clip: padding-box;
    height: 8px;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }
}
</style>
<style lang="scss">
.my-tooltip {
  max-width: 500px;
}
</style>
