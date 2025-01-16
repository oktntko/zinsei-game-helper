<script setup lang="ts">
import * as R from 'remeda';
import { db } from '~/db';
import type { games, items, jobs, players } from '~/db/schema';

const $router = useRouter();
const $route = useRoute('/game/[game_id]');
const game_id = $route.params.game_id;

const modelGame = ref<typeof games.$inferSelect>();
const playerList = ref<
  (typeof players.$inferSelect & {
    job: typeof jobs.$inferSelect | null;
    item_list: (typeof items.$inferSelect)[];
  })[]
>([]);
const itemList = ref<(typeof items.$inferSelect)[]>([]);
const jobList = ref<(typeof jobs.$inferSelect)[]>([]);

onMounted(async () => {
  const game = await db.query.games.findFirst({
    with: {
      player_list: {
        with: {
          job: true,
          item_list: {
            with: {
              item: true,
            },
          },
        },
      },
      item_list: true,
      job_list: true,
    },
    where: (games, { eq }) => eq(games.game_id, game_id),
  });

  if (!game) {
    return $router.replace({ name: '/game/' });
  }

  modelGame.value = R.omit(game, ['player_list', 'item_list', 'job_list']);
  playerList.value = R.pick(game, ['player_list']).player_list.map((player) => ({
    ...R.omit(player, ['item_list']),
    item_list: player.item_list.map((x) => x.item),
  }));
  itemList.value = R.pick(game, ['item_list']).item_list;
  jobList.value = R.pick(game, ['job_list']).job_list;
});
</script>

<template>
  <div class="flex h-dvh flex-col">
    <main class="m-2 flex grow flex-col gap-1">
      <div
        v-for="player of playerList"
        :key="player.player_id"
        class="w-full grow space-y-2 rounded border-4 bg-white p-6"
        :style="{ 'border-color': `rgb(${player.color})` }"
      >
        <div class="flex items-center gap-1">
          <img :src="player.image" />
          <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ player.name }}
          </h5>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <button
              id="decrement-button"
              type="button"
              data-input-counter-decrement="counter-input"
              class="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
            >
              <span class="icon-[tabler--minus]"></span>
            </button>
            <input
              id="counter-input"
              v-model="player.money"
              type="number"
              data-input-counter
              class="flex-shrink-0 border-0 bg-transparent text-center text-2xl font-normal text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
              placeholder=""
              required
            />
            <button
              id="increment-button"
              type="button"
              data-input-counter-increment="counter-input"
              class="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
            >
              <span class="icon-[tabler--plus]"></span>
            </button>
          </div>
          <div>きゅうりょう</div>
        </div>

        <div>もちもの</div>
      </div>
    </main>

    <footer class="sticky bottom-0 z-10 flex shrink-0 justify-center">
      <div class="flex w-full flex-1 items-end">
        <button type="button" class="group/item h-16 w-full">
          <div
            class="icon-[solar--menu-dots-circle-broken] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
          ></div>
          <div class="text-xs text-gray-900 dark:text-white">メニュー</div>
        </button>
      </div>
      <button type="button" class="w-full flex-1">
        <span class="icon-[mynaui--undo-solid]"></span>
      </button>
      <button type="button" class="w-full flex-1">
        <span class="icon-[mynaui--redo-solid]"></span>
      </button>
      <button type="button" class="w-full flex-1">
        <span class="icon-[formkit--submit]"></span>
      </button>
      <button type="button" class="relative h-20 w-full flex-1 overflow-x-hidden overflow-y-hidden">
        <Roulette
          class="absolute bottom-[-12px] right-[-12px] h-20 w-20 -rotate-12 transition-transform duration-100 hover:scale-125"
        ></Roulette>
      </button>
    </footer>
  </div>
</template>
