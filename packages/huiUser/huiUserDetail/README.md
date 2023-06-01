# HuiUserDetail 组件

## 组件用途

> 用户管理组件的用户详情页，使用需对应后端用户管理模块通用接口
> 父组件需设置容器高度，组件根据父组件高度进行自适应

## 组件使用

### 组件参数说明

| 参数名        | 类型      | 是否必须 | 说明                                                                                                                                                                                         |
| ------------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| userCode      | String    | Y        | 当前展示用户的 userCode                                                                                                                                                                      |
| urlPrefix     | String    | Y        | 调用 api 的前缀                                                                                                                                                                              |
| headers       | Object    | N        | 调用 api 的 headers 参数 {[key: string]: any}                                                                                                                                                |
| organizeProps | Object    | Y        | 选组织组件的 api 合集对象, { huiOrganizeProps: (params: { type: string; includeDept: boolean }) => Promise<OrganizeType / false> }， 具体见[HuiOrganize 组织选择组件](../huiOrganize/README.md) |
| slot          | ElTabPane | N        | 详情页中与组织并列的 tab，用于展示当前系统下可授权的资产, 只可用 ElTabPane 组件                                                                                                              |

### 组件方法

| 方法名        | 说明                       | 参数                                                                                                                                                                                                                                                             |
| ------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onRoleChecked | 组件中角色选中时的数据回传 | interface RoleListItem{ <br> code: string <br> gmtCreate: string <br> gmtModified: string <br> id: number <br> intro: string <br> name: string <br> parentId: number <br> checked?: boolean <br> showDetail?: boolean <br> } <br> (data: RoleListItem[]) => void |

### 组件使用案例

```js
<div style="height: 600px; background: #eee; padding: 10px;">
  <HuiUserDetail
    url-prefix="http://10.10.20.13:19101/base"
    user-code="xxx"
    :headers="{ Authorization: 'Bearer xxxxxx'}"
    :organize-props="huiOrganizeProps"
    :person-props="huiPersonProps"
    @onRoleChecked="setRoles"
  >
    <template>
      <el-tab-pane label="项目" name="project">
        项目内容
        <el-button>操作</el-button>
        <el-button :disabled="!selectedRoles.length">授权</el-button>
      </el-tab-pane>
    </template>
  </HuiUserDetail>
</div>

<script lang="ts" setup>
const state = reactive({
  selectedRoles: [] as RoleListItem[],
})
const { selectedRoles } = toRefs(state)

const orgDeptTreeApi = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: '0001D210000000000FFW',
        name: 'XX公司（中国）投资有限公司',
        type: 2,
        children: [
          {
            id: '0001A4100000000NPKW0',
            parentId: '0001D210000000000FFW',
            name: 'XX公司城市资源集团有限公司（停）',
            type: 2,
            children: [],
          },
        ],
      })
    }, 500)
  })
}

const huiOrganizeProps = {
  orgDeptTreeApi,
}
const setRoles = (data: RoleListItem[]) => {
  selectedRoles.value = data
}
</script>
```
