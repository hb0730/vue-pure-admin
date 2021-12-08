<template>
  <el-dialog
    title="DNS记录"
    :model-value="showDialog"
    width="500px"
    append-to-body
    center
    :before-close="cancelDataScope"
    :destroy-on-close="true"
  >
    <el-form
      label-position="right"
      label-width="auto"
      :model="dataInfo"
      ref="formRef"
      center
    >
      <div v-for="(item, index) in dnsRecords" :key="index">
        <el-form-item label="名称">
          <el-input v-model="item.key" disabled></el-input>
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="item.value" disabled></el-input>
        </el-form-item>
      </div>
      <el-form-item label="验证" style="width: 100%">
        <el-button
          style="width: 100%"
          :disabled="status != 0"
          :loading="dataInfo.dnsButtonLoading"
          @click="queryDnsRecord"
          type="primary"
          >验证</el-button
        >
      </el-form-item>
      <el-form-item label="下载">
        <el-button
          style="width: 100%"
          @click="downloadFile"
          :disabled="status != 1"
          >下载证书</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { toReactive } from "@vueuse/core";
import { getCurrentInstance, PropType, toRef } from "vue";
import { DNSCertRecordModel } from "/@/api/model/cert-records";
import { certRecordStoreHook } from "/@/store/modules/certs/record";
import { errorMessage, successMessage, warnMessage } from "/@/utils/message";
const store = certRecordStoreHook();
const instance = getCurrentInstance();
const props = defineProps({
  showDialog: {
    require: true,
    type: Boolean,
    defaut: false
  },
  certRecordId: {
    required: true,
    type: Number
  },
  status: {
    require: true,
    type: Number
  },
  dnsRecords: {
    required: true,
    type: Array as PropType<DNSCertRecordModel[]>,
    default: () => []
  }
});
const dnsRecords = toRef(props, "dnsRecords");
const status = toRef(props, "status");
const certRecordId = toRef(props, "certRecordId");
const dataInfo = toReactive({
  dnsButtonLoading: false
});
const emit = defineEmits<{
  (e: "cancelDataScope"): void;
}>();
const cancelDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.resetFields();
  emit("cancelDataScope");
};
const queryDnsRecord = async () => {
  if (certRecordId.value == 0) {
    warnMessage("id为空");
    return;
  }
  dataInfo.dnsButtonLoading = true;
  const result = await store.challengesDNS(certRecordId.value);
  dataInfo.dnsButtonLoading = false;
  if (result.code === 0) {
    status.value = 1;
    successMessage("验证成功,可以下载证书");
  } else {
    errorMessage(result.msg);
  }
};
const downloadFile = async () => {
  await store.downloadCert(certRecordId.value);
};
</script>

<style scoped></style>
