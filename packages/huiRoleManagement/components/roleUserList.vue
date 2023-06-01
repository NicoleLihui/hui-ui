<template>
  <div class="role-user-list">
    <div class="user-title">
      <p class="header-content">
        关联员工（
        <el-tooltip :content="roleNames">
          <span class="role-name">{{ roleNames }}</span>
        </el-tooltip>
        ）
      </p>
      <div class="btn-group">
        <el-button type="primary" :disabled="selectedRoles.length !== 1" @click="associatedUser"> 关联员工 </el-button>
        <el-button type="danger" :disabled="batchDeleteDisabled" @click="deleteBatch"> 批量删除 </el-button>
      </div>
    </div>
    <el-form ref="searchFormRef" inline class="search-form" :model="searchForm">
      <el-form-item label="所属公司" prop="pkOrgList">
        <el-input placeholder="请选择" @focus="selectOrg" :value="searchForm.pkOrgList.map(i => i.name).join(',')" />
      </el-form-item>
      <el-form-item label="用户" prop="fuzzy">
        <el-input placeholder="请输入姓名/登录账号" v-model="searchForm.fuzzy" />
      </el-form-item>
      <div class="btn-group">
        <el-button @click="refreshList">重置</el-button>
        <el-button type="primary" @click="() => getList()">查询</el-button>
      </div>
    </el-form>
    <user-table v-loading="roleUserData.loading" :data="roleUserData" @select="onUserSelect" @getList="getList" />
    <HuiPager
      v-model:current-page="roleUserData.currPage"
      v-model:page-size="roleUserData.pageSize"
      :total="roleUserData.total"
      :list="roleUserData.list"
      layout="sizes, prev, pager, next"
      @callback="getList"
    />
    <HuiPerson v-bind="personArgs" v-model="personVisible" @getCheckedData="onPersonChecked" />
    <HuiOrganize v-bind="orgArgs" v-model="orgVisible" @closed="onOrgClose" @getCheckedData="onOrgChecked" />
  </div>
</template>
<script lang="ts" setup name="RoleUserList">
import useUser from '@packages/huiUser/hooks/useUser'
import HuiOrganize from '../../huiOrganize/index.vue'
import HuiPerson from '../../huiPerson/index.vue'
import { OrganizeProps, PersonProps, RoleListItem } from '../types/type'
import UserTable from './userTable.vue'
import HuiPager from '@packages/huiPager/index.vue'
import { UserListItem } from '@packages/huiUser/types/type'

const personVisible = ref(false)
const orgVisible = ref(false)
const searchFormRef = ref()

const selectedRoles = ref<RoleListItem[]>([])

const personProps = inject('personProps') as PersonProps
const organizeProps = inject('organizeProps') as OrganizeProps

const roleNames = computed(() => {
  return selectedRoles.value.map(i => i.name).join(',')
})

const state = reactive({
  selectedUsers: [] as UserListItem[],
  searchForm: {
    pkOrgList: [] as any[],
    fuzzy: '',
    roles: [] as number[],
  },
  personArgs: {
    userId: '',
    title: '关联员工',
    limit: 10,
    modelValue: false,
    selectedData: [],
    ...personProps,
  },
  orgArgs: {
    title: '所属公司',
    multiple: true,
    checkedKeysData: [] as any[],
    ...organizeProps,
  },
})

const { selectedUsers, searchForm, personArgs, orgArgs } = toRefs(state)

const { getRoleUser, roleUserData, bindRoleUsers, unbindRoleUsers } = useUser()

const batchDeleteDisabled = computed(() => {
  return !(selectedRoles.value.length === 1 && !!selectedUsers.value.length)
})

const getList = (page?: { page?: number; size?: number }) => {
  roleUserData.currPage = page?.page || roleUserData.currPage
  roleUserData.pageSize = page?.size || roleUserData.pageSize
  getRoleUser({
    ...searchForm.value,
    pkOrgList: searchForm.value.pkOrgList.map(i => i.id),
  }).then(() => {
    selectedUsers.value = []
  })
}
onMounted(() => {
  getList()
})

defineExpose({
  setSelectedRoles: (list: RoleListItem[]) => {
    selectedRoles.value = list
    searchForm.value.roles = list.map(i => i.id)
    getList()
  },
})

const associatedUser = () => {
  personVisible.value = true
}

const deleteBatch = () => {
  ElMessageBox.confirm(`确定要删除吗 ?`, '提示', {
    confirmButtonText: '删除',
    confirmButtonClass: 'el-button--danger',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      unbindRoleUsers({
        roleId: selectedRoles.value[0].id,
        userCodes: selectedUsers.value.map(i => i.userCode),
      }).then(() => {
        refreshList()
      })
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

const selectOrg = () => {
  orgVisible.value = true
}

const refreshList = () => {
  searchFormRef.value.resetFields()
  roleUserData.currPage = 1
  getList()
}

const onUserSelect = (list: UserListItem[]) => {
  selectedUsers.value = list
}

const onOrgClose = () => {
  orgVisible.value = false
}

const onOrgChecked = (val: any[]) => {
  state.orgArgs.checkedKeysData = val
  searchForm.value.pkOrgList = val
}

const onPersonChecked = (val: any[]) => {
  bindRoleUsers({
    roleId: selectedRoles.value[0].id,
    userCodes: val.map(i => i.userCode),
  }).then(() => {
    refreshList()
  })
}
</script>
<style lang="scss" scoped>
.role-user-list {
  height: 100%;

  .user-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    margin-bottom: 20px;
    border-bottom: 1px solid #dcdcdc;

    .header-content {
      width: calc(100% - 200px);
      font-weight: 500;
      font-size: 16px;
    }
    .role-name {
      display: inline-block;
      max-width: 75%;
      vertical-align: top;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 400;
    }
  }
  .search-form {
    padding: 0 16px;
    margin-bottom: 5px;
    overflow: visible;

    .el-form-item {
      margin-right: 20px;
    }

    .btn-group {
      float: right;
    }
  }
  .pages {
    padding: 0 16px;
  }
}
</style>
