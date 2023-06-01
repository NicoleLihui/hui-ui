<template>
  <div class="user-manage-wrapper" v-loading="userData.loading">
    <el-form class="search-form" inline ref="searchFormRef" :model="searchForm">
      <el-form-item label="用户" prop="fuzzy">
        <el-input placeholder="请输入用户名/手机号/登录账号" v-model="searchForm.fuzzy" />
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-select
          multiple
          collapse-tags
          collapse-tags-tooltip
          clearable
          placeholder="请选择"
          v-model="searchForm.roles"
        >
          <el-option v-for="option in options" :key="option.value" :value="option.value" :label="option.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="searchForm.status">
          <el-option v-for="option in stateOptions" :key="option.value" :value="option.value" :label="option.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属公司" prop="pkOrgList">
        <el-input placeholder="请选择" @focus="selectOrg" :value="searchForm.pkOrgList.map(i => i.name).join(',')" />
      </el-form-item>
      <div class="btn-group">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
      </div>
    </el-form>
    <user-table :data="userData" @onRefresh="resetForm" />
    <HuiPager
      v-model:current-page="userData.currPage"
      v-model:page-size="userData.pageSize"
      :total="userData.total"
      :list="userData.list"
      layout="sizes, prev, pager, next"
      @callback="getList"
    />
    <HuiOrganize v-bind="orgArgs" v-model="orgVisible" @closed="onOrgClose" @getCheckedData="onOrgChecked" />
  </div>
</template>
<script lang="ts" setup>
import { UserStates, OptionItem, OrganizeProps, DetailMethod } from '../types/type'
import UserTable from './components/userTable.vue'
import HuiPager from '@packages/huiPager/index.vue'
import HuiOrganize from '@packages/huiOrganize/index.vue'
import { STATE_MAP } from '../utils/constant'
import useUser from '../hooks/useUser'
defineOptions({
  name: 'HuiUserManagement',
  inheritAttrs: false,
})
const props = withDefaults(
  defineProps<{
    organizeProps: OrganizeProps
    detailMethod: DetailMethod
    urlPrefix: string
    headers: AnyObj
  }>(),
  {}
)

provide<string>('urlPrefix', props.urlPrefix)
provide<AnyObj>('headers', props.headers || {})
provide<OrganizeProps>('organizeProps', props.organizeProps)
provide('detailMethod', props.detailMethod)

const stateOptions = computed(() => {
  return Object.entries(STATE_MAP).map(([key, value]) => ({
    label: value,
    value: key,
  }))
})

const orgVisible = ref(false)
const searchFormRef = ref()

const { userData, searchUser, fetchAllRoles } = useUser(props.urlPrefix, props.headers || {})

const state = reactive({
  searchForm: {
    fuzzy: '',
    pkOrgList: [] as any[],
    roles: [],
    status: UserStates.All,
  },
  options: [] as OptionItem[],
  orgArgs: {
    title: '所属公司',
    multiple: true,
    checkedKeysData: [] as any[],
    ...props.organizeProps,
  },
})

const { searchForm, options, orgArgs } = toRefs(state)

provide('roleList', options)

fetchAllRoles().then((res: any) => {
  options.value = res.data.map((i: any) => ({
    ...i,
    label: i.name,
    value: i.id,
  }))
})

const getList = () => {
  return searchUser({
    ...searchForm.value,
    pkOrgList: searchForm.value.pkOrgList.map(i => i.id),
  })
}

onMounted(() => {
  getList()
})

const resetForm = () => {
  searchFormRef.value!.resetFields()
  getList()
}

const selectOrg = () => {
  orgVisible.value = true
}

const onOrgClose = () => {
  orgVisible.value = false
}

const onOrgChecked = (val: any[]) => {
  state.orgArgs.checkedKeysData = val
  searchForm.value.pkOrgList = val
}
</script>
<style lang="scss" scoped>
.user-manage-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 760px;
  padding: 10px;

  .search-form {
    margin-bottom: 10px;
    padding: 20px 20px 0;
    height: 120px;
    background: #fff;
    position: relative;

    .btn-group {
      position: absolute;
      right: 20px;
      bottom: 18px;
    }
  }

  .table-wrapper {
    height: calc(100% - 176px);
    padding: 10px 20px;
    background: #fff;
  }

  .pages {
    width: 100%;
    background: #fff;
    padding: 10px 20px;
    margin: 0;
  }
}
</style>
