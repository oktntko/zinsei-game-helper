<script setup lang="ts">
import { prepareDatabase } from '~/db';

await prepareDatabase();
</script>

<template>
  <div class="min-h-lvh bg-linear-to-b from-gray-200 to-gray-100">
    <RouterView />
  </div>
</template>
