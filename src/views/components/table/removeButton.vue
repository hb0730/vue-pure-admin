<template>
  <el-button
    type="danger"
    size="mini"
    :icon="findIconReg('FA-trash-alt')"
    @click="removeHandler"
    >修改</el-button
  >
</template>
<script setup lang="ts">
import { findIconReg } from "/@/components/ReIcon";
const emit = defineEmits<{
  (e: "removeHandler"): void;
}>();
const removeHandler = () => {
  emit("removeHandler");
};
</script>
