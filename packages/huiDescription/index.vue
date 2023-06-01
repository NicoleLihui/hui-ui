<template>
  <section class="long-text">
    <section class="long-content">
      <p class="long-content-text" :line-clamp="showAll ? 0 : line" :bg-color="bg" ref="longContentRef">
        <span
          v-if="btnVisible"
          :class="[
            label === 'icon' ? 'long-content-text-icon' : 'long-content-text-btn',
            showAll ? 'show-collapse' : 'show-expand',
          ]"
          :style="{ '--bg': icon }"
          @click="handleChange"
          :data-attr="showAll ? '收起' : label"
        >
        </span>
        <span ref="textRef">{{ content }}</span>
      </p>
    </section>
  </section>
</template>
<script lang="ts" setup>
import defaultIcon from '@/assets/images/arrow.png'
import { VueElement, PropType } from 'vue'
defineOptions({
  name: 'HuiDescription',
  inheritAttrs: false,
})
const props = defineProps({
  line: {
    type: Number as PropType<1 | 2 | 3 | 4 | 5>,
    default: 5,
  },
  bg: {
    type: String,
    default: 'white',
  },
  label: {
    type: String,
    default: '展开',
  },
  icon: {
    type: String,
    default: `url(${defaultIcon})`,
  },
  content: {
    type: String,
  },
})

const btnVisible = ref(true)
const textRef = ref<VueElement>()
const longContentRef = ref<VueElement>()

const setBtnShow = () => {
  // 延时是由于元素max-height设置了.3s 的transition
  setTimeout(() => {
    if (textRef.value?.offsetHeight! <= longContentRef.value?.offsetHeight!) {
      btnVisible.value = false
    } else {
      btnVisible.value = true
    }
  }, 200)
}
watch(
  () => props.content,
  () => {
    setBtnShow()
  }
)
watch(
  () => props.line,
  () => {
    setBtnShow()
  }
)
onMounted(() => {
  setBtnShow()
})
const showAll = ref(false)
const handleChange = () => {
  showAll.value = !showAll.value
}
</script>
<style lang="scss" scoped>
[line-clamp='1'] {
  max-height: 1.5em;
}
[line-clamp='2'] {
  max-height: 3em;
}
[line-clamp='3'] {
  max-height: 4.5em;
}
[line-clamp='4'] {
  max-height: 6em;
}
[line-clamp='5'] {
  max-height: 7.5em;
}
[bg-color='white'] {
  &::after,
  > span {
    background: #ffffff;
  }
}
[bg-color='gray'] {
  &::after,
  > span {
    background: #f6f6f6;
  }
}
.long-text {
  overflow: hidden;
  position: relative;
  font-size: 14px;
}
@mixin show-btn {
  user-select: none;
  line-height: 1.5;
  float: right;
  clear: both;
  font-size: 14px;
  padding: 0 4px;
  color: $blue;
  cursor: pointer;
  position: relative;
  margin-left: 14px;
  &.show-expand::before {
    content: '...';
    position: absolute;
    left: -2px;
    color: $original-color;
    transform: translateX(-100%);
  }
}
.long-content {
  display: flex;
  color: $original-color;
  position: relative;
  top: 0;
  &-text {
    margin: 0;
    line-height: 1.5;
    text-align: justify;
    overflow: hidden;
    transition: 0.3s max-height;
    &::before {
      content: '';
      float: right;
      width: 0;
      height: 100%;
      margin-bottom: -21px;
      // height: calc(100% - 22px);
    }
    // &::after {
    //   content: '';
    //   width: 100%;
    //   height: 22px;
    //   position: absolute;
    // }
    &-btn {
      @include show-btn;
      &::after {
        content: attr(data-attr);
      }
    }
    &-icon {
      @include show-btn;
      &.show-collapse {
        transform: rotateZ(180deg);
      }
      &::after {
        content: '';
        width: 12px;
        height: 12px;
        background-image: var(--bg);
        background-repeat: no-repeat;
        background-size: 100%;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>
