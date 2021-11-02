<script setup lang="ts">
import { infoType } from "./type";
import { reactive, onBeforeMount } from "vue";
import info, { ContextProps } from "../components/ReInfo/index.vue";
import { getVerify } from "/@/api/user";
import { tokenStoreHok } from "../store/modules/token";

// 刷新验证码
const refreshGetVerify = async () => {
  let { svg }: infoType = await getVerify();
  contextInfo.svg = svg;
};

const contextInfo: ContextProps = reactive({
  userName: "",
  passWord: "",
  remember: false,
  verify: null,
  svg: null
});

// 登录
const onLogin = async () => {
  let { userName, passWord, remember } = contextInfo;
  await tokenStoreHok().login({
    username: userName,
    password: passWord,
    remember: remember
  });
};

const refreshVerify = (): void => {
  refreshGetVerify();
};

onBeforeMount(() => {
  // refreshGetVerify();
  const login = tokenStoreHok().getRemember();
  contextInfo.userName = login.username;
  contextInfo.passWord = login.password;
  contextInfo.remember = login.remember;
});
</script>

<template>
  <div class="login">
    <info
      :ruleForm="contextInfo"
      @on-behavior="onLogin"
      @refreshVerify="refreshVerify"
    />
  </div>
</template>
