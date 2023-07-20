<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="h-full flex flex-col justify-between">
    <div class="flex flex-col">
      <header class="flex flex-row justify-center">
        <img alt="The Confessional" class="logo w-64 p-8" src="@/assets/logo_white.png" />
      </header>

      <RouterView />
    </div>

    <nav class="flex flex-row justify-center text-white gap-4 p-4">
      <RouterLink to="/" class="hover:text-purple-400">Home</RouterLink>
      <RouterLink to="/about" class="hover:text-purple-400">About</RouterLink>
    </nav>
  </div>
</template>
