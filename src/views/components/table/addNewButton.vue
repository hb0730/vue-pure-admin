<template>
  <el-button
    type="success"
    size="mini"
    @click="addNewHandler"
    :icon="findIconReg('FA-plus')"
    >新增</el-button
  >
</template>
<script setup lang="ts">
import { findIconReg } from "/@/components/ReIcon";
const emit = defineEmits<{
  (e: "addNewHandler"): void;
}>();
const addNewHandler = () => {
  emit("addNewHandler");
};
</script>
