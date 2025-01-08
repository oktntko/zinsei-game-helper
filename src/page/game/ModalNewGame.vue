<script setup lang="ts">
import { db } from '~/db';
import { games } from '~/db/schema';
import { useLoading } from '~/plugin/LoadingPlugin';

const emit = defineEmits<{
  close: [typeof games.$inferSelect];
}>();

const modelValue = ref<typeof games.$inferInsert>({
  name: '',
  description: '',
  initial_money: 3000,
  players: 4,
  roll: 10,
});

const $loading = useLoading();
async function handleSubmit() {
  const loading = $loading.open();

  try {
    const [game] = await db.insert(games).values(modelValue.value).returning();

    emit('close', game);
  } finally {
    loading.close();
  }
}
</script>

<template>
  <div class="p-4 sm:w-96">
    <header class="mb-4 text-lg font-bold capitalize">ゲームの設定をはじめる</header>
    <form class="flex flex-col gap-6" autocomplete="off" @submit.prevent="handleSubmit">
      <section class="flex flex-col gap-2">
        <div class="space-y-1">
          <label for="name" class="block text-sm font-medium text-gray-900 dark:text-white">
            ゲームの名前を教えてください
          </label>
          <input
            id="name"
            v-model="modelValue.name"
            type="text"
            required
            class="block w-full rounded-lg border border-gray-300 bg-white p-2 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
      </section>

      <section class="flex gap-2">
        <button
          type="submit"
          class="inline-flex items-center gap-0.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          <span class="icon-[carbon--continue-filled] h-4 w-4"></span>
          続ける
        </button>
      </section>
    </form>
  </div>
</template>
