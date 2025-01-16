<script setup lang="ts">
import { games } from '~/db/schema';

const $router = useRouter();

defineModel<typeof games.$inferSelect>({ required: true });
</script>

<template>
  <div>
    <h1
      class="px-4 pb-4 pt-8 text-lg font-extrabold leading-none tracking-tight text-gray-900 dark:text-white"
    >
      <span class="text-blue-600 dark:text-blue-500">ゲーム</span> の設定をしましょう
    </h1>

    <form
      class="flex max-w-sm flex-col gap-4 px-4 py-4"
      @submit.prevent="
        () => {
          $router.push({
            name: '/game/new/confirm',
          });
        }
      "
    >
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          職業を設定する（オプション）
        </label>
      </div>
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          アイテムを設定する（オプション）
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
