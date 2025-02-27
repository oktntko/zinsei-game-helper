<script setup lang="ts">
import { eq } from 'drizzle-orm';
import { db } from '~/db';
import { games, players } from '~/db/schema';
import { R } from '~/lib/remeda';
import { useLoading } from '~/plugin/LoadingPlugin';

const emit = defineEmits<{
  close: [];
}>();

const { game_id } = defineProps<{ game_id: string }>();

const foundGame = await db.query.games.findFirst({
  with: {
    player_list: true,
  },
  where: (games, { eq }) => eq(games.game_id, game_id),
});

if (!foundGame) {
  throw emit('close');
}

const game = ref(foundGame);

const $loading = useLoading();
async function handleSubmit() {
  const loading = $loading.open();

  try {
    await db
      .update(games)
      .set(R.omit(game.value, ['game_id']))
      .where(eq(games.game_id, game.value.game_id));

    for (const player of game.value.player_list) {
      await db
        .update(players)
        .set({ point: game.value.first_point })
        .where(eq(players.player_id, player.player_id));
    }

    emit('close');
  } finally {
    loading.close();
  }
}
</script>

<template>
  <div class="p-4">
    <header class="mb-4 text-lg font-bold capitalize">{{ game.name }} のせっていをしてね</header>
    <form class="flex flex-col gap-6" autocomplete="off" @submit.prevent="handleSubmit">
      <section class="flex flex-col gap-2">
        <!-- 必須設定 -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-900 dark:text-white">
            ルーレット（さいころ）のでめ
          </label>

          <div class="flex gap-4">
            <label
              class="flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300"
            >
              <input
                v-model.number="game.roll"
                type="radio"
                :value="6"
                required
                class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <span class="icon-[fad--random-1dice] h-8 w-8"></span>
              6
            </label>
            <label
              class="flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300"
            >
              <input
                v-model.number="game.roll"
                type="radio"
                :value="10"
                required
                class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <Roulette class="h-8 w-8"></Roulette>
              10
            </label>
            <label
              class="flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300"
            >
              <input
                v-model.number="game.roll"
                type="radio"
                :value="12"
                required
                class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <span class="icon-[game-icons--rolling-dices] h-8 w-8"></span>
              12
            </label>
          </div>
        </div>
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-900 dark:text-white">
            ポイントのたんい
          </label>

          <div class="flex gap-4">
            <label
              v-for="n of [1, 10, 100, 1000, 10000]"
              :key="n"
              class="flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300"
            >
              <input
                v-model="game.step"
                type="radio"
                :value="n"
                required
                class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              {{ n.toLocaleString() }}
            </label>
          </div>
        </div>
        <div class="space-y-1">
          <label for="first_point" class="block text-sm font-medium text-gray-900 dark:text-white">
            さいしょのポイント
          </label>

          <InputCommafyNumber
            id="first_point"
            v-model="game.first_point"
            required
            :step="game.step"
            type="number"
            class="inline-block rounded-lg border border-gray-300 bg-white p-2 text-right text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
      </section>

      <section class="flex justify-center gap-2">
        <button
          type="submit"
          class="inline-flex cursor-pointer items-center gap-0.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-700 focus:ring-1 focus:ring-gray-500 focus:outline-hidden dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          <span class="icon-[carbon--continue-filled] h-4 w-4"></span>
          ゲームをはじめる
        </button>
      </section>
    </form>
  </div>
</template>
