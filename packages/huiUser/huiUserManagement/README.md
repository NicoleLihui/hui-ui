# HuiUserManagement 组件

## 组件用途

> 用户管理组件的用户管理页，使用需对应后端用户管理模块通用接口
> 父组件需设置容器高度，组件根据父组件高度进行自适应

## 组件使用

### 组件参数说明

| 参数名        | 类型     | 是否必须 | 说明                                                                                                                                                                                                                                                                                                                         |
| ------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| urlPrefix     | String   | Y        | 调用 api 的前缀                                                                                                                                                                                                                                                                                                              |
| headers       | String   | N        | 调用 api 的 headers 参数                                                                                                                                                                                                                                                                                                     |
| organizeProps | Object   | Y        | 选组织组件的 api 合集对象, { huiOrganizeProps: (params: { type: string; includeDept: boolean }) => Promise<OrganizeType / false> }， 具体见[HuiOrganize 组织选择组件](../huiOrganize/README.md)                                                                                                                                 |
| detailMethod  | Function | N        | interface UserListItem { <br> createTime: string <br> name: string <br> orgName: string <br> pkOrg: string <br> positionName: string <br> roleCode: string <br> roleId: number <br> roleName: string <br> userCode: string <br> } <br> 用户管理列表中的详情按钮点击时调用的方法（如跳转到详情页）(row: UserListItem) => void |

### 组件使用案例

```js
<div style="height: 600px; background: #eee">
  <HuiUserManagement
    :url-prefix="http://10.10.20.13:19101/base"
    :organize-props="huiOrganizeProps"
    :detail-method="detailMethod"
    :headers="{ Authorization: 'Bearer xxxxxx'}"
  />
</div>

<script lang="ts" setup>
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
const detailMethod = (row: UserListItem) => {
  console.log('跳转到详情页', row)
}
</script>
```
