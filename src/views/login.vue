<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { addClass, removeClass } from "/@/utils/operate";
import bg from "/@/assets/login/bg.png";
import avatar from "/@/assets/login/avatar.svg";
import illustration0 from "/@/assets/login/illustration0.svg";
import illustration1 from "/@/assets/login/illustration1.svg";
import illustration2 from "/@/assets/login/illustration2.svg";
import illustration3 from "/@/assets/login/illustration3.svg";
import illustration4 from "/@/assets/login/illustration4.svg";
import illustration5 from "/@/assets/login/illustration5.svg";
import illustration6 from "/@/assets/login/illustration6.svg";
import { tokenStoreHok } from "../store/modules/token";
// eslint-disable-next-line vue/return-in-computed-property
const currentWeek = computed(() => {
  switch (String(new Date().getDay())) {
    case "0":
      return illustration0;
    case "1":
      return illustration1;
    case "2":
      return illustration2;
    case "3":
      return illustration3;
    case "4":
      return illustration4;
    case "5":
      return illustration5;
    case "6":
      return illustration6;
    default:
      return illustration4;
  }
});
let user = ref("");
let pwd = ref("");
let remember = ref(false);
const onLogin = async () => {
  await tokenStoreHok().login({
    username: user.value,
    password: pwd.value,
    remember: remember.value
  });
};
function onUserFocus() {
  addClass(document.querySelector(".user"), "focus");
}
function onUserBlur() {
  if (user.value.length === 0)
    removeClass(document.querySelector(".user"), "focus");
}
function onPwdFocus() {
  addClass(document.querySelector(".pwd"), "focus");
}
function onPwdBlur() {
  if (pwd.value.length === 0)
    removeClass(document.querySelector(".pwd"), "focus");
}
window.addEventListener("keydown", async function (e: KeyboardEvent) {
  if (e.key === "Enter") {
    await onLogin();
  }
});
onBeforeMount(() => {
  // refreshGetVerify();
  const login = tokenStoreHok().getRemember();
  user.value = login.username;
  pwd.value = login.password;
  remember.value = login.remember;
});
</script>

<template>
  <img :src="bg" class="wave" />
  <div class="container">
    <div class="img">
      <component :is="currentWeek"></component>
    </div>
    <div class="login-box">
      <div class="login-form">
        <avatar class="avatar" />
        <h2
          v-motion
          :initial="{
            opacity: 0,
            y: 100
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 100
            }
          }"
        >
          Pure Admin
        </h2>
        <div
          class="input-group user focus"
          v-motion
          :initial="{
            opacity: 0,
            y: 100
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 200
            }
          }"
        >
          <div class="icon">
            <i class="fa fa-user"></i>
          </div>
          <div>
            <h5>用户名</h5>
            <input
              type="text"
              class="input"
              v-model="user"
              @focus="onUserFocus"
              @blur="onUserBlur"
            />
          </div>
        </div>
        <div
          class="input-group pwd focus"
          v-motion
          :initial="{
            opacity: 0,
            y: 100
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 300
            }
          }"
        >
          <div class="icon">
            <i class="fa fa-lock"></i>
          </div>
          <div>
            <h5>密码</h5>
            <input
              type="password"
              class="input"
              v-model="pwd"
              @focus="onPwdFocus"
              @blur="onPwdBlur"
            />
          </div>
        </div>
        <div>
          <el-checkbox v-model="remember" label="记住我"></el-checkbox>
        </div>
        <button
          class="btn"
          v-motion
          :initial="{
            opacity: 0,
            y: 10
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 400
            }
          }"
          @click="onLogin"
        >
          登录
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("/@/style/login.css");
</style>
