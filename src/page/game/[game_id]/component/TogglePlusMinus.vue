<script setup lang="ts">
const isPlus = defineModel<boolean>({ required: false, default: true });
</script>

<template>
  <label class="relative inline-flex h-8 w-[60px] cursor-pointer gap-1 p-1 text-white">
    <span class="icon-[typcn--minus] z-10 h-6 w-6"> </span>
    <span class="icon-[typcn--plus] z-10 h-6 w-6"> </span>
    <input v-model="isPlus" type="checkbox" class="hidden" />
    <div
      class="absolute inset-0 h-full w-full rounded-3xl transition-colors"
      :class="[
        'before:absolute before:top-1 before:z-20 before:block before:h-6 before:w-6 before:rounded-full before:shadow-lg before:transition-all',
        isPlus
          ? 'bg-blue-500 shadow-[0_0_2px_2px_rgba(37,99,235,0.25)]'
          : 'bg-red-500 shadow-[0_0_2px_2px_rgba(220,38,38,0.25)]',
        isPlus ? 'before:left-1 before:bg-blue-100' : 'before:left-8 before:bg-red-100',
      ]"
    ></div>
  </label>
</template>
