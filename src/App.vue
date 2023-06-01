<template>
  <el-config-provider :z-index="zIndex" :locale="locale">
    <img src="./assets/images/logo.png" class="logo" alt="HUI logo" />
    <h1 class="name">hui-ui</h1>
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
export default defineComponent({
  components: {
    ElConfigProvider,
  },
  setup() {
    return {
      zIndex: 3000,
      locale: zhCn,
    }
  },
})
</script>
<style lang="scss" scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.name {
  color: $dark-2;
}
</style>
