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
        <el-form-item label="原密码" required prop="oldPassword">
          <el-input v-model="userPasswordInfo.oldPassword" clearable></el-input>
        </el-form-item>
        <el-form-item required prop="newPassword" label="新密码">
          <el-input
            type="password"
            v-model="userPasswordInfo.newPassword"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item required prop="newPassword2" label="确认密码">
          <el-input
            type="password"
            v-model="userPasswordInfo.newPassword2"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePassword"> 提交 </el-button>
          <el-button @click="reset" type="info"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script lang="ts">
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value == this.userPasswordInfo.oldPassword) {
        callback(new Error("原密码与新密码一致"));
      } else {
        if (this.userPasswordInfo.newPassword2 !== "") {
          this.$refs.userPasswordForm.validateField("newPassword2");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userPasswordInfo.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userPasswordInfo: {
        oldPassword: "",
        newPassword: "",
        newPassword2: ""
      },
      passwordRules: {
        oldPassword: [
          {
            required: true,
            message: "请输入原密码",
            trigger: "blur"
          }
        ],
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        newPassword2: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    initData() {
      this.userPasswordInfo = {
        oldPassword: "",
        newPassword: "",
        newPassword2: ""
      };
    },
    updatePassword() {},
    reset() {
      this.initData();
    }
  }
};
</script>
