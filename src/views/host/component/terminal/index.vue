<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <Console :hostId="pageData.hostId"></Console>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <Files :hostId="pageData.hostId"></Files>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, reactive } from "vue";
import { useRoute } from "vue-router";
import Console from "/@/views/host/component/terminal/console.vue";
import Files from "/@/views/host/component/files/index.vue";
const pageData = reactive({
  hostId: 1
});
onBeforeMount(() => {
  const Route = useRoute();
  pageData.hostId = parseInt(Route.query.id as string);
});
onBeforeMount(() => {});
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
