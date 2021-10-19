<template>
  <button
    type="button"
    class="el-button filter-item el-button--primary el-button--mini"
    @click="editHandler"
  >
    <i class="fa fa-edit">
      <span>修改</span>
    </i>
  </button>
</template>
<script setup lang="ts">
import _ from "vue";
const emit = defineEmits<{
  (e: "editHandler"): void;
}>();
const editHandler = () => {
  emit("editHandler");
};
</script>
