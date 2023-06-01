import { RoleListItem } from '@packages/huiRoleManagement/types/type'
import { PersonTypes } from '@packages/huiPerson/types/type'
import { OrganizeTypes } from '@packages/huiOrganize/types/type'
export interface PersonProps {
  departApi: PersonTypes.DepartApi
  organizApi: PersonTypes.OrganizApi
  slurUserApi: PersonTypes.SlurUserApi
  departByOrgIdApi: PersonTypes.DepartByOrgIdApi
  mdmUserByDeptIdApi: PersonTypes.MdmUserByDeptIdApi
}

export interface OrganizeProps {
  huiOrganizeProps: OrganizeTypes.OrgDeptTreeApi
}
export type DetailMethod = (row: UserDetail) => void

export interface UserManagementProps {
  organizeProps: OrganizeProps
  detailMethod: DetailMethod
  urlPrefix: string
}

export enum UserStates {
  All = '0',
  Normal = 'Y',
  Disabled = 'N',
}

export interface OptionItem {
  label: string
  value: string | number
  [key: string]: any
}

export interface UserDetail {
  avatar: string
  deptCode: string
  deptName: string
  email: string
  gender: string
  mobile: string
  name: string
  orgAreaName: string
  orgCode: string
  orgName: string
  permissionCodes: (number | string)[]
  pkDept: string
  pkOrg: string
  positionCode: string
  positionName: string
  roles: RoleListItem[]
  status: UserStates
  userCode: string
}

export interface GetRoleUserParams {
  fuzzy?: string
  pkOrgList?: string[]
  roles?: number[]
  status?: string
}

export interface UserListItem {
  createTime: string
  name: string
  orgName: string
  pkOrg: string
  positionName: string
  roleCode: string
  roleId: number
  roleName: string
  userCode: string
}

export interface GetUserOrgParams {
  fuzzyOrgName?: string
  roleIds: number[]
  userCode: string
}

export interface UserOrgsItem {
  assetType: number
  createTime: string
  id: number
  orgName: string
  orgType: number
  pkOrg: string
  roleCode: string
  roleId: number
  roleName: string
  userCode: string
}

export interface AuthUserOrgParams {
  orgList: string[]
  roleId: number
  userCodes: string[]
}

export interface SyncOrgsParams {
  autoRefreshOrgType: 0 | 1
  roleIds: number[]
  userCode: string
}
