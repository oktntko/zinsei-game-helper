<script setup lang="ts">
import { prepareDatabase } from '~/db';

await prepareDatabase();
</script>

<template>
  <div class="min-h-dvh bg-gradient-to-b from-gray-400 to-white">
    <RouterView />
  </div>
</template>
