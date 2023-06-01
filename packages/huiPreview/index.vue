<template>
  <div v-show="visible" class="hui-preview-dialog" ref="wrapper" :tabindex="-1" :style="{ zIndex: zIndex }">
    <div class="hui-preview-mask"></div>
    <div class="hui-preview-header">
      <span :title="currentImg.fileName || '文件名'">{{ currentImg.fileName || '文件名' }}</span>
      <span>{{ activeIndex + 1 }}/{{ previewList.length }}</span>
      <el-icon v-if="showClose" size="18" @click="hide">
        <Close />
      </el-icon>
      <i v-else></i>
    </div>
    <div class="hui-preview-content">
      <template v-for="(previewFile, i) in previewList">
        <iframe
          v-if="isPdf(previewFile.fileName)"
          v-show="i === activeIndex"
          :src="previewFile.previewUrl"
          :style="imgStyle"
          @load="handleImgLoad"
          frameborder="0"
        />
        <img
          v-else
          v-show="i === activeIndex"
          :ref="(el) => (imgRefs[i] = el as HTMLImageElement)"
          :key="previewFile.previewUrl"
          :src="previewFile.previewUrl"
          :style="imgStyle"
          @load="handleImgLoad"
          @error="handleImgError"
          @mousedown="handleMouseDown"
        />
      </template>
    </div>
    <template v-if="!isSingle">
      <div @click="prev" class="hui-preview-arrow__prev hui-preview-btn">
        <el-icon size="36"><DArrowLeft /></el-icon>
      </div>
      <div @click="next" class="hui-preview-arrow__next hui-preview-btn">
        <el-icon size="36"><DArrowRight /></el-icon>
      </div>
    </template>
    <div class="hui-preview-actions hui-preview-btn">
      <template v-for="action in actionsIconList">
        <el-tooltip v-if="action.visible" effect="dark" :content="action.title" placement="top">
          <el-icon @click.stop="action.func" color="#fff" size="20">
            <component :is="action.icon" />
          </el-icon>
        </el-tooltip>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Close,
  DArrowLeft,
  DArrowRight,
  ZoomIn,
  ZoomOut,
  RefreshLeft,
  RefreshRight,
  Download,
} from '@element-plus/icons-vue'
import { useEventListener, useThrottleFn } from '@vueuse/core'
import type { CSSProperties } from 'vue'
import useDownloadFile from '@/hooks/useDownloadFile'
const { downloadFile, createSave } = useDownloadFile()
defineOptions({
  name: 'HuiPreview',
  inheritAttrs: false,
})
// ------------------------------属性类型----------------------------
interface ActionsIcon {
  name: string
  title: string
  visible: boolean
  icon: typeof ZoomIn | typeof ZoomOut | typeof RefreshLeft | typeof RefreshRight | typeof Download
  func: Function
}
// ------------------------------定义Props----------------------------
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    previewList: preivewFile[]
    initialIndex?: number
    zIndex?: number
    infinite?: boolean
    showDownload?: boolean
    showClose?: boolean
    closeOnPressEscape?: boolean
  }>(),
  {
    modelValue: false, // 显示隐藏
    previewList: (): preivewFile[] => [],
    initialIndex: 0,
    zIndex: 100,
    infinite: true,
    showClose: true,
    showDownload: true,
    closeOnPressEscape: true,
  }
)
// ------------------------------定义Emits----------------------------
const emits = defineEmits(['update:modelValue', 'closed'])
// ------------------------------Data----------------------------
const visible = ref<boolean>(false)
const bodyOverflow = ref<string>('')
const wrapper = ref<HTMLDivElement>()
const imgRefs = ref<HTMLImageElement[]>([])
const loading = ref<boolean>(true)
const activeIndex = ref(props.initialIndex)
const transform = ref({
  scale: 1,
  deg: 0,
  offsetX: 0,
  offsetY: 0,
  enableTransition: false,
})
let clearnKeydown: Function
let clearnWheel: Function

// 图标列表
const actionsIconList = ref<ActionsIcon[]>([
  {
    name: 'zoomIn',
    title: '放大',
    visible: true,
    icon: markRaw(ZoomIn),
    func: handleZoomIn,
  },
  {
    name: 'zoomOut',
    title: '缩小',
    visible: true,
    icon: markRaw(ZoomOut),
    func: handleZoomOut,
  },
  {
    name: 'rotateLeft',
    title: '向左旋转',
    visible: true,
    icon: markRaw(RefreshLeft),
    func: handleRotateLeft,
  },
  {
    name: 'rotateLeft',
    title: '向右旋转',
    visible: true,
    icon: markRaw(RefreshRight),
    func: handleRotateRight,
  },
  {
    name: 'download',
    title: '下载',
    visible: true,
    icon: markRaw(Download),
    func: handleDownload,
  },
])
// 是否单个文件
const isSingle = computed((): boolean => {
  const { previewList } = props
  return previewList.length <= 1
})
const isFirst = computed((): boolean => {
  return activeIndex.value === 0
})
const isLast = computed((): boolean => {
  return activeIndex.value === props.previewList.length - 1
})
const currentImg = computed((): any => {
  return props.previewList[activeIndex.value]
})
const imgStyle = computed((): CSSProperties => {
  const { scale, deg, offsetX, offsetY, enableTransition } = transform.value
  let translateX = offsetX / scale
  let translateY = offsetY / scale
  switch (deg % 360) {
    case 90:
    case -270:
      ;[translateX, translateY] = [translateY, -translateX]
      break
    case 180:
    case -180:
      ;[translateX, translateY] = [-translateX, -translateY]
      break
    case 270:
    case -90:
      ;[translateX, translateY] = [-translateY, translateX]
      break
  }
  const style: CSSProperties = {
    transform: `scale(${scale}) rotate(${deg}deg) translate(${translateX}px, ${translateY}px)`,
    transition: enableTransition ? 'transform .3s' : '',
  }
  return style
})

