<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Navigation from "./components/Navigation.vue";
</script>

<template>
  <div class="h-screen">
    <Navigation />
    <RouterView />
  </div>
</template>
