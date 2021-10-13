<template>
  <el-row :gutter="20">
    <el-col :span="10" :offset="6">
      <el-form
        ref="userPasswordForm"
        :model="userPasswordInfo"
        required-asterisk
        label-position="top"
        :rules="passwordRules"
        center
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="userPasswordInfo.oldPassword" clearable></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码">
          <el-input
            type="password"
            v-model="userPasswordInfo.newPassword"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="newPassword2" label="确认密码">
          <el-input
            type="password"
            v-model="userPasswordInfo.newPassword2"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="settingsPassword"> 提交 </el-button>
          <el-button @click="reset" type="info"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { getCurrentInstance, reactive, toRaw } from "vue";
import { UpdatePasswordModel } from "/@/api/model/userModel";
import { tokenStoreHok } from "/@/store/modules/token";
import { userStore } from "/@/store/modules/user/user";
import { errorMessage, successMessage, warnMessage } from "/@/utils/message";
const instance = getCurrentInstance();
const userPasswordInfo: UpdatePasswordModel = reactive({
  oldPassword: "",
  newPassword: "",
  newPassword2: ""
});
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (value === userPasswordInfo.oldPassword) {
    callback(new Error("原密码与新密码一致"));
  } else {
    if (userPasswordInfo.newPassword2 !== "") {
      // @ts-expect-error
      instance.refs.userPasswordForm.validateField("newPassword2");
    }
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== userPasswordInfo.newPassword) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};
const passwordRules = reactive({
  oldPassword: [
    {
      required: true,
      message: "请输入原密码",
      trigger: "blur"
    }
  ],
  newPassword: [{ required: true, validator: validatePass, trigger: "blur" }],
  newPassword2: [{ required: true, validator: validatePass2, trigger: "blur" }]
});

const settingsPassword = (): void => {
  // @ts-expect-error
  instance.refs.userPasswordForm.validate(valid => {
    if (valid) {
      const password = toRaw<UpdatePasswordModel>(userPasswordInfo);
      const newPassword: UpdatePasswordModel = {};
      Object.assign(newPassword, password);
      userStore()
        .updatePassword(newPassword)
        .then(result => {
          if (result.code === 0) {
            successMessage("更新成功,稍后即将重新登录");
            setTimeout(() => {
              tokenStoreHok().logout();
            }, 3000);
          } else {
            errorMessage("更新失败:" + result.msg);
          }
        });
    } else {
      warnMessage("表单校验失败，请检查");
    }
  });
};
const reset = (): void => {
  // @ts-expect-error
  instance.refs.userPasswordForm.resetFields();
};
</script>
