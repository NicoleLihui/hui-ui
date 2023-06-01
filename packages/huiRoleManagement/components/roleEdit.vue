<template>
  <el-dialog
    class="hui-role-edit-dialog"
    width="60%"
    :title="(roleInfo.id ? '编辑' : '新增') + '角色'"
    v-model="visible"
  >
    <h3>角色信息</h3>
    <el-form ref="roleFormRef" class="role-form" :model="roleInfo" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input placeholder="请输入角色名称" v-model="roleInfo.roleName" />
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode">
        <el-input placeholder="请输入角色编码" v-model="roleInfo.roleCode" />
      </el-form-item>
      <el-form-item label="角色描述" prop="intro">
        <el-input placeholder="请输入角色描述" v-model="roleInfo.intro" />
      </el-form-item>
    </el-form>
    <h3>功能授权</h3>
    <el-tree
      ref="authTreeRef"
      class="auth-tree"
      :data="authTreeData.treeList"
      node-key="permissionId"
      show-checkbox
      :props="treeProps"
      default-expand-all
    />
    <!-- :check-strictly="true" -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import useRole from '../hooks/useRole'
import { RoleListItem } from '../types/type'

const treeProps = {
  children: 'children',
  label: 'name',
  class: (data: any, node: Node) => {
    return node.childNodes.length ? 'is-box' : 'is-leaf'
  },
}

const rules = {
  roleName: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入角色名称',
    },
  ],
  roleCode: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入角色编码',
    },
  ],
}

const visible = ref(false)
const authTreeRef = ref()
const roleFormRef = ref()

const state = reactive({
  roleInfo: {
    roleName: '',
    roleCode: '',
    intro: '',
    id: 0,
  },
})

const { roleInfo } = toRefs(state)

const { addRole, getAuthTree, authTreeData, getRolePermission, permissionList } = useRole()

getAuthTree()

watch(
  () => permissionList.data,
  val => {
    const ids = val.map(i => i.id)
    authTreeRef.value?.setCheckedKeys(ids)
  }
)

const open = (info?: RoleListItem) => {
  visible.value = true
  roleInfo.value = {
    id: info?.id || 0,
    roleName: info?.name || '',
    roleCode: info?.code || '',
    intro: info?.intro || '',
  }
  nextTick(() => {
    roleFormRef.value.clearValidate()
  })
  if (info) {
    getRolePermission(info.id)
  } else {
    permissionList.data = []
  }
}
defineExpose({
  open,
})

const emits = defineEmits(['onSubmit'])

const onSubmit = () => {
  roleFormRef.value.validate((valid: boolean) => {
    if (valid) {
      addRole({
        ...roleInfo.value,
        id: roleInfo.value.id || undefined,
        permissionIds: authTreeRef.value.getCheckedKeys(),
      }).then(() => {
        visible.value = false
        emits('onSubmit')
      })
    } else {
      ElMessage.warning('有未填项或填写有误，请检查。')
    }
  })
}
</script>
<style scoped lang="scss">
:deep.auth-tree {
  .el-tree-node.is-box {
    width: 100%;
    & > .el-tree-node__children {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
    }
  }
}
</style>
