<script setup lang="ts">
import { asc } from 'drizzle-orm';
import { colors, images } from '~/const';
import { db, initializeTables } from '~/db';
import { games, players } from '~/db/schema';
import ModalEditGame from '~/page/game/modal/ModalEditGame.vue';
import ModalNewGame from '~/page/game/modal/ModalNewGame.vue';
import ModalNewPlayer from '~/page/game/modal/player/ModalNewPlayer.vue';
import { useDialog } from '~/plugin/DialogPlugin';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useModal } from '~/plugin/ModalPlugin';

definePage({
  alias: ['/'],
  meta: {
    layout: 'game',
  },
});

const $router = useRouter();
const $modal = useModal();
const $loading = useLoading();
const $dialog = useDialog();

const data = ref<{
  game_list: Awaited<ReturnType<typeof db.query.games.findMany>>;
}>({ game_list: [] });

onMounted(async () => {
  data.value.game_list = await db.query.games.findMany({ orderBy: asc(games.name) });
});
type Game = typeof games.$inferSelect & { sannka_ninnzuu: number };

async function handleNewGame() {
  const game = await $modal.open<Game>({
    component: ModalNewGame,
  });

  if (!game) return;

  const player_list: (typeof players.$inferSelect)[] = [];
  for (let order = 0; order < game.sannka_ninnzuu; order++) {
    const exists_colors = player_list.map((x) => x.color);
    const exists_images = player_list.map((x) => x.image);

    const player = await $modal.open<typeof players.$inferSelect>({
      component: ModalNewPlayer,
      componentProps: {
        game_id: game.game_id,
        order,
        initial_color: colors
          .map(({ value }) => value)
          .filter((color) => !exists_colors.includes(color))[0],
        initial_image: images
          .map(({ value }) => value)
          .filter((image) => !exists_images.includes(image))[0],
        exists_colors,
        exists_images,
      },
    });

    if (player) {
      player_list.push(player);
    } else {
      order--;
    }
  }

  await $modal.open<Game>({
    component: ModalEditGame,
    componentProps: {
      game_id: game.game_id,
    },
  });

  $router.push({
    name: '/game/[game_id]/',
    params: {
      game_id: game.game_id,
    },
  });

  $dialog.info('ゲームをはじめよう！\nせっていはあとからかえられるよ。');
}

async function resetApp() {
  const yes = await $dialog.alert(
    'データを初期化します。この操作は取り消せません。\nよろしいですか？',
  );
  if (!yes) return;

  const loading = $loading.open();
  try {
    await initializeTables();

    data.value.game_list = await db.query.games.findMany({ orderBy: asc(games.name) });
  } finally {
    loading.close();
  }
}
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden">
    <header class="z-10 shrink-0 rounded-b-sm bg-gray-600 shadow">
      <div class="container mx-auto flex max-w-xl items-center justify-center gap-2 px-2 py-2">
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

        <MyDropdown menu_button_outer_class="flex items-center justify-center">
          <template #button="{ toggle }">
            <button
              type="button"
              class="group/item inline-flex flex-col items-center justify-center text-gray-300"
              @click="toggle"
            >
              <span
                class="icon-[ic--twotone-help] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
              ></span>
              <span class="sr-only capitalize">menu</span>
            </button>
          </template>
          <template #default>
            <ul class="w-52 rounded-sm border border-gray-300 bg-white shadow-md">
              <li>
                <button
                  type="button"
                  class="group flex w-full items-center p-2 text-blue-600 transition duration-75 hover:bg-gray-200"
                  @click="resetApp"
                >
                  <span class="icon-[bx--reset] h-4 w-4"></span>
                  <span class="ms-1 capitalize">データを初期化する</span>
                </button>
              </li>
            </ul>
          </template>
        </MyDropdown>
      </div>
    </header>

    <main
      class="container mx-auto flex max-w-xl flex-1 snap-y snap-mandatory flex-col gap-2 overflow-y-auto scroll-smooth p-2 sm:gap-2 sm:p-2"
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
        @click="handleNewGame"
      >
        <span class="icon-[material-symbols--add-rounded]"></span>
        はじめてのゲーム
      </button>
    </main>
  </div>
</template>
