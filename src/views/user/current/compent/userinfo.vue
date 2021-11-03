<template>
  <el-row :gutter="20">
    <el-col :span="10" :offset="6">
      <el-form label-position="top" ref="formRef" :model="ruleForm" center>
        <el-form-item prop="username" label="账号">
          <el-input disabled v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item
          prop="nickName"
          :rules="[{ required: true, message: '请输入昵称' }]"
          label="昵称"
        >
          <el-input
            clearable
            v-model="ruleForm.nickName"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input
            clearable
            v-model="ruleForm.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="updateUser">
            更新
          </el-button>
          <el-button type="info" size="medium" @click="reset">重置 </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { UserInfoModel } from "/@/api/model/user";
import { getCurrentInstance, onMounted, reactive, toRaw } from "vue";
import { db } from "/@/utils/storage/db";
import { errorMessage, successMessage, warnMessage } from "/@/utils/message";
import { userStore } from "/@/store/modules/user/user";

const instance = getCurrentInstance();
const ruleForm: UserInfoModel = reactive<UserInfoModel>({
  id: 0,
  username: "",
  nickName: "",
  email: "",
  isAdmin: 0
});

const updateUser = (): void => {
  // @ts-expect-error
  instance.refs.formRef.validate(valid => {
    if (valid) {
      const user = toRaw<UserInfoModel>(ruleForm);
      userStore()
        .updateProfile(user)
        .then(result => {
          if (result.code === 0) {
            successMessage("更新成功,重新登录后更新");
          } else {
            errorMessage("更新失败:" + result.msg);
          }
        });
    } else {
      warnMessage("更新失败,请检查");
    }
  });
};
const reset = (): void => {
  // @ts-expect-error
  instance.refs.formRef.resetFields();
  getCurrentUserInfo();
};

const getCurrentUserInfo = (): void => {
  const user = JSON.parse(
    db.dbGet({ dbName: "sys", path: "userInfo", user: true })
  );
  ruleForm.id = user.id;
  ruleForm.username = user.username;
  ruleForm.nickName = user.nickName;
  ruleForm.email = user.email;
  ruleForm.isAdmin = user.isAdmin;
};
onMounted(() => {
  getCurrentUserInfo();
});
</script>
