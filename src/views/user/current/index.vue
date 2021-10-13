<script setup lang="ts">
import Userinfo from "./compent/userinfo.vue";
import Password from "./compent/password.vue";

const activeName = "userInfo";
</script>
<template>
  <div class="app-container">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="用户设置" name="userInfo">
        <Userinfo></Userinfo>
      </el-tab-pane>
      <el-tab-pane label="密码设置" name="passwrod">
        <Password></Password>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
