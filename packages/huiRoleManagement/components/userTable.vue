<template>
  <div class="table-wrapper">
    <HuiTable
      :columns="columns"
      :table-data="data.list"
      :options="options"
      @select-rows="onSelect"
      @select-all="onSelect"
      @command="onCommand"
    />
    <HuiOrganize v-bind="orgArgs" v-model="orgVisible" @closed="onOrgClose" @getCheckedData="onOrgChecked" />
  </div>
</template>
<script lang="ts" setup name="UserTable">
import HuiOrganize from '../../huiOrganize/index.vue'
import HuiTable from '../../huiTable/index.vue'
import { Table } from '../../huiTable/types/type'
import { UserListItem } from '@packages/huiUser/types/type'
import { PropType } from 'vue'
import type { PageParams } from '@/hooks/useApi'
import { OrganizeProps, RoleUserActions } from '../types/type'
import useUser from '@packages/huiUser/hooks/useUser'

defineProps({
  data: {
    type: Object as PropType<
      {
        list: UserListItem[]
      } & PageParams
    >,
    default: {
      list: [],
    },
  },
})
const options = {
  settingTable: true,
  tableId: 'hui-role-user-list',
  height: '100%',
}
const currRow = ref<UserListItem | null>(null)

const organizeProps = inject('organizeProps') as OrganizeProps
const roleUserActions = inject('roleUserActions') as RoleUserActions

const orgVisible = ref(false)

const { saveUserAuthOrg } = useUser()

const orgArgs = reactive({
  title: '添加组织',
  multiple: true,
  currentNodeKey: [] as any[],
  checkedKeysData: [],
  ...organizeProps,
})

const onOrgClose = () => {
  orgVisible.value = false
}
const onOrgChecked = (selection: any[]) => {
  saveUserAuthOrg({
    roleId: currRow.value?.roleId!,
    userCodes: [currRow.value?.userCode!],
    orgList: selection.map(i => i.id),
  })
}

const emits = defineEmits(['select'])

const onCommand = (type: string, row: UserListItem) => {
  currRow.value = row
  if (type === 'addOrg') {
    orgVisible.value = true
  } else {
    roleUserActions.find(i => i.command === type)?.method(row)
  }
}

const onSelect = (selection: UserListItem[]) => {
  emits('select', selection)
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
    minWidth: 120,
  },
  {
    prop: 'name',
    label: '姓名',
    format: (row: any) => {
      if (row?.englishName) {
        return `<span style="color: #1775ff">${row.name} - ${row.englishName}</span>`
      } else {
        return `<span>${row.name}</span>`
      }
    },
  },
  {
    prop: 'userCode',
    label: '登录账号',
    minWidth: 120,
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
        name: '组织',
        command: 'addOrg',
        type: 'primary',
      },
      ...roleUserActions,
    ],
  },
]
</script>
<style lang="scss" scoped>
:deep.table-wrapper {
  height: calc(100% - 190px);
  padding: 0 16px 10px;

  .el-table .el-table__inner-wrapper {
    height: 100% !important;
  }
}
.el-pagination {
  margin-top: 10px;
  float: right;
}
</style>