watch(
  () => props.modelValue,
  (val: boolean): void => {
    if (val) {
      bodyOverflow.value = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    visible.value = val
    nextTick(() => {
      val && registerEventListener()
    })
  },
  {
    immediate: true,
  }
)

watch(
  () => props.showDownload,
  (val: boolean): void => {
    actionsIconList.value.forEach((icon: ActionsIcon) => {
      icon.name === 'download' && (icon.visible = val)
    })
  },
  {
    immediate: true,
  }
)

watch(currentImg, () => {
  nextTick(() => {
    const $img = imgRefs.value[0]
    if (!$img?.complete) {
      loading.value = true
    }
  })
})

watch(activeIndex, val => {
  resetImg()
})

onMounted(() => {
  registerEventListener()
  wrapper.value?.focus?.()
})

// ------------------------------定义Methods----------------------------

function isPdf(fileName: any): boolean {
  return fileName.substring(fileName.lastIndexOf('.') + 1).toLocaleLowerCase() === 'pdf'
}
function registerEventListener(): void {
  const keydownHandler = useThrottleFn((e: KeyboardEvent): void => {
    switch (e.code) {
      // ESC
      case 'Escape':
        props.closeOnPressEscape && hide()
        break
      // LEFT
      case 'ArrowLeft':
        prev()
        break
      // RIGHT
      case 'ArrowRight':
        next()
        break
      // UP
      case 'ArrowUp':
        handleZoomIn()
        break
      // DOWN
      case 'ArrowDown':
        handleZoomOut()
        break
    }
  }, 50)
  const mousewheelHandler = (e: WheelEvent): void => {
    const delta = e.deltaY || e.deltaX
    delta < 0 ? handleZoomIn() : handleZoomOut()
  }
  clearnKeydown = useEventListener(document, 'keydown', keydownHandler)
  clearnWheel = useEventListener(document, 'wheel', mousewheelHandler)
}
function unregisterEventListener(): void {
  clearnKeydown()
  clearnWheel()
}
// 关闭
function hide(): void {
  unregisterEventListener()
  resetImg()
  activeIndex.value = 0
  visible.value = false
  document.body.style.overflow = bodyOverflow.value
  emits('update:modelValue', false)
  emits('closed')
}
// 重置图片样式
function resetImg(): void {
  transform.value = {
    scale: 1,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: false,
  }
}
// 图片加载
function handleImgLoad() {
  loading.value = false
}
// 图片加载失败
function handleImgError(e: Event): void {
  loading.value = false
  ;(e.target as HTMLImageElement).alt = 'image load failed'
}
// 拖动
function handleMouseDown(e: MouseEvent): void {
  if (loading.value || e.button !== 0 || !wrapper.value) return
  transform.value.enableTransition = false
  const { offsetX, offsetY } = transform.value
  const startX = e.pageX
  const startY = e.pageY
  const dragHandler = (ev: MouseEvent): void => {
    transform.value = {
      ...transform.value,
      offsetX: offsetX + ev.pageX - startX,
      offsetY: offsetY + ev.pageY - startY,
    }
  }
  const removeMousemove = useEventListener(document, 'mousemove', dragHandler)
  useEventListener(document, 'mouseup', (): void => {
    removeMousemove()
  })
  e.preventDefault()
}
// 设置要展示的Item
function setActiveItem(index: number): void {
  const len = props.previewList.length
  activeIndex.value = (index + len) % len
}
// 上一个
function prev(): void {
  if (isFirst.value && !props.infinite) return
  setActiveItem(activeIndex.value - 1)
}
// 下一个
function next(): void {
  if (isLast.value && !props.infinite) return
  setActiveItem(activeIndex.value + 1)
}
// 放大
function handleZoomIn(): void {
  if (transform.value.scale < 7) {
    transform.value.scale = Number.parseFloat((transform.value.scale * 1.2).toFixed(3))
  }
  transform.value.enableTransition = false
}
// 缩小
function handleZoomOut(): void {
  if (transform.value.scale > 0.2) {
    transform.value.scale = Number.parseFloat((transform.value.scale / 1.2).toFixed(3))
  }
  transform.value.enableTransition = false
}
// 向左旋转
function handleRotateLeft(): void {
  transform.value.deg -= 90
  transform.value.enableTransition = true
}
//向右旋转
function handleRotateRight(): void {
  transform.value.deg += 90
  transform.value.enableTransition = true
}
// 下载
async function handleDownload(): Promise<void> {
  const fileBlob = await downloadFile({
    url: currentImg.value.previewUrl,
  })
  fileBlob && createSave(fileBlob, currentImg.value.fileName)
}
// 暴露方法
defineExpose({
  setActiveItem,
})
</script>

<style scoped lang="scss">
@import './styles/index.scss';
</style>
