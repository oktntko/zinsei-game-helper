<script setup lang="ts">
import { db } from '~/db';
import type { games } from '~/db/schema';
import ModalNewGame from './ModalNewGame.vue';

const data = ref<{
  game_list: Awaited<ReturnType<typeof db.query.games.findMany>>;
}>({ game_list: [] });

onMounted(async () => {
  data.value.game_list = await db.query.games.findMany();
});
type Game = typeof games.$inferSelect;

const $router = useRouter();
</script>

<template>
  <div class="container mx-auto flex flex-col items-center gap-4 py-8">
    <div
      v-for="game of data.game_list"
      :key="game.game_id"
      class="w-80 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
    >
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ game.name }}
      </h5>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {{ game.description }}
      </p>

      <div class="flex justify-center gap-4">
        <button
          type="button"
          class="inline-flex items-center gap-0.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          <span class="icon-[clarity--new-solid] h-4 w-4"></span>
          はじめから
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-0.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          <span class="icon-[carbon--continue-filled] h-4 w-4"></span>
          つづきから
        </button>
      </div>
    </div>
    <button
      type="button"
      class="inline-flex items-center gap-0.5 rounded-lg border border-blue-700 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
      @click="
        async () => {
          const game = await $modal.open<Game>({
            component: ModalNewGame,
          });

          if (game) {
            $router.push({
              name: '/game/new/[game_id]',
              params: {
                game_id: game.game_id,
              },
            });
          }
        }
      "
    >
      はじめてのゲーム
    </button>
  </div>
</template>
