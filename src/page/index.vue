<script setup lang="ts">
const route = useRoute('/');
</script>

<template>
  <div class="flex flex-row">
    {{ route.path }}
    <span class="icon-[material-symbols--home]" style="width: 24px; height: 24px"></span>
  </div>
</template>
