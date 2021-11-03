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
    <el-form label-position="right" :model="dataInfo" ref="formRef" center>
      <el-form-item
        prop="dnsId"
        label="提供商"
        :rules="[{ message: '请选择', required: true, trigger: 'change' }]"
      >
        <el-select
          style="width: 100%"
          v-model="dataInfo.dnsId"
          placeholder="Select"
        >
          <el-option
            v-for="item in dnsSelect"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="certbotId"
        label="机器人"
        :rules="[{ message: '请选择', required: true, trigger: 'change' }]"
      >
        <el-select
          style="width: 100%"
          v-model="dataInfo.certbotId"
          placeholder="Select"
        >
          <el-option
            v-for="item in certbotSelect"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="domain"
        label="域名"
        :rules="[{ message: '请输入', required: true, trigger: 'blur' }]"
      >
        <el-input v-model="dataInfo.domain"></el-input>
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
import { getCurrentInstance, onMounted, PropType, toRaw, toRef } from "vue";
import { DomainModel } from "/@/api/model/domain";
import { Result } from "/@/api/model/result";
import { domainStore } from "/@/store/modules/domain/domain";
import { errorMessage, warnMessage } from "/@/utils/message";
const instance = getCurrentInstance();
const props = defineProps({
  showDialog: {
    require: true,
    default: false,
    type: Boolean
  },
  isUpdate: {
    require: true,
    default: false,
    type: Boolean
  },
  dnsSelect: {
    require: true,
    default: [],
    type: []
  },
  certbotSelect: {
    require: true,
    default: [],
    type: []
  },
  modelInfo: Object as PropType<DomainModel>
});
const emit = defineEmits<{
  (e: "cancelDataScope"): void;
}>();
const showDialog = toRef(props, "showDialog");
const dataInfo = toRef(props, "modelInfo");
const isUpdate = toRef(props, "isUpdate");
const dnsSelect = toRef(props, "dnsSelect");
const certbotSelect = toRef(props, "certbotSelect");
const cancelDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.resetFields();
  emit("cancelDataScope");
};
const submitDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.validate(async valid => {
    if (valid) {
      const value = toRaw(dataInfo.value);
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
const saveOrUpdate = (data: DomainModel): Promise<Result<any>> => {
  if (isUpdate.value) {
    return domainStore().update(data, data.id);
  } else {
    return domainStore().save(data);
  }
};
onMounted(() => {});
</script>

<style scoped></style>
