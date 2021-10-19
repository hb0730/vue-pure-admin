<template>
  <button
    type="button"
    class="el-button filter-item el-button--danger el-button--mini"
    @click="removeHandler"
  >
    <i class="fa fa-remove">
      <span>删除</span>
    </i>
  </button>
</template>
<script setup lang="ts">
import _ from "vue";
const emit = defineEmits<{
  (e: "removeHandler"): void;
}>();
const removeHandler = () => {
  emit("removeHandler");
};
</script>
