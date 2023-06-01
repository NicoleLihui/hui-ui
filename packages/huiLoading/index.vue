<template>
  <div :class="classes" v-if="show" ref="mask">
    <div class="custom-loading-box">
      <img :src="icon" v-if="loadingImg" />
      <p class="shine" :data="loadingText">{{ loadingText }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import icon from '@/assets/images/100_100.png'
defineOptions({
  name: 'HuiLoading',
  inheritAttrs: false,
})
const props = withDefaults(
  defineProps<{
    show: boolean
    loadingImg?: boolean
    loadingText?: string
    effect?: string
  }>(),
  { show: false, loadingImg: true, loadingText: '正努力加载，请稍后...', effect: 'light' }
)
const classes = computed(() => ({
  'custom-loading-Mask': true,
  light: props.effect === 'light',
  dark: props.effect === 'dark',
}))

const mask = ref<null | HTMLElement>(null)
watch(
  () => props.show,
  async val => {
    if (val) {
      await nextTick()
      if (mask.value) {
        const maskEle: HTMLElement = mask.value
        const showHeight: number = document.documentElement.clientHeight
        const showWidth: number = document.documentElement.clientWidth
        maskEle.setAttribute('style', `width: ${showWidth}px; height: ${showHeight}px`)
      }
    }
  }
)
</script>

<style lang="scss" scoped>
@import './styles/index.scss';
</style>
