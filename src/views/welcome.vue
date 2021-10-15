<script setup lang="ts">
import { ref, shallowRef, onBeforeMount } from "vue";
import { useAppStoreHook } from "/@/store/modules/app";
import {
  ReGithub,
  ReInfinite,
  RePie,
  ReLine,
  ReBar
} from "/@/components/ReCharts/index";
import Logo from "../layout/components/sidebar/logo.vue";

let loading = ref<boolean>(true);
const componentList = shallowRef([]);

setTimeout(() => {
  loading.value = !loading.value;
}, 500);
onBeforeMount(() => {
  if (useAppStoreHook().device === "mobile") {
    componentList.value = [
      {
        width: "20em",
        title: "GitHub饼图信息",
        component: RePie
      },
      {
        width: "20em",
        title: "GitHub折线图信息",
        component: ReLine
      },
      {
        width: "20em",
        title: "GitHub柱状图信息",
        component: ReBar
      }
    ];
  } else {
    componentList.value = [
      {
        width: "43em",
        title: "GitHub信息",
        component: ReGithub
      },
      {
        width: "43em",
        title: "GitHub滚动信息",
        component: ReInfinite
      },
      {
        width: "28.28em",
        title: "GitHub饼图信息",
        component: RePie
      },
      {
        width: "28.28em",
        title: "GitHub折线图信息",
        component: ReLine
      },
      {
        width: "28.28em",
        title: "GitHub柱状图信息",
        component: ReBar
      }
    ];
  }
});
</script>

<template>
  <div class="welcome">
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <div class="pure-logo">
          <Logo></Logo>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style module scoped>
.size {
  height: 335px;
}
</style>

<style lang="scss" scoped>
.welcome {
  width: 100%;
  height: 100%;

  .pure-logo {
    margin-top: 20%;
  }
}
</style>
