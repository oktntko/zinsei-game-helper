<script setup lang="ts">
import { db } from '~/db';
import { games } from '~/db/schema';
import { useLoading } from '~/plugin/LoadingPlugin';

const emit = defineEmits<{
  close: [typeof games.$inferSelect & { sannka_ninnzuu: number }];
}>();

const modelValue = ref<typeof games.$inferInsert>({
  name: '',
  description: '',
  step: 1000,
  first_point: 5000,
  roll: 10,
});

const sannka_ninnzuu = ref(4);

const $loading = useLoading();
async function handleSubmit() {
  const loading = $loading.open();

  try {
    const [game] = await db.insert(games).values(modelValue.value).returning();

    emit('close', { ...game, sannka_ninnzuu: sannka_ninnzuu.value });
  } finally {
    loading.close();
  }
}
</script>

<template>
  <div class="p-4">
    <header class="mb-4 text-lg font-bold capitalize">はじめてのゲーム</header>
    <form class="flex flex-col gap-6" autocomplete="off" @submit.prevent="handleSubmit">
      <section class="flex flex-col gap-2">
        <div class="space-y-1">
          <label for="name" class="block text-sm font-medium text-gray-900 dark:text-white">
            なんていう ゲーム？
          </label>
          <input
            id="name"
            v-model="modelValue.name"
            type="text"
            required
            placeholder="ゲームのなまえ"
            class="block w-full rounded-lg border border-gray-300 bg-white p-2 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-900 dark:text-white">
            なんにん で あそぶ？
          </label>

          <div v-for="n of [2, 3, 4, 5, 6]" :key="n">
            <label
              class="inline-flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300"
            >
              <input
                v-model.number="sannka_ninnzuu"
                type="radio"
                :value="n"
                required
                class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              {{ n }} にん
            </label>
          </div>
        </div>
      </section>

      <section class="flex justify-center gap-2">
        <button
          type="submit"
          class="inline-flex cursor-pointer items-center gap-0.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-700 focus:ring-1 focus:ring-gray-500 focus:outline-hidden dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          <span class="icon-[carbon--continue-filled] h-4 w-4"></span>
          つづける
        </button>
      </section>
    </form>
  </div>
</template>
