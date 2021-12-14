<template>
  <el-dialog
    title="定时任务详情"
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
      <el-form-item
        label="名称"
        :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
      >
        <el-input v-model="dataInfo.name"></el-input>
      </el-form-item>
      <el-form-item
        label="主机"
        :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
      >
        <el-select
          style="width: 100%"
          v-model="dataInfo.hostId"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in hosts"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="子域"
        :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
      >
        <el-select
          style="width: 100%"
          v-model="dataInfo.subDomainId"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in subDomains"
            :key="item.id"
            :label="item.domainList"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="监控域名"
        :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
      >
        <el-input
          v-model="dataInfo.domain"
          clearable
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="远程地址"
        :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
      >
        <el-input
          v-model="dataInfo.remoteAddr"
          type="textarea"
          clearable
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="执行脚本">
        <el-input
          v-model="dataInfo.script"
          type="textarea"
          clearable
          placeholder="替换后执行脚本"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="表达式"
        :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
      >
        <el-input
          v-model="dataInfo.cron"
          clearable
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="启用">
        <el-select
          style="width: 100%"
          v-model="dataInfo.enabled"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in enableds"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
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
import { getCurrentInstance, toRef, PropType, unref } from "vue";
import { HostModel } from "/@/api/model/host";
import { DomainJobModel, Enabled } from "/@/api/model/job";
import { Result } from "/@/api/model/result";
import { SubDomainModel } from "/@/api/model/sub-domain";
import { domainJobStore } from "/@/store/modules/job/domain-job";
import { errorMessage, warnMessage } from "/@/utils/message";

const instance = getCurrentInstance();
const props = defineProps({
  showDialog: {
    required: true,
    default: false,
    type: Boolean
  },
  isUpdate: {
    require: true,
    default: false,
    type: Boolean
  },
  modelInfo: Object as PropType<DomainJobModel>,
  subDomains: Array as PropType<SubDomainModel[]>,
  hosts: Array as PropType<HostModel[]>,
  enableds: Array as PropType<Enabled[]>
});
const emit = defineEmits<{
  (e: "cancelDataScope"): void;
}>();
const showDialog = toRef(props, "showDialog");
const dataInfo = toRef(props, "modelInfo");
const subDomains = toRef(props, "subDomains");
const hosts = toRef(props, "hosts");
const enableds = toRef(props, "enableds");
const isUpdate = toRef(props, "isUpdate");
const cancelDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.resetFields();
  emit("cancelDataScope");
};
const submitDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.validate(async valid => {
    if (valid) {
      const value = unref(dataInfo);
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
const saveOrUpdate = (data: DomainJobModel): Promise<Result<any>> => {
  if (isUpdate.value) {
    return domainJobStore().updateById(data, data.id);
  } else {
    return domainJobStore().save(data);
  }
};
</script>

<style scoped></style>
