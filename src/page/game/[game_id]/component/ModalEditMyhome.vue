<script setup lang="ts">
import { housings } from '~/const';
import type { players } from '~/db/schema';

const emit = defineEmits<{
  close: [typeof players.$inferSelect.myhome?];
}>();

const { image = housings[0], value = 0 } = defineProps<{ image: string; value: number }>();

const modelValue = ref({
  image,
  value,
});
</script>

<template>
  <div class="p-4 sm:w-96">
    <form
      class="flex flex-col gap-6"
      autocomplete="off"
      @submit.prevent="emit('close', modelValue)"
    >
      <header class="text-lg font-bold capitalize">
        <label for="name" class="text-blue-600 dark:text-blue-500"> マイホーム </label>
      </header>

      <section class="flex flex-col gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-white">
            すきな イラスト をおしえてね
          </label>

          <div class="flex flex-wrap gap-3">
            <div v-for="housing of housings" :key="housing" class="relative">
              <label
                class="inline-flex h-12 w-12 cursor-pointer items-center justify-center gap-1 rounded-full text-lg font-medium transition-transform"
                :class="[
                  modelValue.image === housing
                    ? `scale-125 shadow-[0_0_4px_2px_rgba(0,0,255,0.6)]`
                    : 'scale-90 shadow-[0_0_4px_1px_rgba(0,0,0,0.25)]',
                ]"
              >
                <input
                  v-model="modelValue.image"
                  type="radio"
                  :value="housing"
                  required
                  class="sr-only"
                />
                <img :src="housing" height="48" width="48" alt="housing" />
              </label>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-white">
            マイホームは いくら？
          </label>

          <div class="flex items-center justify-center gap-2">
            <InputCommafyNumber
              v-model.number="modelValue.value"
              type="number"
              min="0"
              required
              class="block w-full grow rounded-lg border border-gray-300 bg-white p-2 text-right text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      <section class="flex justify-center gap-2">
        <button
          type="submit"
          class="inline-flex min-w-24 cursor-pointer items-center justify-center gap-0.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-700 focus:ring-1 focus:ring-gray-500 focus:outline-hidden dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          <span class="icon-[el--ok-sign] h-4 w-4"></span>
          ＯＫ
        </button>
      </section>
    </form>
  </div>
</template>
