<template>
  <div></div>
</template>
<script lang="ts">
import { onBeforeMount } from "vue-demi";
import { onBeforeRouteUpdate } from "vue-router";

onBeforeRouteUpdate(to => {
  console.log(to, "=====");
});

onBeforeMount(() => {
  console.log("test");
});
</script>
