import { Table } from '@packages/huiTable/types/type'
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

export type RoleUserActions = (Table.ButtonItem & { method: (row: any) => any })[]

export interface RoleListItem {
  code: string
  gmtCreate: string
  gmtModified: string
  id: number
  intro: string
  name: string
  parentId: number
  checked?: boolean
  showDetail?: boolean
}

export enum AuthType {
  Catalogue = 1,
  Menu = 2,
  Page = 3,
  Button = 4,
}

export interface AuthTreeItem {
  id: number
  name: string
  parentId: number
  permissionId: number
  ordering: number
  type: AuthType
  children?: AuthTreeItem[]
}

export interface PermissionListItem {
  code: string
  id: number
  intro: string
  name: string
  parentId: number
  type: AuthType
  verb: string
}
