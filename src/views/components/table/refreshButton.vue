<template>
  <el-button
    size="small"
    title="刷新"
    circle
    :icon="findIconReg('FA-sync')"
    @click="refreshHandler"
  ></el-button>
</template>
<script setup lang="ts">
import { findIconReg } from "/@/components/ReIcon";
const emit = defineEmits<{
  (e: "refreshHandler"): void;
}>();
const refreshHandler = () => {
  emit("refreshHandler");
};
</script>
