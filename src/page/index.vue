<script setup lang="ts">
const route = useRoute('/');
</script>

<template>
  <div class="flex flex-row">{{ route.path }}</div>
</template>
