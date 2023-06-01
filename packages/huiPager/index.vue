<template>
  <div class="pages">
    <div>
      共 <span class="blue">{{ total }}</span> 条记录
      <span v-if="total > 0" class="currentCount">
        ，当前为
        <span class="blue">{{ (pageData.pageNum - 1) * pageData.size + 1 }}</span> ~
        <span class="blue">{{ (pageData.pageNum - 1) * pageData.size + list.length }}</span>
        条记录
      </span>
    </div>
    <el-config-provider :locale="zhCn">
      <ElPagination
        v-model:currentPage="pageData.pageNum"
        v-model:pageSize="pageData.size"
        :total="total"
        :page-sizes="pageSizes"
        :layout="layout"
        :prev-text="prevText"
        :next-text="nextText"
        :background="true"
        popper-class="select-class"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></ElPagination>
    </el-config-provider>
  </div>
</template>
<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
defineOptions({
  name: 'HuiPager',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    total: number
    currentPage: number
    pageSize: number
    layout?: string
    pageSizes?: number[]
    list: { [key: string]: any }[]
  }>(),
  {
    layout: 'sizes, prev, pager, next, jumper',
    total: 0,
    currentPage: 1,
    pageSize: 20,
    pageSizes: () => [10, 20, 50, 100, 500, 1000],
    list: () => [],
  }
)
let pageData = computed(() => {
  return {
    pageNum: props.currentPage,
    size: props.pageSize,
  }
})

const prevText: string = '上一页'
const nextText: string = '下一页'
const emit = defineEmits(['callback', 'update:currentPage', 'update:pageSize'])
function handleSizeChange(val: number) {
  emit('update:currentPage', 1)
  emit('update:pageSize', val)
  emit('callback', val)
}
function handleCurrentChange(val: number) {
  emit('update:currentPage', val)
  emit('callback', val)
}
</script>

<style lang="scss" scoped>
.pages {
  display: flex;
  margin-top: 12px;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;

  .blue {
    color: $blue;
  }
}

:deep.el-pagination.is-background .btn-prev,
:deep.el-pagination.is-background .btn-next {
  border-style: solid;
  border-color: #dcdcdc;
}

:deep.el-pagination.is-background .btn-prev {
  border-width: 1px 0 1px 1px;
}

:deep.el-pagination.is-background .btn-next {
  border-width: 1px 1px 1px 0;
}

:deep.el-pagination.is-background .btn-prev,
:deep.el-pagination.is-background .btn-next,
:deep.el-pagination.is-background .el-pager li {
  margin: 0 !important;
}

:deep.el-pagination {
  .el-pager {
    &:first-of-type {
      border-left: 1px solid #dcdcdc;
    }

    li {
      border-top: 1px solid #dcdcdc !important;
      border-bottom: 1px solid #dcdcdc !important;
      border-right: 1px solid #dcdcdc;
    }
  }

  .el-select .el-input,
  .el-pagination__editor.el-input {
    height: 26px;
    margin-right: 12px;
  }
}
</style>
