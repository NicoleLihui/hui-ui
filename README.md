# hui-ui

[[_TOC_]]

## hui-ui 概述

hui-ui 是一款前端组件库，基于 Vue3.x + Vite + typeScript 开发，利用[storybook](https://storybook.js.org/docs/vue/get-started/introduction)作为协助开发工具。

## 开发说明

### 组件开发目录

所有的组件，都放在`packages`目录下，而且每个组件都要放在一个单独的目录中。而且每个组件目录必须包含以下几个文件。

- `index.js|ts`：用于暴露组件
- `README.md`：用于描述组件的功能以及使用说明等信息
- `xxx.stories.js|ts`：用于测试组件的 story 文件

### 组件开发建议

- 充分利用 `storybook` 提供的功能，边写组件，边写 story 进行测试。
- 写完组件的 `README.md` 以后，记得在根目录下的 README.md 文件中加上到该组件说明的链接
- 组件必须声明 `name`，这个 `name` 就是组件的标签
- 请确保你的 `Node.js` 版本 >= 16.x。

## 组件说明

> 每个可用的组件，都可以在这里找到
> 组件以`hui`开头

### [HuiLoading 组件](packages/huiLoading/README.md)

### [HuiApprovalForm 组件](packages/huiApproval/huiApprovalForm/README.md)

### [HuiApprovalHistory 组件](packages/huiApproval/huiApprovalHistory/README.md)

### [HuiApprovalImage 组件](packages/huiApproval/huiApprovalImage/README.md)

### [HuiOrganize 组件](packages/huiOrganize/README.md)

### [HuiPerson 组件](packages/huiPerson/README.md)

### [HuiTable 组件](packages/huiTable/README.md)

### [HuiPager 组件](packages/huiPager/README.md)

### [HuiFiles 组件](packages/huiFiles/README.md)

### [HuiUpload 组件](packages/huiUpload/README.md)

### [HuiInput 组件](packages/huiInput/README.md)

### [HuiTextarea 组件](packages/huiTextarea/README.md)

### [HuiPreview 组件](packages/huiPreview/README.md)

### [HuiCapacityPager 组件](packages/huiCapacityPager/README.md)

### [HuiDescription 组件](packages/huiDescription/README.md)

### [HuiDictionary 组件](packages/huiDictionary/README.md)

### [HuiProTable 组件](packages/huiProTable/README.md)

### [HuiRoleManagement 组件](packages/huiRoleManagement/README.md)

### [HuiUploadSlice 组件](packages/huiUploadSlice/README.md)

### [HuiUserDetail 组件](packages/huiUser/huiUserDetail/README.md)

### [HuiUserManagement 组件](packages/huiUser/huiUserManagement/README.md)

### [HuiOnlinePreview 工具](packages/huiOnlinePreview/README.md)

### [HuiRequest 工具](packages/huiRequest/README.md)
