<script lang="ts">
export default {
  name: "FaIcon"
};
</script>
<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const props = defineProps({
  icon: {
    type: String,
    default: ""
  }
});
</script>

<template>
  <font-awesome-icon :icon="props.icon" />
</template>
