<template>
  <el-dialog
    title="证书机器人"
    :model-value="showDialog"
    width="500px"
    append-to-body
    center
    :before-close="cancelDataScope"
    :destroy-on-close="true"
  >
    <el-form label-position="right" :model="dataInfo" ref="formRef" center>
      <el-form-item
        prop="name"
        label="机器人名称"
        :rules="[{ message: '请输入', required: true, trigger: 'blur' }]"
      >
        <el-input v-model="dataInfo.name"></el-input>
      </el-form-item>
      <el-form-item
        prop="email"
        label="机器人邮箱"
        :rules="[{ message: '请输入', required: true, trigger: 'blur' }]"
      >
        <el-input v-model="dataInfo.email"></el-input>
      </el-form-item>
      <el-form-item
        prop="directoryUrl"
        label="申请地址"
        :rules="[{ message: '请输入', required: true, trigger: 'blur' }]"
      >
        <el-input v-model="dataInfo.directoryUrl"></el-input>
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
import { CAManagerModel } from "/@/api/model/ca-manager";
import { Result } from "/@/api/model/result";
import { caManagerStore } from "/@/store/modules/ca-manager";
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
  modelInfo: Object as PropType<CAManagerModel>
});
const emit = defineEmits<{
  (e: "cancelDataScope"): void;
}>();
const showDialog = toRef(props, "showDialog");
const dataInfo = toRef(props, "modelInfo");
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
const saveOrUpdate = (data: CAManagerModel): Promise<Result<any>> => {
  if (isUpdate.value) {
    return caManagerStore().update(data, data.id);
  } else {
    return caManagerStore().save(data);
  }
};
onMounted(() => {});
</script>

<style scoped></style>
