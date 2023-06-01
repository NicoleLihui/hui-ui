<template>
  <div class="role-list-wrapper">
    <div class="list-title">
      <h3 class="header-title">角色列表</h3>
      <div class="btn-group">
        <el-button type="primary" @click="addRole">新增角色</el-button>
        <el-button :disabled="deleteDisabled" type="danger" @click="deleteBatch()">批量删除</el-button>
      </div>
    </div>
    <div class="role-list-content">
      <div class="search-form">
        <el-form-item label="角色">
          <el-input v-model="roleKeyword" placeholder="请输入角色名称" clearable @clear="onSearch" />
        </el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
      <el-scrollbar v-loading="roleListData.loading">
        <ul class="role-list">
          <li v-for="item in roleListData.list" :key="item.id">
            <el-checkbox v-model="item.checked" @change="val => onSelect(!!val, item)">
              {{ item.name }}
            </el-checkbox>
            <el-icon @click="editRole(item)"><edit /></el-icon>
            <el-icon @click="deleteBatch(item)"><delete /></el-icon>
            <el-icon @click="toggleVisible(item)" :class="item.showDetail ? 'expanded' : ''"><arrow-right /></el-icon>
            <div class="role-detail" :class="item.showDetail ? 'is-show' : ''">
              <p>角色编码：{{ item.code }}</p>
              <p>更新时间：{{ item.gmtCreate }}</p>
              <p>角色描述：{{ item.intro }}</p>
            </div>
          </li>
        </ul>
      </el-scrollbar>
      <el-pagination
        v-model:current-page="roleListData.currPage"
        :page-size="roleListData.pageSize"
        layout="total, prev, pager, next"
        :total="roleListData.total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>
    <role-edit ref="roleEditRef" @onSubmit="refreshList" />
  </div>
</template>
<script lang="ts" setup name="RoleList">
import { Setting, Edit, Delete, ArrowRight } from '@element-plus/icons-vue'
import RoleEdit from './roleEdit.vue'
import useRole from '../hooks/useRole'
import { RoleListItem } from '../types/type'

const { roleListData, getRoleList, batchDeleteRole } = useRole()

const deleteDisabled = ref(true)
const roleKeyword = ref('')

const getList = () => {
  getRoleList({
    roleName: roleKeyword.value,
  }).then(() => {
    roleListData.list.forEach(item => {
      item.checked = !!selectedList.value.find(i => i.id === item.id)
    })
  })
}

onMounted(() => {
  getList()
})

const roleEditRef = ref()

const addRole = () => {
  roleEditRef.value.open()
}

const onSearch = () => {
  roleListData.currPage = 1

  onSelect(false)
  return getList()
}

const refreshList = () => {
  roleKeyword.value = ''
  return onSearch()
}

const editRole = (item: RoleListItem) => {
  roleEditRef.value.open(item)
}

const toggleVisible = (item: RoleListItem) => {
  item.showDetail = !item.showDetail
}

const selectedList = ref<RoleListItem[]>([])

const emit = defineEmits(['setSelected'])

const onSelect = (value: boolean, item?: RoleListItem) => {
  if (!item) {
    selectedList.value = []
  } else if (value) {
    selectedList.value.push(item)
  } else {
    selectedList.value.splice(
      selectedList.value.findIndex(i => i.id === item.id),
      1
    )
  }
  emit('setSelected', selectedList.value)
  deleteDisabled.value = !selectedList.value.length
}

const deleteBatch = (item?: RoleListItem) => {
  // @ts-ignore
  ElMessageBox.confirm(`确定删除角色 ${(item ? [item] : selectedList.value).map(i => i.name).join('、')} ?`, '提示', {
    confirmButtonText: '删除',
    confirmButtonClass: 'el-button--danger',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      batchDeleteRole(item ? [item.id] : selectedList.value.map(i => i.id)).then(() => {
        refreshList()
      })
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}
</script>
<style lang="scss" scoped>
.list-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px 16px;
  border-bottom: 1px solid #dcdcdc;

  h3 {
    @include table-title($blue);
    color: #333;
    line-height: 32px;
  }
}
.search-form {
  display: flex;
}
.role-list-content {
  padding: 0 16px;
  display: flex;
  height: calc(100% - 80px);
  flex-direction: column;

  .el-scrollbar {
    flex: 1;
  }

  li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border-bottom: 1px solid #eee;
    .el-checkbox {
      flex: 1;
      height: 46px;
    }

    .el-icon {
      margin-right: 6px;
      color: #aaa;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: #3864cf;
      }

      &.expanded {
        transform: rotate(90deg);
      }
    }

    .role-detail {
      // height: 0;
      max-height: 0;
      overflow: hidden;
      width: 100%;
      padding: 0 20px;
      font-size: 14px;
      background-color: #f5f7fa;
      color: #999;
      line-height: 30px;
      transition: all 0.3s;

      &.is-show {
        max-height: 500px;
        padding: 10px 20px;
      }
    }
  }
}
</style>
