<script setup lang="ts">
const emit = defineEmits<{
  close: [number?];
}>();

const props = defineProps<{
  title: string;
  data: number;
  unit: string;
}>();

const modelValue = ref<{ data: number }>({ data: props.data });
</script>

<template>
  <div class="w-48 p-4">
    <form
      class="flex flex-col gap-6"
      autocomplete="off"
      @submit.prevent="emit('close', modelValue.data)"
    >
      <header class="text-lg font-bold capitalize">
        <label for="name" class="text-blue-600 dark:text-blue-500"> {{ title }} </label>
      </header>

      <section class="flex flex-col gap-4">
        <div class="flex items-center justify-center gap-2">
          <input
            id="name"
            v-model.number="modelValue.data"
            type="number"
            min="0"
            max="999"
            required
            class="block w-full grow rounded-lg border border-gray-300 bg-white p-2 text-right text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
          <span class="grow">{{ unit }}</span>
        </div>
      </section>

      <section class="flex justify-center gap-2">
        <button
          type="submit"
          class="inline-flex min-w-24 items-center justify-center gap-0.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          <span class="icon-[el--ok-sign] h-4 w-4"></span>
          ＯＫ
        </button>
      </section>
    </form>
  </div>
</template>
