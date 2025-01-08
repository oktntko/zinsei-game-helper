<script setup lang="ts">
import { eq } from 'drizzle-orm';
import { db } from '~/db';
import { games } from '~/db/schema';
import { useLoading } from '~/plugin/LoadingPlugin';

const $router = useRouter();
const $loading = useLoading();

const modelValue = defineModel<typeof games.$inferSelect>({ required: true });

async function handleSubmit() {
  const loading = $loading.open();

  try {
    await db
      .update(games)
      .set(modelValue.value)
      .where(eq(games.game_id, modelValue.value.game_id))
      .returning();

    $router.replace({
      name: '/game/[game_id]',
      params: {
        game_id: modelValue.value.game_id,
      },
    });
  } finally {
    loading.close();
  }
}
</script>

<template>
  <div>
    <h1
      class="px-4 pb-4 pt-8 text-lg font-extrabold leading-none tracking-tight text-gray-900 dark:text-white"
    >
      <span class="text-blue-600 dark:text-blue-500">ゲーム</span> の設定をしましょう
    </h1>

    <form class="flex max-w-sm flex-col gap-4 px-4 py-4" @submit.prevent="handleSubmit">
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          ルーレット（さいころ）の出目を教えてください
        </label>

        <label
          v-for="n of [6, 8, 10, 12]"
          :key="n"
          class="flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300"
        >
          <input
            v-model="modelValue.roll"
            type="radio"
            :value="n"
            required
            class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          />
          {{ n }}
        </label>
      </div>

      <div>
        <button
          type="submit"
          class="inline-flex items-center gap-0.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          <span class="icon-[carbon--continue-filled] h-4 w-4"></span>
          次へ
        </button>
      </div>
    </form>
  </div>
</template>
