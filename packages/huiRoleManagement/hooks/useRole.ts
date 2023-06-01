import { ElMessage } from 'element-plus'
import useApi, { PageResult } from '@/hooks/useApi'
import { AuthTreeItem, PermissionListItem, RoleListItem } from '../types/type'

export default function useRole() {
  const urlPrefix = (inject('urlPrefix') as string) || ''
  const headers = (inject('headers') as AnyObj) || ''
  const request = useApi(urlPrefix, headers)

  const roleListData = reactive({
    list: [] as RoleListItem[],
    loading: false,
    currPage: 1,
    pageSize: 10,
    total: 0,
  })

  const getRoleList = (params: { roleName?: string }) => {
    roleListData.loading = true
    return request
      .post<PageResult<RoleListItem>>('/role/queryAll', {
        ...params,
        currPage: roleListData.currPage,
        pageSize: roleListData.pageSize,
      })
      .then(res => {
        roleListData.list = res.data.records.map(i => ({
          ...i,
          checked: false,
          showDetail: false,
        }))
        roleListData.currPage = res.data.current
        roleListData.total = res.data.total
        roleListData.loading = false
      })
      .catch(() => {
        roleListData.loading = false
      })
  }

  const getRoleById = (roleId: number) => {
    return request.get<RoleListItem>('/role/info', { roleId })
  }

  const permissionList = reactive({
    data: [] as PermissionListItem[],
  })
  const getRolePermission = (roleId: number) => {
    return request.get<PermissionListItem[]>('/role/permission', { roleId }).then(res => {
      if (res.success) {
        permissionList.data = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  const deleteRoleById = (roleId: number) => {
    return request.delete(`/HUI/rbac/role/delete/${roleId}`).then(() => {
      ElMessage.success('删除成功')
    })
  }

  const batchDeleteRole = (roleIds: number[]) => {
    return request.delete(`/role/batchDelete`, { roleIds: roleIds.join(',') }).then(res => {
      ElMessage.success('删除成功')
    })
  }

  const authTreeData = reactive({
    treeList: [] as AuthTreeItem[],
  })

  const getAuthTree = () => {
    if (authTreeData.treeList.length) {
      return Promise.resolve(authTreeData.treeList)
    }
    return request.get<AuthTreeItem[]>('/role/fetchAllFuncAuth').then(res => {
      if (res.success) {
        authTreeData.treeList = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  const addRole = (params: {
    id?: number
    intro: string
    permissionIds: number[]
    roleCode: string
    roleName: string
  }) => {
    return request.post(params.id ? '/role/update' : 'role/add', params).then(res => {
      ElMessage.success(`${params.id ? '编辑' : '新增'}成功`)
      return res
    })
  }

  return {
    getRoleList,
    roleListData,
    deleteRoleById,
    batchDeleteRole,
    addRole,
    getAuthTree,
    authTreeData,
    getRolePermission,
    permissionList,
  }
}
