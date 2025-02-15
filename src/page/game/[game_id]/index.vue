<script setup lang="ts">
import { asc, eq } from 'drizzle-orm';
import { db } from '~/db';
import { players, type games } from '~/db/schema';
import { R } from '~/lib/remeda';
import PlayerCard from '~/page/game/[game_id]/component/PlayerCard.vue';
import ModalSpinwheel from '~/page/game/modal/ModalSpinwheel.vue';
import { useToast } from '~/plugin/ToastPlugin';

const game = defineModel<typeof games.$inferSelect>({ required: true });
const player_list = defineModel<(typeof players.$inferSelect)[]>('player_list', { required: true });

const historyList = ref<(typeof players.$inferSelect)[][]>([]);
const currentPlayerList = ref<(typeof players.$inferSelect)[]>([]);
const turn = ref(0);

useTitle(`あそび | ${game.value.name}`);

onMounted(() => {
  currentPlayerList.value = R.clone(player_list.value);
  turn.value = 0;
});

const loading = ref(false);
const $toast = useToast();

async function handleNext() {
  loading.value = true;
  try {
    for (const player of player_list.value) {
      await db.update(players).set(player).where(eq(players.player_id, player.player_id));
    }

    const updatedPlayerList = await db.query.players.findMany({
      where: (games, { eq }) => eq(games.game_id, game.value.game_id),
      orderBy: asc(players.order),
    });

    historyList.value.unshift(R.clone(currentPlayerList.value));
    currentPlayerList.value = player_list.value;
    player_list.value = updatedPlayerList;
    turn.value = turn.value + 1 < player_list.value.length ? turn.value + 1 : 0;

    $toast.success(`${player_list.value[turn.value].name} のばんだよ`);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden">
    <header class="z-10 shrink-0 rounded-b-sm bg-gray-600 shadow">
      <div class="container mx-auto flex max-w-xl items-center justify-center gap-2 px-2 py-2">
        <RouterLink
          :to="{
            name: '/game/',
          }"
          class="group/item inline-flex flex-col items-center justify-center text-gray-300"
        >
          <div
            class="icon-[weui--back2-outlined] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
          ></div>
        </RouterLink>

        <div class="flex-1 overflow-hidden truncate text-2xl text-yellow-500">
          {{ game.name }}
        </div>

        <RouterLink
          :to="{
            name: '/game/[game_id]/setting/',
            params: {
              game_id: game.game_id,
            },
          }"
          class="group/item inline-flex flex-col items-center justify-center text-gray-300"
        >
          <div
            class="icon-[uil--setting] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
          ></div>
        </RouterLink>
      </div>
    </header>

    <main
      v-if="currentPlayerList.length"
      class="container mx-auto flex max-w-xl flex-1 snap-y snap-mandatory flex-col gap-2 overflow-y-auto scroll-smooth p-2 sm:gap-2 sm:p-2"
    >
      <PlayerCard
        v-for="(player, i) of player_list"
        :key="player.player_id"
        v-model:player="player_list[i]"
        v-model:turn="turn"
        :current="currentPlayerList[i]"
        :game="game"
      >
      </PlayerCard>
    </main>
    <RouterLink
      v-else
      class="container mx-auto flex max-w-xl flex-1 snap-y snap-mandatory flex-col gap-2 overflow-y-auto scroll-smooth p-2 sm:gap-2 sm:p-2"
      :to="{
        name: '/game/[game_id]/setting/player',
        params: {
          game_id: game.game_id,
        },
      }"
    >
      あそぶひとをふやそう
    </RouterLink>

    <footer class="z-10 shrink-0 rounded-t-sm bg-white/70 text-gray-900 shadow">
      <div class="container mx-auto flex h-12 max-w-xl justify-center gap-2 px-2 py-2">
        <div class="ms-6 flex h-full flex-1 justify-center">
          <button
            type="button"
            class="group/item inline-flex flex-1 flex-col items-center justify-center"
            :disabled="loading"
          >
            <span
              class="icon-[solar--menu-dots-circle-broken] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
            ></span>
            <span class="text-xs"> メニュー </span>
          </button>
          <button
            type="button"
            class="group/item inline-flex flex-1 flex-col items-center justify-center disabled:text-gray-500"
            :disabled="loading"
            @click="
              () => {
                const newest = historyList.shift();
                if (newest) {
                  currentPlayerList = newest;
                  player_list = newest;
                  turn = turn - 1 >= 0 ? turn - 1 : player_list.length - 1;
                  $toast.success(`まえにもどしたよ`);
                } else {
                  $toast.info(`もうもどせないよ`);
                }
              }
            "
          >
            <span
              class="icon-[mynaui--undo-solid] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
            ></span>
            <span class="text-xs"> まえにもどす </span>
          </button>
          <button
            type="button"
            class="group/item inline-flex flex-1 flex-col items-center justify-center"
            :disabled="loading"
            @click="handleNext"
          >
            <span
              class="icon-[formkit--submit] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
            ></span>
            <span class="text-xs"> つぎへ </span>
          </button>
        </div>

        <button
          type="button"
          class="relative w-16"
          :disabled="loading"
          @click="
            async () => {
              await $modal.open({
                component: ModalSpinwheel,
                componentProps: {
                  size: game.roll,
                },
              });
            }
          "
        >
          <Roulette
            class="absolute -bottom-4 -right-4 h-20 w-20 -rotate-12 transition-transform duration-100 hover:scale-125"
            :size="game.roll"
          ></Roulette>
        </button>
      </div>
    </footer>
  </div>
</template>
