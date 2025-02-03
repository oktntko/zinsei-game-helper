<script setup lang="ts">
import { asc, eq } from 'drizzle-orm';
import { $transaction } from '~/db';
import { players, type games } from '~/db/schema';
import { R } from '~/lib/remeda';
import ModalSpinwheel from '~/page/game/modal/ModalSpinwheel.vue';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';
import Player from './component/Player.vue';

const game = defineModel<typeof games.$inferSelect>({ required: true });
const player_list = defineModel<(typeof players.$inferSelect)[]>('player_list', { required: true });

const currentPlayerList = ref<(typeof players.$inferSelect)[]>([]);
const turn = ref(0);

useTitle(`あそび | ${game.value.name}`);

onMounted(() => {
  currentPlayerList.value = R.clone(player_list.value);
  turn.value = 0;
});

const $loading = useLoading();
const $toast = useToast();

async function handleNext() {
  const loading = $loading.open();
  try {
    const updatedPlayerList = await $transaction(async (tx) => {
      for (const player of player_list.value) {
        await tx.update(players).set(player).where(eq(players.player_id, player.player_id));
      }

      return tx.query.players.findMany({
        where: (games, { eq }) => eq(games.game_id, game.value.game_id),
        orderBy: asc(players.order),
      });
    });

    currentPlayerList.value = player_list.value;
    player_list.value = updatedPlayerList;
    turn.value = turn.value + 1 < player_list.value.length ? turn.value + 1 : 0;

    $toast.success(`${player_list.value[turn.value].name} のばんだよ`);
  } finally {
    loading.close();
  }
}
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden">
    <header
      class="z-10 flex shrink-0 justify-center gap-2 rounded-b-sm bg-gray-600 px-2 py-2 shadow"
    >
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
    </header>

    <main
      v-if="currentPlayerList.length"
      class="flex flex-1 flex-col gap-px overflow-y-auto p-px sm:gap-1 sm:p-2"
    >
      <Player
        v-for="(player, i) of player_list"
        :key="player.player_id"
        v-model:player="player_list[i]"
        :current="currentPlayerList[i]"
        :game="game"
        :class="[turn === player.order ? 'border-solid' : 'border-dotted']"
      >
      </Player>
    </main>

    <footer
      class="z-10 flex h-12 shrink-0 justify-center rounded-t-sm bg-white/70 text-gray-900 shadow backdrop-blur"
    >
      <div class="ms-6 flex h-full flex-1 justify-center">
        <button
          type="button"
          class="group/item inline-flex flex-1 flex-col items-center justify-center"
        >
          <span
            class="icon-[solar--menu-dots-circle-broken] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
          ></span>
          <span class="text-xs"> メニュー </span>
        </button>
        <button
          type="button"
          class="group/item inline-flex flex-1 flex-col items-center justify-center"
        >
          <span
            class="icon-[mynaui--undo-solid] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
          ></span>
          <span class="text-xs"> まえにもどす </span>
        </button>
        <button
          type="button"
          class="group/item inline-flex flex-1 flex-col items-center justify-center"
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
        @click="
          async () => {
            await $modal.open({
              component: ModalSpinwheel,
            });
          }
        "
      >
        <Roulette
          class="absolute bottom-[-12px] right-[-12px] h-20 w-20 -rotate-12 transition-transform duration-100 hover:scale-125"
        ></Roulette>
      </button>
    </footer>
  </div>
</template>
