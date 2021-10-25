<template>
  <div class="app-container">
    <div>
      <Console :hostId="pageData.hostId"></Console>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, reactive } from "vue";
import Console from "/@/views/host/component/terminal/console.vue";
const pageData = reactive({
  hostId: 1
});
onBeforeMount(() => {
  console.log("terminal test");
});
</script>
