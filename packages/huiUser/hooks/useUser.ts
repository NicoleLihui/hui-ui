import useApi, { PageResult } from '@/hooks/useApi'
import {
  AuthUserOrgParams,
  GetRoleUserParams,
  GetUserOrgParams,
  SyncOrgsParams,
  UserDetail,
  UserListItem,
  UserOrgsItem,
  UserStates,
} from '../types/type'
import { RoleListItem } from '@packages/huiRoleManagement/types/type'
import { ElMessage } from 'element-plus'

export default function useUser(prefix?: string, apiHeaders?: AnyObj) {
  const urlPrefix = prefix || (inject('urlPrefix') as string) || ''
  const headers = apiHeaders || (inject('headers') as AnyObj) || {}
  const request = useApi(urlPrefix, headers)

  const getUserDetail = (userCode: string) => {
    return request.get<UserDetail>('/user/detail', { userCode })
  }

  const roleUserData = reactive({
    currPage: 1,
    pageSize: 10,
    total: 0,
    list: [] as UserListItem[],
    loading: false,
  })
  const getRoleUser = (params: GetRoleUserParams) => {
    roleUserData.loading = true
    return request
      .post<PageResult<UserListItem>>('/user/search/bound', {
        currPage: roleUserData.currPage,
        pageSize: roleUserData.pageSize,
        ...params,
      })
      .then(res => {
        roleUserData.loading = false
        roleUserData.total = res.data.total
        roleUserData.list = res.data.records
      })
      .catch(err => {
        roleUserData.loading = false
        throw err
      })
  }

  const userData = reactive({
    currPage: 1,
    pageSize: 20,
    total: 0,
    loading: false,
    list: [] as UserDetail[],
  })
  const searchUser = (params: GetRoleUserParams) => {
    userData.loading = true
    return request
      .post<PageResult<UserDetail>>('/user/search/fuzzy', {
        currPage: userData.currPage,
        pageSize: userData.pageSize,
        ...params,
      })
      .then(res => {
        userData.loading = false
        userData.total = res.data.total
        userData.list = res.data.records
      })
      .catch(err => {
        userData.loading = false
        throw err
      })
  }

  const fetchAllRoles = () => {
    return request.get<RoleListItem[]>('/role/fetchAll')
  }

  const changeUserState = (params: { status: UserStates; userCode: string }) => {
    return request.post('/user/status', params).then(() => {
      ElMessage.success(`${params.status === UserStates.Disabled ? '停用' : '启用'}成功！`)
    })
  }
  const getAllUserState = () => {
    return request.get('/user/statuses')
  }

  const deleteOrgAuth = (params: { userCode: string; ids: number[] }) => {
    return request
      .delete(`/auth/orgs/delete/${params.userCode}`, {
        ...params,
        ids: params.ids.join(','),
      })
      .then(res => {
        ElMessage.success('删除成功')
        return res
      })
  }

  const userAuthOrgsData = reactive({
    currPage: 1,
    pageSize: 20,
    total: 0,
    list: [] as UserOrgsItem[],
    loading: false,
  })
  const getUserAuthOrg = (params: GetUserOrgParams) => {
    userAuthOrgsData.loading = true
    return request
      .post<PageResult<UserOrgsItem>>('/auth/orgs/query', {
        currPage: userAuthOrgsData.currPage,
        pageSize: userAuthOrgsData.pageSize,
        ...params,
      })
      .then(res => {
        userAuthOrgsData.loading = false
        userAuthOrgsData.list = res.data.records
        userAuthOrgsData.total = res.data.total
      })
      .catch(err => {
        userAuthOrgsData.loading = false
        throw err
      })
  }

  const getUserAllOrgs = (params: { userCode: string; roleId: number }) => {
    return request.get(`/auth/orgs/user/${params.userCode}`, {
      roleId: params.roleId,
    })
  }

  const saveUserAuthOrg = (params: AuthUserOrgParams) => {
    return request.post('/auth/orgs/save', params).then(res => {
      ElMessage.success('授权成功')
      return res
    })
  }

  // 保存指定角色的多个用户
  const bindRoleUsers = (params: { roleId: number; userCodes: string[] }) => {
    return request.post('/auth/roles/save', params).then(res => {
      ElMessage.success('绑定成功')
      return res
    })
  }

  // 批量解绑指定角色的用户
  const unbindRoleUsers = (params: { roleId: number; userCodes: string[] }) => {
    return request
      .delete(`/auth/roles/unbind/${params.roleId}`, {
        userCodes: params.userCodes.join(','),
      })
      .then(() => {
        ElMessage.success('解绑成功')
      })
  }

  // 获取用户已被授权的角色
  const getUserRoles = (userCode: string) => {
    return request.get<RoleListItem[]>('/auth/roles/authorized', { userCode })
  }

  const syncOrgs = (params: SyncOrgsParams) => {
    return request.put('/auth/roles/autoRefreshOrg', params)
  }

  const transferAssets = (params: { userCode: string; targetUserCode: string }) => {
    return request
      .post(
        `/auth/asset/transfer/${params.userCode}`,
        {
          targetUserCode: params.targetUserCode,
        },
        {
          headers: {
            'content-type': 'x-www-form-urlencoded',
          },
        }
      )
      .then(() => {
        ElMessage.success('转让成功')
      })
  }

  const getSyncStatus = (params: { userCode: string; roleIds: number[] }) => {
    return request.get(`/auth/roles/autoRefreshOrg/${params.userCode}`, {
      roleIds: params.roleIds.join(','),
    })
  }

  return {
    // 角色相关
    getRoleUser,
    roleUserData,
    bindRoleUsers,
    unbindRoleUsers,
    saveUserAuthOrg,
    // 用户管理
    searchUser,
    userData,
    fetchAllRoles,
    getUserDetail,
    getUserRoles,
    changeUserState,
    // 组织相关
    userAuthOrgsData,
    getUserAllOrgs,
    getUserAuthOrg,
    deleteOrgAuth,
    syncOrgs,
    getSyncStatus,
    transferAssets,
  }
}
