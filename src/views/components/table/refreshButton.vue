<template>
  <button
    type="button"
    class="el-button el-tooltip el-button--default el-button--small is-circle"
    aria-describedby="el-tooltip-2497"
    tabindex="0"
    title="刷新"
    @click="refreshHandler"
  >
    <i class="el-icon-refresh"></i>
  </button>
</template>
<script setup lang="ts">
import _ from "vue";
const emit = defineEmits<{
  (e: "refreshHandler"): void;
}>();
const refreshHandler = () => {
  emit("refreshHandler");
};
</script>
