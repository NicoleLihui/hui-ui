<template>
  <div class="table-wrapper">
    <div class="table-title">
      <span class="header-title">用户列表</span>
      <el-button type="primary" :disabled="!selectedRows.length" @click="authBatch">批量授权</el-button>
    </div>
    <HuiTable
      :columns="columns"
      :table-data="data.list"
      :options="{
        ...options,
        paginationConfig: {
          pageSize: data.pageSize,
          currentPage: data.currPage,
        },
      }"
      :selectable="selectable"
      @command="onCommand"
      @selectionChange="onSelect"
    />
    <auth-dialog ref="authDialogRef" :selectedUsers="selectedRows" @onSuccess="onSuccess" />
  </div>
</template>
<script lang="ts" setup name="UserTable">
import { PageParams } from '@/hooks/useApi'
import HuiTable from '@packages/huiTable/index.vue'
import { Table } from '@packages/huiTable/types/type'
import { PropType } from 'vue'
import { UserDetail, UserStates, DetailMethod } from '../../types/type'
import { STATE_MAP } from '../../utils/constant'
import AuthDialog from './authDialog.vue'

defineProps({
  data: {
    type: Object as PropType<
      {
        list: UserDetail[]
      } & PageParams
    >,
    default: {
      list: [],
    },
  },
})

const options = {
  settingTable: true,
  tableId: 'hui-user-list',
  height: 'calc(100% - 30px)',
}

const detailMethod = inject('detailMethod') as DetailMethod

const onCommand = (type: string, row: UserDetail) => {
  detailMethod(row)
}

const selectedRows = ref<string[]>([])
const authDialogRef = ref()

const onSelect = (val: UserDetail[]) => {
  selectedRows.value = val.map(i => i.userCode)
}

const authBatch = () => {
  authDialogRef.value.open()
}

const selectable = (row: UserDetail) => {
  return row.status !== UserStates.Disabled
}

const emits = defineEmits(['onRefresh'])
const onSuccess = () => {
  emits('onRefresh')
}

const columns: Table.Column<UserDetail>[] = [
  {
    type: 'selection',
    prop: 'selection',
    label: '多选',
    width: '50',
    align: 'center',
  },
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'userCode',
    label: '登录账号',
    minWidth: 120,
  },
  {
    prop: 'status',
    label: '状态',
    format: row => {
      const statusDesc = STATE_MAP[row.status as UserStates]
      return statusDesc
        ? `<span class="el-tag ${
            row!.status === UserStates.Disabled ? 'el-tag--danger' : 'el-tag--light'
          }">${statusDesc}</span>`
        : ''
    },
  },
  {
    prop: 'mobile',
    label: '电话号码',
    minWidth: 112,
  },
  {
    prop: 'email',
    label: '邮箱',
    minWidth: 120,
  },
  {
    prop: 'roleName',
    label: '角色',
    minWidth: 130,
    format: row => {
      return row.roles?.map((i: any) => i.name).join(',') || '--'
    },
  },
  {
    prop: 'orgName',
    label: '所属公司',
    minWidth: 130,
  },
  {
    prop: 'positionName',
    label: '职位',
  },
  {
    type: 'actions',
    prop: 'action',
    label: '操作',
    buttons: [
      {
        name: '查看',
        type: 'primary',
        command: 'detail',
      },
    ],
  },
]
</script>
<style lang="scss" scoped>
:deep.table-wrapper {
  .table-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    align-items: center;

    .header-title {
      @include table-title($blue);
    }
  }
  .role-list {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 40%;
      .el-radio {
        color: #626262;
        font-weight: normal;
      }
    }
  }
}
</style>
