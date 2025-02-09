<script setup lang="ts">
import { colors, images } from '~/const';
import { players } from '~/db/schema';

const emit = defineEmits<{
  submit: [];
}>();

defineProps<{
  exists_colors: string[];
  exists_images: string[];
}>();

const modelValue = defineModel<typeof players.$inferInsert>({ required: true });
</script>

<template>
  <form class="flex flex-col gap-6" autocomplete="off" @submit.prevent="emit('submit')">
    <section class="flex flex-col gap-4">
      <div class="space-y-2">
        <label for="name" class="block text-sm font-medium text-gray-900 dark:text-white">
          なまえ を おしえてね
        </label>
        <input
          id="name"
          v-model="modelValue.name"
          type="text"
          required
          class="block w-full rounded-lg border border-gray-300 bg-white p-2 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          すきな いろ を おしえてね
        </label>

        <div class="flex flex-wrap gap-3">
          <div
            v-for="{ value, label } of colors.filter(
              ({ value }) => !exists_colors.find((color) => color === value),
            )"
            :key="value"
            class="relative"
          >
            <label
              class="inline-flex h-10 w-10 cursor-pointer gap-1 rounded-full text-lg font-medium transition-transform"
              :class="[
                modelValue.color === value
                  ? `scale-125 shadow-[0_0_4px_2px_rgba(0,0,255,0.6)]`
                  : 'scale-90 shadow-[0_0_4px_1px_rgba(0,0,0,0.25)]',
              ]"
              :style="{
                backgroundColor: `rgb(${value})`,
              }"
              :title="label"
            >
              <input
                v-model="modelValue.color"
                type="radio"
                :value="value"
                required
                class="sr-only"
              />
            </label>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          すきな え を おしえてね
        </label>

        <div class="flex flex-wrap gap-3">
          <div
            v-for="{ value, label } of images.filter(
              ({ value }) => !exists_images.find((image) => image === value),
            )"
            :key="value"
            class="relative"
          >
            <label
              class="inline-flex h-12 w-12 cursor-pointer items-center justify-center gap-1 rounded-full text-lg font-medium transition-transform"
              :class="[
                modelValue.image === value
                  ? `scale-125 shadow-[0_0_4px_2px_rgba(0,0,255,0.6)]`
                  : 'scale-90 shadow-[0_0_4px_1px_rgba(0,0,0,0.25)]',
              ]"
              :title="label"
            >
              <input
                v-model="modelValue.image"
                type="radio"
                :value="value"
                required
                class="sr-only"
              />
              <img :src="value" height="40" width="40" :alt="label" />
            </label>
          </div>
        </div>
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
</template>
