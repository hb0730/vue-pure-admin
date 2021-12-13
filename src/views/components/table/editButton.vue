<template>
  <el-button
    type="primary"
    size="mini"
    :icon="findIconReg('FA-edit')"
    @click="editHandler"
    >修改</el-button
  >
</template>
<script setup lang="ts">
import { findIconReg } from "/@/components/ReIcon";
const emit = defineEmits<{
  (e: "editHandler"): void;
}>();
const editHandler = () => {
  emit("editHandler");
};
</script>
