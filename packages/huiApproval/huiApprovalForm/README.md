# HuiApprovalForm 组件

## 组件用途

> 通过在流程审批页面引入流程表单组件，处理流程。

## 组件使用

### 组件参数说明

| 参数名             | 类型          | 是否必须 | 说明                                                                                                                                                                                                                                                                                            |
| ------------------ | ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| approvalData       | Object        | Y        | 由流程引擎获取表单信息接口返回的与审批表单相关的信息，可以渲染 Form-Making 表单生成器的表单，也可以用后端返回的字段信息渲染对应的表单字段，接口也会返回对应的流程处理按钮的信息，类似于：{actionType: '', approvalFormFields: {}, formActionList: [], approvalFormValues: null, formList: null} |
| processId          | String        | Y        | 流程实例 ID，例如：a92149f4-96ed-11ed-97bc-0242ac130002                                                                                                                                                                                                                                         |
| userId             | String/Number | Y        | 当前登录人的用户 ID，示例“0001N6100000000JSNA4”                                                                                                                                                                                                                                                 |
| departApi          | (params: { userId: string / number }) => Promise<OrganizeType / false>  | Y        | 获取本公司组织接口（使用人员选择组件时必传，具体见 HuiPerson 人员选择组件）                                                                                                                                                                                                                      |
| organizApi         | (params: { userId: string / number }) => Promise<OrganizeType / false>      | Y        | 获取本公司及以下组织接口（使用人员选择组件时必传，具体见 HuiPerson 人员选择组件）                                                                                                                                                                                                                |
| slurUserApi        | (params: { currPage: number; userName: string }) => Promise<UserType[] / false>      | Y        | 根据关键字搜索人名接口（使用人员选择组件时必传，具体见 HuiPerson 人员选择组件）                                                                                                                                                                                                                  |
| departByOrgIdApi   | (params: { orgId: any }) => Promise<OrganizeType / false>      | Y        | 根据公司获取部门信息（使用人员选择组件时必传，具体见 HuiPerson 人员选择组件）                                                                                                                                                                                                                    |
| mdmUserByDeptIdApi | (params: { deptId: any }) => Promise<UserType[] / false>      | Y        | 根据部门获取人员信息（使用人员选择组件时必传，具体见 HuiPerson 人员选择组件）                                                                                                                                                                                                                    |

### 组件方法

| 方法名      | 说明                                                                                     | 参数                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| submit      | 监听组件的流程处理按钮事件                                                               | { actionInfo: {}, data: {}, fileList: [] }，分别为当前处理流程点击的按钮信息，提交表单数据，上传文件列表（fileList 字段），需要先提交到业务系统自己的文件管理后台后将成功上传后返回的文件信息以“approvalAttachment”的键名，作为提交的表单数据的一项传给流程平台，这个文件会在流程历史组件中以具名作用域插槽（#file）的形式回显，回显时预览或下载文件也是业务系统在插槽中自己处理之前传入的数据，流程只做数据透传不做文件保存和下载 |
| getNodeList | 组件在处理驳回时，如果驳回策略为“驳回至指定节点”，需要异步获取当前流程走过的历史节点列表 | { callback }，异步获取节点后调用 callback 并将返回值作为其参数，组件会拿到这个参数，展示选择节点的弹窗，弹窗中用到了节点数据（见示例）                                                                                                                                                                                                                                                                                             |

### 组件插槽

| 名称          | 说明                                                                                                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| customContent | 插至表单最前部分的自定义内容，参数为 { componentName, dataModel, isFormEditable }（componentName：配置在流程节点上的组件名称，需要在插槽内动态渲染；dataModel：回显的插槽内表单已填入信息；isFormEditable：插槽内容是否可编辑） |

### 补充

组件使用了 mitt 进行组件通信，引入组件前，需要在项目中安装并使用 mitt

1. 安装

```
npm install --save mitt
```

2. 以“$bus”命名，引入到项目并挂载

```js
import mitt from 'mitt'
const $bus = mitt()
createApp(App).config.globalProperties.$bus = $bus
```

### 使用案例

#### 基本用法

