<script lang="ts" setup>
// Define props
defineProps<{
  message: string;
}>();
</script>

<template>
  <div class="message">
    <span>{{ message }}</span>
  </div>
</template>

<style scoped>
.message {
  margin-bottom: 5px;
}
</style>
