<script setup lang="ts">
import { reactive, onBeforeMount } from "vue";
import info, { ContextProps } from "../components/ReInfo/index.vue";
import { getVerify } from "/@/api/user";
import { tokenStoreHok } from "../store/modules/token";

// 刷新验证码
const refreshGetVerify = async () => {
  let { svg } = await getVerify();
  contextInfo.svg = svg;
};

const contextInfo: ContextProps = reactive({
  userName: "",
  passWord: "",
  verify: null,
  svg: null
});

// const toPage = (info: Object): void => {
//   storageSession.setItem("info", info);
//   router.push("/");
// };

// 登录
const onLogin = async () => {
  // let { userName, passWord, verify } = contextInfo;
  // let { code, info, accessToken } = await getLogin({
  //   username: userName,
  //   password: passWord,
  //   verify: verify
  // });
  // code === 0
  //   ? successMessage(info) &&
  //     toPage({
  //       username: userName,
  //       accessToken
  //     })
  //   : warnMessage(info);
  let { userName, passWord } = contextInfo;
  await tokenStoreHok().login({
    username: userName,
    password: passWord
  });
};

const refreshVerify = (): void => {
  refreshGetVerify();
};

onBeforeMount(() => {
  // refreshGetVerify();
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