```vue
<template>
  <HuiApprovalForm
    :approvalData="approvalData"
    :processInstanceId="processInstanceId"
    @onsubmit="onSubmit"
    @getNodeList="onGetNodeList"
    :userId="userId"
    :departApi="departApi"
    :organizApi="organizApi"
    :slurUserApi="slurUserApi"
    :departByOrgIdApi="departByOrgIdApi"
    :mdmUserByDeptIdApi="mdmUserByDeptIdApi"
  >
    <template slot-scope="props" slot="customContent">
      <component
        ref="component"
        v-if="props.componentName"
        :dataModel="props.dataModel"
        :isFormEditable="props.isFormEditable"
        :is="initComponent(props.componentName)"
      ></component>
    </template>
  </HuiApprovalForm>
</template>
<script lang="ts" setup>
import {
  nodeList,
  approvalData,
  departApi,
  organizApi,
  departByOrgIdApi,
  slurUserApi,
  mdmUserByDeptIdApi,
} from './data.js'
const userId = '0001N6100000000JSNA4'
const processInstanceId = 'a92149f4-96ed-11ed-97bc-0242ac130002'
const initComponent = function (name: string): any {
  try {
    return this.getComp(name)
  } catch (err) {
    return require(`./components/noFormConfig.vue`).default
  }
}
const getComp = function (name: string): any {
  // 这里的路径只能使用相对路径，应当把所有流程相关的自定义表单组件都放在项目的某一路径下，按照组件名动态引入组件
  return require(`./components/${name}.vue`).default
}
const onGetNodeList = function (callback: Function): void {
  // 这里模拟异步请求获取已经处理过的流程节点信息
  setTimeout(() => {
    callback(this.nodeList)
  }, 100)
}
const onSubmit = function (data: any): void {
  console.log(data)
}
</script>
```

#### 组件数据样例

<details>
  <summary>点击展开</summary>

```js
// 测试组件数据，使用时与组件同一个目录下引入一个数据文件命名data.js
import axios from 'axios'
const baseURL = 'http://10.10.20.3:18000' // 这里以投资系统的接口为例
const header = {
  Authorization:
    'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyLXJlc291cmNlIl0sInVzZXJfbmFtZSI6IndhbmdmZWkwMTIiLCJzY29wZSI6WyJhbGwiXSwicm9sZXMiOltdLCJleHAiOjE2Nzc0ODk0OTgsInJlc291cmNlX2lkcyI6WyJvYXV0aDItcmVzb3VyY2UiXSwidXNlcklkIjoid2FuZ2ZlaTAxMiIsImp0aSI6ImMzNTlmODZiLThmNGMtNDNlMi05NjUzLTc5NjU4YzJiYmY0NSIsImNsaWVudF9pZCI6ImJld2dfaW52ZXN0bWVudF9hcHBsaWNhdGlvbiIsInVzZXJuYW1lIjoid2FuZ2ZlaTAxMiJ9.Vox840Udaao2W0qNrabxd19SweJ2YI7a2MZot0fLfLLvJZ6tBVCF5Pgia0pgN9X8MyTjhG6hp8w75-DNOT5d1mpzhVaSIC4ITWnBwaB2mt3fguc4AelwpK966cE9fc7loAIpbKI4uZjPPt0xQcV8TpHccUg9OEHWrrwg7A8lSE3Bo9hM-vUx5DmH6DdGzbrs_jpEuRldVlSxZSbtMWqfRF8gGh4DOsR1bOTLAyqxzZgemX6FWGVq2sfIF-Bi9lpPXnt-j6QHnt0nDigjZuFYGYhPxHKm9VU7ofkEZ0T5HYlVhPi5uQU6C1i5mYnVxz7exPAw9VSi7rHKDwcRi1mMqw',
}
const nodeList = [
  {
    nodeId: 'sid-08EF7396-B34C-47CF-9125-605823DBB5B0',
    nodeName: '项目判重 申请',
  },
  {
    nodeId: 'sid-08EF7396-B34C-47CF-9125-605823DBB5C1',
    nodeName: '大区审批',
  },
]
const approvalData = {
  actionType: 'approval',
  approvalFormFields: {
    approvalRemark: {
      name: 'approvalRemark',
      id: 6,
      label: '备注',
      $$hashKey: 'object:6853',
      enabled: false,
      required: false,
    },
    keepFollow: {
      name: 'keepFollow',
      id: 2,
      label: '是否继续跟进',
      $$hashKey: 'object:6849',
      enabled: false,
      required: false,
    },
    keepFollowCause: {
      name: 'keepFollowCause',
      id: 3,
      label: '原因说明',
      $$hashKey: 'object:6850',
      enabled: false,
      required: false,
    },
    replyMessage: {
      name: 'replyMessage',
      id: 5,
      label: '答复客户建议',
      $$hashKey: 'object:6852',
      enabled: false,
      required: false,
    },
    approvalAttachment: {
      name: 'approvalAttachment',
      id: 9,
      label: '审批附件',
      $$hashKey: 'object:6856',
      enabled: true,
      required: false,
    },
    approvalMessage: {
      name: 'approvalMessage',
      id: 8,
      label: '审批意见',
      $$hashKey: 'object:6855',
      enabled: true,
      required: true,
    },
    ccUserList: {
      name: 'ccUserList',
      id: 1,
      label: '抄送',
      $$hashKey: 'object:6848',
      enabled: true,
      required: false,
    },
    pmUserList: {
      name: 'pmUserList',
      id: 4,
      label: '选择投资项目经理',
      $$hashKey: 'object:6851',
      enabled: false,
      required: false,
    },
    projectJudgeResult: {
      name: 'projectJudgeResult',
      id: 7,
      label: '项目审批结果',
      $$hashKey: 'object:6854',
      enabled: false,
      required: false,
    },
  },
  approvalFormValues: null,
  formList: null,
  formActionList: [
    {
      category: 'Approval',
      flag: null,
      code: 'TG',
      name: '通过',
      api: '/api/v1/zflow/task/0702fce1-fb59-11ec-b9b2-0242ac130002/approval',
    },
    {
      code: 'BH',
      backStrategy: [
        {
          BACK_ASSIGN: '退回至指定节点',
        },
      ],
      api: '/api/v1/zflow/task/0702fce1-fb59-11ec-b9b2-0242ac130002/back',
      flag: 'abnormal',
      category: 'Approval',
      confirmTips: '确认驳回曹长征申请的项目级别/计划变更流程？',
      name: '驳回',
    },
    {
      code: 'ZZ',
      api: '/api/v1/zflow/task/0702fce1-fb59-11ec-b9b2-0242ac130002/stop-processInstance',
      flag: 'abnormal',
      category: 'Approval',
      name: '不同意',
      confirmTips: '点击【确定】流程立即终止！',
    },
  ],
}

const departApi = function (params) {
  return axios({
    method: 'GET',
    url: '/core/dept/depart',
    baseURL: baseURL,
    params: params,
  })
}

const organizApi = function (params) {
  return axios({
    method: 'GET',
    url: '/core/dept/org',
    baseURL: baseURL,
    params: params,
    headers: header,
  })
}

const departByOrgIdApi = function (params) {
  return axios({
    method: 'GET',
    url: '/core/dept/departbyorgId',
    baseURL: baseURL,
    params: params,
    headers: header,
  })
}

const slurUserApi = function (params) {
  return axios({
    method: 'GET',
    url: '/core/dept/sluruser',
    baseURL: baseURL,
    params: params,
    headers: header,
  })
}

const mdmUserByDeptIdApi = function (params) {
  return axios({
    method: 'GET',
    url: '/core/dept/mdmuserbydeptId',
    baseURL: baseURL,
    params: params,
    headers: header,
  })
}

export { nodeList, approvalData, departApi, organizApi, departByOrgIdApi, slurUserApi, mdmUserByDeptIdApi }
```

