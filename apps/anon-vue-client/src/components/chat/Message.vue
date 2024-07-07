<script lang="ts" setup>
// Define props
defineProps<{
	message: string;
}>();
</script>

<template>
  <div class="message">
    <div class="box"></div>
    <span>{{ message }}</span>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  gap: 3px;
  align-items: center;
  margin-bottom: 5px;

  span {
    color: lime;
  }
}

.box {
  background-color: teal;
  --size: 16px;
  width: var(--size);
  height: var(--size);
}
</style>
