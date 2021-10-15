<template>
  <el-dialog
    title="用户信息"
    :model-value="showDialog"
    width="500px"
    append-to-body
    center
    :before-close="cancelDataScope"
    :destroy-on-close="true"
  >
    <el-form :model="modelInfo" ref="formRef" center>
      <el-form-item
        :rules="[{ required: true, message: '请输入账号' }]"
        prop="username"
        label="账号"
      >
        <el-input
          clearable
          :disabled="isUpdate"
          v-model="modelInfo.username"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item
        :rules="[{ required: true, message: '请输入昵称' }]"
        prop="nickName"
        label="昵称"
      >
        <el-input
          clearable
          v-model="modelInfo.nickName"
          placeholder="请输入昵称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input
          clearable
          v-model="modelInfo.email"
          placeholder="请输入邮箱"
        ></el-input>
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
import { toRef, PropType, getCurrentInstance, toRaw } from "vue";
import { userInfoModel } from "../index.vue";
import { Result } from "/@/api/model/resultModel";
import { UserInfoModel } from "/@/api/model/userModel";
import { userStore } from "/@/store/modules/user/user";
import { errorMessage, warnMessage } from "/@/utils/message";
const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true
  },
  isUpdate: {
    type: Boolean,
    require: true
  },
  dataInfo: {
    type: Object as PropType<userInfoModel>
  }
});
const emit = defineEmits<{
  (e: "closeDialog", evt: Object): void;
  (e: "refreshVerify"): void;
}>();
const instance = getCurrentInstance();
const showDialog = toRef(props, "showDialog");
const modelInfo = toRef(props, "dataInfo");
const isUpdate = toRef(props, "isUpdate");

const submitDataScope = (): void => {
  // @ts-expect-error
  instance.refs.formRef.validate(valid => {
    if (valid) {
      const value = toRaw(modelInfo.value);
      save(value, isUpdate.value).then(result => {
        if (result.code === 0) {
          cancelDataScope();
        } else {
          errorMessage(
            (isUpdate.value === true ? "修改" : "新增") + "失败:" + result.msg
          );
        }
      });
    } else {
      warnMessage("表单校验失败，请检查");
    }
  });
};
const save = (data: UserInfoModel, isUpdate: boolean): Promise<Result<any>> => {
  if (isUpdate) {
    return userStore().updateProfile(data);
  } else {
    return userStore().save(data);
  }
};
const cancelDataScope = (): void => {
  // @ts-expect-error
  instance.refs.formRef.resetFields();
  emit("closeDialog", false);
};
</script>