</details>

#### 自定义表单示例，注意其中有一些约定写法

<details>
  <summary>点击展开</summary>

```js
<template>
  <div>
    <el-form
      ref="editableForm"
      :model="formInfo"
      :rules="rules"
      label-position="right"
      :disabled="!isFormEditable"
      label-width="150px"
    >
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formInfo.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formInfo.name" placeholder="请填写姓名"> </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script name="component-example"></script>

<script lang="ts" setup>
import $bus from '../../utils/bus'
interface FormData {
  [propName: string]: any
}
const editableForm = ref()
const props = defineProps({
  dataModel: {
    type: Object as PropType<FormData>,
    default: () => {},
  },
  // 流程配置：加签人是否可以修改表单内容，默认为true
  isFormEditable: {
    type: Boolean,
    default: true,
  }
})
let formInfo:FormData = reactive({})
watch(
  () => props.dataModel,
  (val: any) => {
    formInfo = val || {}
  },
  { deep: true, immediate: true } // 深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大。
)
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
}
const listen = function() {
  // 用于触发表单校验, 有些按钮操作比如转办，前、后加签不需要校验，这时候就不用触发校验方法
  $bus.on('validFormValue', noNeedValid => {
    if (!noNeedValid) {
      editableForm.validate(valid => {
        $bus.emit('validFormResult', valid)
      })
    }
  })
  // 用于获取表单值
  $bus.on('getFormValue', () => {
    // 对表单值进行处理, 一般是提交什么, dataModel中返回什么
    $bus.emit('postFormResult', this.formInfo)
  })
}
onMounted(() => {
  listen()
})
onBeforeUnmount(() => {
  $bus.off('validFormValue')
  $bus.off('getFormValue')
})
</script>
```

</details>
