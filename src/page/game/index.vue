<script setup lang="ts">
import { db } from '~/db';
import type { games } from '~/db/schema';
import ModalNewGame from '~/page/game/modal/ModalNewGame.vue';

definePage({
  alias: ['/'],
  meta: {
    layout: 'game',
  },
});

const $router = useRouter();

const data = ref<{
  game_list: Awaited<ReturnType<typeof db.query.games.findMany>>;
}>({ game_list: [] });

onMounted(async () => {
  data.value.game_list = await db.query.games.findMany();
});
type Game = typeof games.$inferSelect;
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden">
    <header
      class="z-10 flex shrink-0 items-center justify-center gap-2 rounded-b-sm bg-gray-600 px-2 py-2 shadow"
    >
      <Roulette class="h-6 w-6 scale-125 duration-100"></Roulette>

      <div class="flex-1 overflow-hidden truncate text-2xl text-yellow-500">
        じんせいゲームヘルパー
      </div>

      <a
        href="https://github.com/oktntko/zinsei-game-helper"
        class="group/item inline-flex flex-col items-center justify-center text-gray-300"
      >
        <div
          class="icon-[mdi--github] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
        ></div>
      </a>

      <a
        href="https://github.com/oktntko/zinsei-game-helper"
        class="group/item inline-flex flex-col items-center justify-center text-gray-300"
      >
        <div
          class="icon-[ic--twotone-help] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
        ></div>
        <!-- TODO -->
        <!-- <button
          type="button"
          class="inline-flex items-center gap-0.5 rounded-lg border border-blue-700 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
          @click="initializeTables"
        >
          しょきか
        </button> -->
      </a>
    </header>

    <main
      class="flex flex-1 snap-y snap-mandatory flex-col gap-2 overflow-y-auto scroll-smooth p-2 sm:gap-2 sm:p-2"
    >
      <RouterLink
        v-for="game of data.game_list"
        :key="game.game_id"
        :to="{
          name: '/game/[game_id]/',
          params: {
            game_id: game.game_id,
          },
        }"
        class="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <h5
          class="mb-2 truncate text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
          :title="game.name"
        >
          {{ game.name }}
        </h5>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          {{ game.description }}
        </p>
      </RouterLink>

      <button
        type="button"
        class="relative flex h-24 w-full shrink-0 items-center justify-center rounded border-4 border-dashed border-blue-300 bg-white p-6 hover:bg-blue-50"
        @click="
          async () => {
            const game = await $modal.open<Game>({
              component: ModalNewGame,
            });

            if (game) {
              $router.push({
                name: '/game/[game_id]/setting',
                params: {
                  game_id: game.game_id,
                },
              });
            }
          }
        "
      >
        <span class="icon-[material-symbols--add-rounded]"></span>
        はじめてのゲーム
      </button>
    </main>
  </div>
</template>
