<template>
  <div class="role-management-wrapper">
    <role-list @setSelected="setSelected" />
    <role-user-list ref="roleUserListRef" />
  </div>
</template>
<script lang="ts" setup>
import RoleList from './components/roleList.vue'
import RoleUserList from './components/roleUserList.vue'
import { RoleListItem, PersonProps, OrganizeProps, RoleUserActions } from './types/type'

export interface RoleManagementProps {
  personProps: PersonProps
  organizeProps: OrganizeProps
  urlPrefix: string
  roleUserActions: RoleUserActions
  headers?: AnyObj
}
defineOptions({
  name: 'HuiRoleManagement',
  inheritAttrs: false,
})
const props = withDefaults(defineProps<RoleManagementProps>(), {})

provide<string>('urlPrefix', props.urlPrefix)
provide<AnyObj>('headers', props.headers || {})
provide('personProps', props.personProps)
provide('organizeProps', props.organizeProps)
provide('roleUserActions', props.roleUserActions)

const roleUserListRef = ref()

function setSelected(list: RoleListItem[]) {
  roleUserListRef.value.setSelectedRoles(list)
}
</script>
<style lang="scss" scoped>
:deep.role-management-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  min-width: 1000px;

  .role-list-wrapper {
    width: 32%;
    max-width: 400px;
    margin-right: 10px;
    background: #fff;
  }
  .role-user-list {
    flex: 1;
    width: 68%;
    background: #fff;
  }
}
</style>
