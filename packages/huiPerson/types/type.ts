export declare namespace PersonTypes {
  type NullString = string | null
  type TypeName = '部门' | '公司' | '子公司'
  interface OrganizeType {
    pkOrg: NullString
    name: NullString
    type: TypeName
    pkDept?: NullString
    orgCode?: NullString
    deptCode?: NullString
    orgName?: NullString
    orgTree?: NullString
    pkFatherorg?: string
    children?: OrganizeType[]
  }
  type OrganizeTempKey = OrganizeType & { tempKey?: string }
  interface UserType {
    userId: string
    userCode: string
    userName: string
    code?: NullString
    organization?: NullString
    deptName?: string
    job?: string
    mobile?: NullString
  }
  type UserTempKey = UserType & { tempKey?: string }
  type DepartApi = (params: { userId: string | number }) => Promise<OrganizeType | false>
  type OrganizApi = (params: { userId: string | number }) => Promise<OrganizeType | false>
  type SlurUserApi = (params: { currPage: number; userName: string }) => Promise<UserType[] | false>
  type DepartByOrgIdApi = (params: { orgId: any }) => Promise<OrganizeType | false>
  type MdmUserByDeptIdApi = (params: { deptId: any }) => Promise<UserType[] | false>
}
