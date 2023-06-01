<template>
  <div class="auth-org" v-loading="userAuthOrgsData.loading">
    <el-form class="search-form" inline>
      <el-form-item label="组织">
        <el-input class="org-input" placeholder="请输入组织名称" clearable v-model="orgKeyword" />
      </el-form-item>
      <el-button type="primary" @click="getList">查询</el-button>
    </el-form>
    <div class="header-content">
      <h3 class="header-title">组织列表</h3>
      <el-checkbox
        v-model="isSyncOrgs"
        :disabled="roleIds.length !== 1 || userInfo?.status !== UserStates.Normal || !userAuthOrgsData.total"
        @change="onSyncChange"
      >
        同步更新组织
      </el-checkbox>
      <div class="btn-group">
        <el-button
          type="primary"
          :disabled="roleIds.length !== 1 || userInfo?.status !== UserStates.Normal"
          @click="selectOrg"
        >
          授权组织
        </el-button>
        <el-button type="danger" :disabled="!selectedOrgs.length" @click="() => batchDelete()">
          删除授权组织
        </el-button>
      </div>
    </div>
    <HuiTable
      :tableData="userAuthOrgsData.list"
      :columns="columns"
      :options="options"
      @selectRows="onOrgSelect"
      @selectAll="onOrgSelect"
      @command="onCommand"
    />
    <HuiPager
      v-model:current-page="userAuthOrgsData.currPage"
      v-model:page-size="userAuthOrgsData.pageSize"
      :total="userAuthOrgsData.total"
      :list="userAuthOrgsData.list"
      layout="sizes, prev, pager, next"
      @callback="getList"
    />
    <HuiOrganize v-bind="orgArgs" v-model="orgVisible" @closed="onOrgClose" @getCheckedData="onOrgChecked" />
  </div>
</template>
<script lang="ts" setup>
import HuiTable from '@packages/huiTable/index.vue'
import { Table } from '@packages/huiTable/types/type'
import useUser from '../../hooks/useUser'
import HuiPager from '@packages/huiPager/index.vue'
import HuiOrganize from '@packages/huiOrganize/index.vue'
import { OrganizeProps, UserDetail, UserOrgsItem, UserStates } from '../../types/type'
import { PropType } from 'vue'

const options = {
  settingTable: true,
  tableId: 'hui-auth-orgs',
  height: 'calc(100% - 140px)',
}

const organizeProps = inject('organizeProps') as OrganizeProps

const props = defineProps({
  roleIds: {
    type: Array as PropType<number[]>,
    default: [],
  },
  userInfo: {
    type: Object as PropType<UserDetail>,
    require: true,
  },
})

const userCode = computed(() => {
  return props.userInfo?.userCode || ''
})

watch(
  () => props.roleIds,
  roleIds => {
    getList()
    if (roleIds.length === 1) {
      getSyncStatus({
        userCode: userCode.value,
        roleIds,
      }).then(res => {
        isSyncOrgs.value = !!res.data
      })
    } else {
      isSyncOrgs.value = false
    }
  }
)

const state = reactive({
  orgArgs: {
    title: '所属公司',
    multiple: true,
    checkedKeysData: [] as any[],
    ...organizeProps,
  },
  selectedOrgs: [] as UserOrgsItem[],
  orgKeyword: '',
  orgVisible: false,
  isSyncOrgs: false,
})

const { orgArgs, selectedOrgs, orgKeyword, orgVisible, isSyncOrgs } = toRefs(state)

const { getUserAuthOrg, userAuthOrgsData, saveUserAuthOrg, deleteOrgAuth, syncOrgs, getSyncStatus, getUserAllOrgs } =
  useUser()

const resetForm = () => {
  userAuthOrgsData.currPage = 1
  orgKeyword.value = ''
  getList()
}

const getList = () => {
  selectedOrgs.value = []
  return getUserAuthOrg({
    userCode: userCode.value,
    roleIds: props.roleIds,
    fuzzyOrgName: orgKeyword.value || undefined,
  })
}

onMounted(() => {
  getList()
})

const selectOrg = () => {
  getUserAllOrgs({
    userCode: userCode.value,
    roleId: props.roleIds[0],
  }).then(res => {
    orgArgs.value.checkedKeysData = res.data
  })
  orgVisible.value = true
}

const onOrgClose = () => {
  orgVisible.value = false
}

const onOrgChecked = (val: any[]) => {
  state.orgArgs.checkedKeysData = val

  saveUserAuthOrg({
    orgList: orgArgs.value.checkedKeysData.map(i => i.id),
    userCodes: [userCode.value],
    roleId: props.roleIds[0],
  }).then(() => {
    resetForm()
  })
}

const onOrgSelect = (val: UserOrgsItem[]) => {
  selectedOrgs.value = val
}

const onSyncChange = () => {
  syncOrgs({
    userCode: userCode.value,
    autoRefreshOrgType: Number(isSyncOrgs.value) as 0 | 1,
    roleIds: props.roleIds,
  })
}

const batchDelete = (row?: UserOrgsItem) => {
  const orgs = row ? [row] : selectedOrgs.value
  ElMessageBox.confirm(
    `删除后，该用户将不再拥有对应组织下的 ${orgs.map(i => i.roleName).join(', ')} 权限，是否确认删除?`,
    '提示',
    {
      confirmButtonText: '删除',
      confirmButtonClass: 'el-button--danger',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteOrgAuth({
        userCode: userCode.value,
        ids: row ? [row.id] : selectedOrgs.value.map(i => i.id),
      }).then(() => {
        resetForm()
      })
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

const onCommand = (type: string, row: UserOrgsItem) => {
  if (type === 'delete') {
    batchDelete(row)
  }
}

const columns: Table.Column[] = [
  {
    type: 'selection',
    prop: 'selection',
    label: '多选',
    width: '50',
    align: 'center',
  },
  {
    prop: 'roleName',
    label: '角色名称',
  },
  {
    prop: 'orgName',
    label: '组织',
  },
  {
    prop: 'createTime',
    label: '授权时间',
    minWidth: 120,
  },
  {
    type: 'actions',
    prop: 'action',
    label: '操作',
    width: '80',
    buttons: [
      {
        name: '删除',
        command: 'delete',
        type: 'danger',
      },
    ],
  },
]
</script>
<style lang="scss" scoped>
.auth-org {
  height: 100%;
}

.header-content {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;

  .btn-group {
    flex: 1;
    text-align: right;
  }
  h3 {
    line-height: 32px;
    margin-right: 30px;
  }
  .el-checkbox {
    color: #aaa;
    font-weight: normal;
  }
}

.el-form {
  margin-bottom: 16px;

  .el-form-item {
    margin-bottom: 0;

    .org-input {
      width: 200px;
    }
  }
}
</style>
