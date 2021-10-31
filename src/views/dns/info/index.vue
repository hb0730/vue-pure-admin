<template>
  <el-dialog
    title="提供商信息"
    :model-value="showDialog"
    width="500px"
    append-to-body
    center
    :before-close="cancelDataScope"
    :destroy-on-close="true"
  >
    <el-form
      :rules="formRules"
      label-position="right"
      :model="modelInfo"
      ref="formRef"
      center
    >
      <el-form-item prop="alias" label="供应商">
        <el-select
          style="width: 100%"
          v-model="modelInfo.alias"
          placeholder="Select"
        >
          <el-option
            v-for="item in pageData.providers"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="accountId" label="DNS账号">
        <el-input v-model="modelInfo.accountId"></el-input>
      </el-form-item>
      <el-form-item prop="secret" label="DNS密钥">
        <el-input v-model="modelInfo.secret"></el-input>
      </el-form-item>
      <el-form-item prop="endpoint" label="DNS地址">
        <el-input v-model="modelInfo.endpoint"></el-input>
      </el-form-item>
      <el-form-item prop="region" label="DNS区域">
        <el-input v-model="modelInfo.region"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="DNS邮箱">
        <el-input v-model="modelInfo.email"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  toRef,
  PropType,
  getCurrentInstance,
  reactive,
  onBeforeMount,
  toRaw
} from "vue";
import { DNSModel } from "/@/api/model/dnsModel";
import { Result } from "/@/api/model/resultModel";
import { dnsStore } from "/@/store/modules/dns/dns";
import { errorMessage, warnMessage } from "/@/utils/message";

const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true,
    default: false
  },
  isUpdate: {
    type: Boolean,
    required: true,
    default: false
  },
  dataInfo: {
    type: Object as PropType<DNSModel>
  }
});
const formRules = reactive({
  alias: [{ required: true, message: "请选择", trigger: "change" }],
  accountId: [{ required: true, message: "请输入账号", trigger: "blur" }],
  secret: [{ required: true, message: "请输入密钥", trigger: "blur" }]
});
const showDialog = toRef(props, "showDialog");
const modelInfo = toRef(props, "dataInfo");
const isUpdate = toRef(props, "isUpdate");
const instance = getCurrentInstance();
const emit = defineEmits<{
  (e: "cancelDataScope"): void;
}>();

const cancelDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.resetFields();
  emit("cancelDataScope");
};

const submitDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.validate(async valid => {
    if (valid) {
      const value = toRaw(modelInfo.value);
      const result = await saveOrUpdate(value);
      if (result.code === 0) {
        cancelDataScope();
      } else {
        errorMessage(
          (isUpdate.value === true ? "修改" : "新增") + "失败:" + result.msg
        );
      }
    } else {
      warnMessage("表单校验失败，请检查");
    }
  });
};
const saveOrUpdate = (data: DNSModel): Promise<Result<any>> => {
  if (isUpdate.value) {
    return dnsStore().update(data, data.id);
  } else {
    return dnsStore().save(data);
  }
};
const pageData = reactive({
  providers: []
});
const getProviders = async () => {
  const result = await dnsStore().getProviders();
  if (result.code === 0) {
    pageData.providers = result.data;
  }
};
onBeforeMount(() => {
  getProviders();
});
</script>

<style scoped></style>
