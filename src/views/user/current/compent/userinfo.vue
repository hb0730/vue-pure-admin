<template>
  <el-row :gutter="20">
    <el-col :span="10" :offset="6">
      <el-form label-position="top" ref="data" :model="data" center>
        <el-form-item prop="username" label="账号">
          <el-input disabled v-model="data.username"></el-input>
        </el-form-item>
        <el-form-item
          prop="nickName"
          :rules="[{ required: true, message: '请输入昵称' }]"
          label="昵称"
        >
          <el-input
            clearable
            v-model="data.nickName"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="emial" label="邮箱">
          <el-input
            clearable
            v-model="data.emial"
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

<script lang="ts">
import { db } from "/@/utils/storage/db";

export default {
  data() {
    return {
      data: {
        id: "",
        username: "admin",
        nickName: "",
        emial: ""
      }
    };
  },
  mounted() {
    this.getCurrentUserInfo();
  },
  methods: {
    /**
     * 更新用户
     */
    updateUser() {},
    /**
     * 重置
     */
    reset() {
      this.getCurrentUserInfo();
    },
    getCurrentUserInfo() {
      const result = db.dbGet({ dbName: "sys", path: "userInfo", user: true });
      if (result) {
        this.data = JSON.parse(result);
      }
    }
  }
};
</script>
