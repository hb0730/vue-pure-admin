<template>
  <button
    type="button"
    class="el-button filter-item el-button--success el-button--mini"
    @click="addNewHandler"
  >
    <i class="fa fa-plus"></i> <span>新增</span>
  </button>
</template>
<script setup lang="ts">
import _ from "vue";
const emit = defineEmits<{
  (e: "addNewHandler"): void;
}>();
const addNewHandler = () => {
  emit("addNewHandler");
};
</script>
