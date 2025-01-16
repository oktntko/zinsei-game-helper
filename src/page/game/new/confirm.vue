<script setup lang="ts">
import { eq } from 'drizzle-orm';
import * as R from 'remeda';
import { db } from '~/db';
import { games, players } from '~/db/schema';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const $router = useRouter();
const $loading = useLoading();
const $toast = useToast();

const modelValue = defineModel<typeof games.$inferSelect>({ required: true });
const playerList = defineModel<(typeof players.$inferSelect)[]>('players', { required: true });

async function handleSubmit() {
  const loading = $loading.open();

  try {
    await db
      .update(games)
      .set(R.omit(modelValue.value, ['game_id']))
      .where(eq(games.game_id, modelValue.value.game_id))
      .returning();

    await db
      .update(players)
      .set({ money: modelValue.value.initial_money })
      .where(eq(players.game_id, modelValue.value.game_id))
      .returning();

    $router.replace({
      name: '/game/[game_id]',
      params: {
        game_id: modelValue.value.game_id,
      },
    });

    $toast.info('ゲームをはじめましょう');
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
        {{ modelValue.name }}
      </div>
      <div class="space-y-1">遊ぶ人数：{{ modelValue.players }}</div>
      <div v-for="player of playerList" :key="player.player_id" class="space-y-1">
        <div :style="{ color: `rgb(${player.color})` }">■</div>
        <div>{{ player.name }}</div>
        <img :src="player.image" />
      </div>

      <div class="space-y-1">所持金：{{ modelValue.initial_money }}</div>
      <div class="space-y-1">ルーレット：{{ modelValue.roll }}</div>

      <div>
        <button
          type="submit"
          class="inline-flex items-center gap-0.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          <span class="icon-[carbon--continue-filled] h-4 w-4"></span>
          ゲームをはじめる
        </button>
      </div>
    </form>
  </div>
</template>
