<template>
  <el-dialog class="auth-dialog" title="授权角色" width="700px" v-model="visible">
    <ul class="role-list">
      <li v-for="item in roleList" :key="item.id">
        <el-tooltip :content="item.intro" :disabled="!item.intro">
          <el-radio name="role" :label="item.id" v-model="roleId">{{ item.name }}</el-radio>
        </el-tooltip>
      </li>
    </ul>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" :disabled="!roleId" @click="doSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { RoleListItem } from '@packages/huiRoleManagement/types/type'
import useUser from '@packages/huiUser/hooks/useUser'
import { PropType } from 'vue'

const roleList = inject('roleList') as RoleListItem[]

const props = defineProps({
  selectedUsers: {
    type: Array as PropType<string[]>,
    default: [],
  },
})

const visible = ref(false)
const roleId = ref<number>()

defineExpose({
  open: () => {
    visible.value = true
    roleId.value = undefined
  },
})
const emit = defineEmits(['onSuccess', 'onCancel'])

const { bindRoleUsers } = useUser()

const cancel = () => {
  visible.value = false
  emit('onCancel')
}

const doSubmit = () => {
  bindRoleUsers({
    roleId: roleId.value!,
    userCodes: props.selectedUsers,
  }).then(() => {
    visible.value = false
    emit('onSuccess')
  })
}
</script>
<style lang="scss" scoped>
:deep.el-dialog__header {
  .el-dialog__title {
    color: #666;
  }
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
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
</style>
