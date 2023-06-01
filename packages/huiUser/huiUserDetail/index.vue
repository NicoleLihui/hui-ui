<template>
  <div class="user-info-wrapper">
    <div class="user-header">
      <div class="user-title-left">
        <img :src="userInfo.avatar || Avatar" alt="" />
        <div class="user-info">
          <div class="user-top">
            <span class="user-name">{{ userInfo.name }}</span>
            <span class="name-en">{{ userInfo.userCode }}</span>
            <el-tag :type="userDisabled ? 'danger' : ''">{{ getStatus(userInfo.status) }}</el-tag>
          </div>
          <p class="user-bottom">
            <span>{{ userInfo.mobile }}</span>
            <span class="line" />
            <span>{{ userInfo.email }}</span>
            <span class="line" />
            <span v-if="userInfo.orgName">{{
              `${userInfo.orgName}-${userInfo.orgAreaName}-${userInfo.deptName}`
            }}</span>
          </p>
        </div>
      </div>
      <div class="user-title-right">
        <template v-if="userDisabled">
          <el-button type="primary" @click="changeStatus(UserStates.Normal)">启用</el-button>
          <el-button type="primary" @click="permissionAssign">权限转让</el-button>
        </template>
        <el-button v-else type="danger" @click="changeStatus(UserStates.Disabled)">停用</el-button>
      </div>
    </div>
    <div class="role-list-content">
      <h3 class="header-title">角色列表</h3>
      <el-scrollbar class="role-list">
        <li v-for="item in roleList" :key="item.id">
          <div class="role-info" :class="item.checked ? 'is-selected' : ''">
            <span @click="() => checkRoleItem(item)">{{ item.name }}</span>
            <el-icon @click="() => deleteUserRole(item)"><delete /></el-icon>
          </div>
        </li>
      </el-scrollbar>
      <el-button type="primary" :disabled="userDisabled" @click="addUserRole">添加角色</el-button>
    </div>
    <div class="auth-content">
      <el-tabs v-model="currTab">
        <el-tab-pane label="组织" name="org">
          <AuthorizationOrg :userInfo="userInfo" :role-ids="selectedRoles.map(i => i.id)" />
        </el-tab-pane>
        <slot></slot>
      </el-tabs>
    </div>
    <auth-dialog ref="authDialogRef" :selectedUsers="[userInfo.userCode]" @onSuccess="onSuccess" />
    <HuiPerson v-bind="personArgs" :limit="1" v-model="personVisible" @getCheckedData="onPersonChecked" />
  </div>
</template>
<script lang="ts" setup>
import Avatar from '../assets/avatar-default.png'
import { RoleListItem } from '@packages/huiRoleManagement/types/type'
import { OrganizeProps, PersonProps, UserDetail, UserStates } from '../types/type'
import { STATE_MAP } from '../utils/constant'
import { Delete } from '@element-plus/icons-vue'
import AuthorizationOrg from './components/authorizationOrg.vue'
import HuiPerson from '../../huiPerson/index.vue'
import useUser from '../hooks/useUser'
import AuthDialog from '../huiUserManagement/components/authDialog.vue'
defineOptions({
  name: 'HuiUserDetail',
  inheritAttrs: false,
})
const currTab = ref('org')
const authDialogRef = ref()

const props = withDefaults(
  defineProps<{
    personProps: PersonProps
    organizeProps: OrganizeProps
    urlPrefix: string
    userCode: string
    headers?: AnyObj
  }>(),
  {}
)

const state = reactive({
  userInfo: {} as UserDetail,
  roleList: [] as RoleListItem[],
  selectedRoles: [] as RoleListItem[],
  allRolesList: [] as RoleListItem[],
  personArgs: {
    userId: '',
    title: '权限转让',
    limit: 10,
    modelValue: false,
    selectedData: [],
    ...props.personProps,
  },
  personVisible: false,
})

const { userInfo, roleList, allRolesList, selectedRoles, personArgs, personVisible } = toRefs(state)

provide<string>('urlPrefix', props.urlPrefix)
provide<AnyObj>('headers', props.headers || {})
provide<OrganizeProps>('organizeProps', props.organizeProps)
provide('roleList', allRolesList)

const { getUserDetail, getUserRoles, fetchAllRoles, changeUserState, unbindRoleUsers, transferAssets } = useUser(
  props.urlPrefix,
  props.headers || {}
)

const userDisabled = computed(() => {
  return userInfo.value.status === UserStates.Disabled
})

const getRoleList = () => {
  return getUserRoles(props.userCode).then(({ data }) => {
    roleList.value = data
  })
}

const initData = () => {
  getUserDetail(props.userCode).then(({ data }) => {
    userInfo.value = data
  })
  getRoleList()
  fetchAllRoles().then(({ data }) => {
    allRolesList.value = data
  })
}

onMounted(() => {
  initData()
})

const getStatus = (status: UserStates) => {
  return STATE_MAP[status]
}

const addUserRole = () => {
  authDialogRef.value.open()
}

const changeStatus = (status: UserStates) => {
  changeUserState({
    userCode: props.userCode,
    status,
  }).then(() => {
    userInfo.value.status = status
  })
}

const permissionAssign = () => {
  personVisible.value = true
}

const onSuccess = () => {
  getRoleList()
}

const emits = defineEmits(['onRoleChecked'])

const checkRoleItem = (item: RoleListItem) => {
  item.checked = !item.checked
  selectedRoles.value = roleList.value.filter(i => i.checked)
  emits('onRoleChecked', selectedRoles.value)
}

const deleteUserRole = (item: RoleListItem) => {
  ElMessageBox.confirm(`确定要删除该用户的 ${item.name} 角色吗？`, '提示', {
    confirmButtonText: '删除',
    confirmButtonClass: 'el-button--danger',
    type: 'warning',
  })
    .then(() => {
      unbindRoleUsers({
        roleId: item.id,
        userCodes: [props.userCode],
      }).then(() => {
        getRoleList()
      })
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

const onPersonChecked = (val: any[]) => {
  transferAssets({
    userCode: props.userCode,
    targetUserCode: val[0].userCode,
  })
}
</script>
<style lang="scss" scoped>
@import './styles/index.scss';
</style>
