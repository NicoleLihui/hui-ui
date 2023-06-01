<template>
  <span
    class="itemBlock paddingTop2"
    v-if="approvalFormValueJson.ccUserList && approvalFormValueJson.ccUserList.length > 0"
  >
    <span class="itemInlineBlock cc">抄送：</span>
    <p class="itemInlineBlock">
      <span v-for="x in approvalFormValueJson.ccUserList" :key="x.userId" class="itemBlock">
        {{ positionAndName(x) }}
        <i :class="x.pushRead == 0 ? 'blue' : 'green'"> &nbsp;({{ x.pushRead == 0 ? '待阅' : '已阅' }}) </i>
      </span>
    </p>
  </span>
  <span class="itemBlock paddingTop2" v-if="approvalFormValueJson.keepFollow">
    是否继续跟进：{{ approvalFormValueJson.keepFollow == '0' ? '否' : '是' }}
  </span>
  <span class="itemBlock paddingTop2" v-if="approvalFormValueJson.keepFollowCause">
    原因说明：{{ approvalFormValueJson.keepFollowCause || '--' }}
  </span>
  <span
    class="itemBlock paddingTop2"
    v-if="approvalFormValueJson.pmUserList && approvalFormValueJson.pmUserList.length > 0"
  >
    <span class="itemInlineBlock cc">投资项目经理：</span>
    <p class="itemInlineBlock">
      <span v-for="x in approvalFormValueJson.pmUserList" :key="x.userId" class="itemBlock">
        {{ positionAndName(x) }}
      </span>
    </p>
  </span>
  <span class="itemBlock paddingTop2" v-if="approvalFormValueJson.replyMessage">
    答复客户建议：{{ approvalFormValueJson.replyMessage || '--' }}
  </span>
  <span class="itemBlock paddingTop2" v-if="approvalFormValueJson.approvalRemark">
    备注：{{ approvalFormValueJson.approvalRemark || '--' }}
  </span>
  <span class="itemBlock paddingTop2" v-if="approvalFormValueJson.approvalMessage">
    审批意见：{{ approvalFormValueJson.approvalMessage || '--' }}
  </span>
  <span
    class="itemBlock paddingTop2"
    v-if="approvalFormValueJson.approvalAttachment && approvalFormValueJson.approvalAttachment.length > 0"
  >
    <span class="itemInlineBlock cc">附件：</span>
    <p class="itemInlineBlock item-right" v-for="fileItem in approvalFormValueJson.approvalAttachment">
      <slot name="fileList" v-bind="fileItem"></slot>
    </p>
  </span>
</template>

<script lang="ts" setup>
import { positionAndName } from '../utils/index'
defineProps({
  approvalFormValueJson: {
    type: Object,
    default: () => {},
  },
})
</script>

<style lang="scss" scoped>
.cc {
  vertical-align: top;
}
.paddingTop2 {
  padding-top: 2px;
}
.itemBlock {
  display: block;
  line-height: 22px;
  &:nth-child(1) {
    padding-top: 0;
  }
  .green {
    color: #28ba75;
  }
  .blue {
    color: #1775ff;
  }
  i {
    font-style: normal;
  }
}
.itemInlineBlock {
  display: inline-block;
  :deep .file-list {
    margin-top: 0;
  }
}
.item-right {
  width: 90%;
}
</style>
