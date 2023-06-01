# HuiRoleManagement 组件

## 组件用途

> 角色管理组件模块，使用需对应后端角色模块通用接口，父组件需设置容器高度，内部根据父组件高度进行自适应

## 组件使用

### 组件参数说明

| 参数名          | 类型   | 是否必须 | 说明                                                                                                                                                                                                                                                                                                                       |
| --------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| urlPrefix       | String | Y        | 调用 api 的前缀                                                                                                                                                                                                                                                                                                            |
| headers         | String | N        | 调用 api 的 headers 参数                                                                                                                                                                                                                                                                                                   |
| personProps     | Object | Y        | 选人组件的 api 合集对象, { departApi, organizApi, slurUserApi, departByOrgIdApi, mdmUserByDeptIdApi }, 具体见[HuiPerson 人员选择组件](../huiPerson/README.md)                                                                                                                                                                |
| organizeProps   | Object | Y        | 选组织组件的 api 合集对象, { huiOrganizeProps: (params: { type: string; includeDept: boolean }) => Promise<OrganizeType / false> }， 具体见[HuiOrganize 组织选择组件](../huiOrganize/README.md)                                                                                                                                                                                                                  |
| roleUserActions | Object | N        | 角色对应的用户列表的操作, <br> RoleUserActions: {&nbsp; <br> name: string &nbsp; <br> command: Command &nbsp; <br> type?: 'primary' &#124; 'success' &#124; 'warning' &#124; 'danger' &#124; 'info' &#124; ''&nbsp; <br> disabled?: boolean&nbsp; <br> children?: ButtonItem[]&nbsp; <br> method: (row: any) => any <br> } |

### 组件使用案例

```js
<div style="height: 700px; background: #eee; width: 100%; overflow: auto">
  <HuiRoleManagement
    :url-prefix="http://10.10.20.13:19101/base"
    :organize-props="huiOrganizeProps"
    :headers="{ Authorization: 'arer xxxxxx'}"
    :person-props="huiPersonProps"
    :organize-props="huiOrganizeProps"
    :role-user-actions="roleUserActions"
  />
</div>
```

<details>
<summary>点击展开</summary>

```js
<style lang="ts" setup>
const departApi = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        pkOrg: "0001D210000000000FFW",
        orgCode: null,
        pkDept: null,
        deptCode: null,
        name: null,
        orgName: "XX公司（中国）投资有限公司",
        type: "公司",
        orgTree: null,
        children: [{
          pkDept: "1001A410000000DIQQXF",
          pkFatherorg: "0001D210000000000FFW",
          deptCode: "29",
          name: "产品中心",
          pkOrg: "0001D210000000000FFW",
          type: "部门",
          children: []
        }]
      });
    }, 300)
  });
}
const organizApi = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
          pkOrg: "0001D210000000000FFW",
          orgCode: "000001",
          pkDept: "0001D210000000000FFW",
          deptCode: null,
          name: "XX公司（中国）投资有限公司",
          orgName: "XX公司（中国）投资有限公司",
          type: "公司",
          orgTree: null,
          children: [{
            pkDept: "1001A410000000DIQQXF",
            pkFatherorg: "0001D210000000000FFW",
            deptCode: "29",
            name: "产品中心",
            pkOrg: "0001D210000000000FFW",
            type: "部门",
            children: []
          }]
        });
    }, 300)
  });
}
const slurUserApi = (params: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (params.lastPage === 3) {
        resolve([])
      } else {
        resolve([{
          userId: "0001N6100000000EKEF8",
          userCode: "wanghaofei",
          userName: "王浩菲",
          job: "化验操作员",
          organization: "绵阳中科成污水净化有限公司",
          department: "运行部",
        }]);
      }
    }, 300)
  });
}
const departByOrgIdApi = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        pkOrg: null,
        orgCode: null,
        pkDept: null,
        deptCode: null,
        name: null,
        orgName: null,
        type: null,
        orgTree: null,
        children: [{
          pkDept: "1001N61000000001MARF",
          pkFatherorg: "0001N6100000000041MA",
          deptCode: "D003577",
          name: "建设管理中心",
          pkOrg: "0001N6100000000041MA",
          type: "部门",
        }]
      });
    }, 300)
  });
}
const mdmUserByDeptIdApi = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          userId: "0001N6100000000JSNA4",
          userCode: "wangpeng01",
          userName: "王鹏",
          deptName: "造价管理部",
          job: null,
        },
        {
          userId: "0001N61000000002P8DS",
          userCode: "zhaomengmeng",
          userName: "赵萌萌",
          deptName: "造价管理部",
          job: null,
        }
      ]);
    }, 300)
  });
}
const huiPersonProps = {
  departApi,
  organizApi,
  slurUserApi,
  departByOrgIdApi,
  mdmUserByDeptIdApi
}

const orgDeptTreeApi = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: "0001D210000000000FFW",
        name: "XX公司（中国）投资有限公司",
        type: 2,
        children: [{
          id: "0001A4100000000NPKW0",
          parentId: "0001D210000000000FFW",
          name: "XX公司城市资源集团有限公司（停）",
          type: 2,
          children: []
        }]
      })
    }, 500)
  })
}

const huiOrganizeProps = {
  orgDeptTreeApi
}
const roleUserActions = [{
  name: '项目',
  command: 'addProject',
  type: 'primary',
  method: (row: any) => {
    console.log('currRow', row)
  }
}]
</style>
```

</details>
