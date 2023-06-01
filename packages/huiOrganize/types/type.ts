export declare namespace OrganizeTypes {
  interface OrganizeType {
    id: string
    name: string
    type: number
    parentId?: string
    $treeNodeId?: number
    children?: OrganizeType[]
  }

  type CheckOrganizeType = OrganizeType & {
    checked?: boolean
    childNodes?: CheckOrganizeType[]
  }

  type OrgDeptTreeApi = (params: { type: string; includeDept: boolean }) => Promise<OrganizeType | false>
}
