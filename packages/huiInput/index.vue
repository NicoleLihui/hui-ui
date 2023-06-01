<template>
  <ElTooltip :content="value + ''" :open-delay="500" :effect="effect" :disabled="!ifOverFlow">
    <ElInput
      v-model="value"
      :clearable="clearable"
      :placeholder="placeholder"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :disabled="disabledInput"
      :maxlength="maxLength"
      @mouseenter.native="$event => mouseEnter($event)"
      @clear="valueClear"
      @focus="focusInput"
      @input="onInput"
    >
      <template #append v-if="unit">{{ unit }}</template>
    </ElInput>
  </ElTooltip>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'HuiInput',
  inheritAttrs: false,
})
interface InputProps {
  modelValue?: string
  placeholder?: string
  prefixIcon?: string
  suffixIcon?: string
  disabledInput?: boolean
  maxLength?: number
  effect?: 'light' | 'dark'
  unit?: string
  clearable?: boolean
}
const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    prefixIcon?: string
    suffixIcon?: string
    disabledInput?: boolean
    maxLength?: number
    effect?: 'light' | 'dark'
    unit?: string
    clearable?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '请输入',
    disabledInput: false,
    maxLength: 200,
    effect: 'light',
    clearable: true,
    prefixIcon: '',
    suffixIcon: '',
    unit: '',
  }
)
const emit = defineEmits(['update:modelValue', 'valueClear', 'focusInput', 'input'])
let value = ref()
watch(
  () => props.modelValue,
  (v1, v2) => {
    value.value = v1
  },
  {
    immediate: true,
  }
)
function onInput(value: string) {
  emit('update:modelValue', value)
  emit('input', value)
}
let ifOverFlow = ref(false)
function mouseEnter(e: Event) {
  const target = e.target as Element
  if (e.target) {
    const inputNode = target.querySelectorAll('.el-input__inner')[0] as HTMLInputElement
    if (inputNode && inputNode.value.trim().length > 0 && inputNode.scrollWidth > inputNode.clientWidth) {
      // 说明: 1. 输入了有效内容 2.有效内容的长度超出了输入框长度
      ifOverFlow.value = true
    } else {
      ifOverFlow.value = false
    }
  }
}
function valueClear() {
  value.value = ''
  emit('update:modelValue', '')
  emit('valueClear')
}
function focusInput(e: Event) {
  emit('focusInput', e)
}
</script>

<style lang="scss" scoped></style>
