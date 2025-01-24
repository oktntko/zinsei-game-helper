<script setup lang="ts">
import { colors, images } from '~/const';
import { players } from '~/db/schema';
import { R } from '~/lib/remeda';

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
    <section class="flex flex-col gap-2">
      <div class="space-y-1">
        <label for="name" class="block text-sm font-medium text-gray-900 dark:text-white">
          名前を教えてください
        </label>
        <input
          id="name"
          v-model="modelValue.name"
          type="text"
          required
          class="block w-full rounded-lg border border-gray-300 bg-white p-2 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          好きな色を教えてください
        </label>

        <div v-for="(group, i) of R.chunk(colors, 4)" :key="i" class="flex gap-6">
          <label
            v-for="[value, label] of group"
            :key="value"
            class="inline-flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300"
          >
            <input
              v-model="modelValue.color"
              type="radio"
              :value="value"
              required
              :disabled="!!exists_colors.find((color) => color === value)"
              class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              :style="{
                'accent-color': `rgb(${value})`,
              }"
            />
            <span :style="{ color: `rgb(${value})` }"> ■ </span>
            <span class="text-sm"> {{ label }} </span>
          </label>
        </div>
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          好きな形を教えてください
        </label>

        <div v-for="(group, i) of R.chunk(images, 3)" :key="i" class="flex gap-6">
          <label
            v-for="[value, label] of group"
            :key="value"
            class="inline-flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300"
          >
            <input
              v-model="modelValue.image"
              type="radio"
              :value="value"
              required
              :disabled="!!exists_images.find((image) => image === value)"
              class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
            <img :src="value" />
            <span class="text-sm"> {{ label }} </span>
          </label>
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
