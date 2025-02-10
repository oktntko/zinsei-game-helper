<script setup lang="ts">
import { eq } from 'drizzle-orm';
import * as R from 'remeda';
import { db } from '~/db';
import { games, players } from '~/db/schema';
import { useDialog } from '~/plugin/DialogPlugin';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const router = useRouter();

const game = defineModel<typeof games.$inferSelect>({ required: true });
const player_list = defineModel<(typeof players.$inferSelect)[]>('player_list', { required: true });

const debounceHandleSubmit = R.funnel(handleSubmit, { minQuietPeriodMs: 1000 });

const $toast = useToast();
async function handleSubmit() {
  try {
    await db
      .update(games)
      .set(R.omit(game.value, ['game_id']))
      .where(eq(games.game_id, game.value.game_id))
      .returning();

    $toast.info('ほぞんしました');
  } finally {
    //
  }
}

watch(
  () => game,
  () => debounceHandleSubmit.call(),
  { deep: true },
);

const $dialog = useDialog();
const $loading = useLoading();

async function handleRestart() {
  const yes = await $dialog.confirm(
    '最初から始めます。最初のポイントに戻り、もちものはすべてリセットされます。よろしいですか？',
  );
  if (!yes) {
    return;
  }

  const loading = $loading.open();
  try {
    await Promise.all(
      player_list.value.map((player) =>
        db
          .update(players)
          .set({
            ...player,
            point: game.value.first_point,
            yakusoku_tegata: 0,
            syokugyou: '',
            kyuuryou: 0,
            is_married: false,
            children: 0,
            items: [],
            myhome: { name: '', value: 0 },
            kabukenn: 0,
            seimei_hokenn: false,
            kasai_hokenn: false,
            zidousya_hokenn: false,
          })
          .where(eq(players.player_id, player.player_id)),
      ),
    );

    router.replace({
      name: '/game/',
      params: {
        game_id: game.value.game_id,
      },
    });

    $toast.success(`${game.value.name}を最初の状態に戻しました。`);
  } finally {
    loading.close();
  }
}

async function handleDelete() {
  const yes = await $dialog.confirm(
    'ゲームを削除します。この操作は元に戻せません。よろしいですか？',
  );
  if (!yes) {
    return;
  }

  const loading = $loading.open();
  try {
    await db.delete(games).where(eq(games.game_id, game.value.game_id));

    router.replace({
      name: '/game/',
    });

    $toast.info(`${games.name} をけしたよ`);
  } finally {
    loading.close();
  }
}
</script>

<template>
  <main class="flex flex-1 flex-col gap-2 overflow-y-auto p-2 pb-8">
    <!-- 基礎情報 -->

    <div class="space-y-1">
      <label for="name" class="block text-sm font-medium text-gray-900 dark:text-white">
        ゲームのなまえ
      </label>
      <input
        id="name"
        v-model="game.name"
        type="text"
        required
        class="block w-full rounded-lg border border-gray-300 bg-white p-2 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      />
    </div>
    <div class="space-y-1">
      <label for="description" class="block text-sm font-medium text-gray-900 dark:text-white">
        ゲームのせつめい
      </label>
      <textarea
        id="description"
        v-model="game.description"
        type="text"
        required
        rows="3"
        class="block w-full rounded-lg border border-gray-300 bg-white p-2 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      />
    </div>

    <!-- 必須設定 -->
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-900 dark:text-white">
        ルーレット（さいころ）のでめ
      </label>

      <div class="flex gap-4">
        <label class="flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300">
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
        <label class="flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300">
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
        <label class="flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300">
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

    <!-- オプション -->
    <div
      class="flex items-center pb-4 pt-6 text-xl text-gray-800 before:mx-4 before:flex-1 before:border-t-4 before:border-dotted before:border-gray-400 after:mx-4 after:flex-1 after:border-t-4 after:border-dotted after:border-gray-400 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600"
    >
      オプション
    </div>
    <div class="space-y-1">
      <label class="flex cursor-pointer items-center justify-between">
        <span class="text-base font-medium text-gray-900 dark:text-gray-300"> 借金・約束手形 </span>
        <input v-model="game.enable_syakkinn_yakusoku_tegata" type="checkbox" class="peer hidden" />
        <div
          class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
        ></div>
      </label>
    </div>
    <div class="ml-4 space-y-1">
      <label class="flex cursor-pointer items-center justify-between">
        <span class="text-base font-medium text-gray-900 dark:text-gray-300"> 約束手形の金額 </span>

        <InputCommafyNumber
          v-model.number="game.yakusoku_tegata"
          required
          :step="game.step"
          :disabled="!game.enable_syakkinn_yakusoku_tegata"
          type="number"
          class="inline-block rounded-lg border border-gray-300 bg-white p-2 text-right text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </label>
    </div>

    <div class="space-y-1">
      <label class="flex cursor-pointer items-center justify-between">
        <span class="text-base font-medium text-gray-900 dark:text-gray-300"> 職業 </span>
        <input v-model="game.enable_syokugyou" type="checkbox" class="peer hidden" />
        <div
          class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
        ></div>
      </label>
    </div>
    <div class="space-y-1">
      <label class="flex cursor-pointer items-center justify-between">
        <span class="text-base font-medium text-gray-900 dark:text-gray-300"> 結婚・子ども </span>
        <input v-model="game.enable_marry" type="checkbox" class="peer hidden" />
        <div
          class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
        ></div>
      </label>
    </div>
    <div class="space-y-1">
      <label class="flex cursor-pointer items-center justify-between">
        <span class="text-base font-medium text-gray-900 dark:text-gray-300"> お宝 </span>
        <input v-model="game.enable_items" type="checkbox" class="peer hidden" />
        <div
          class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
        ></div>
      </label>
    </div>
    <div class="space-y-1">
      <label class="flex cursor-pointer items-center justify-between">
        <span class="text-base font-medium text-gray-900 dark:text-gray-300"> マイホーム </span>
        <input v-model="game.enable_myhome" type="checkbox" class="peer hidden" />
        <div
          class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
        ></div>
      </label>
    </div>
    <div class="space-y-1">
      <label class="flex cursor-pointer items-center justify-between">
        <span class="text-base font-medium text-gray-900 dark:text-gray-300"> 株券 </span>
        <input v-model="game.enable_kabukenn" type="checkbox" class="peer hidden" />
        <div
          class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
        ></div>
      </label>
    </div>
    <div class="space-y-1">
      <label class="flex cursor-pointer items-center justify-between">
        <span class="text-base font-medium text-gray-900 dark:text-gray-300"> 保険証券 </span>
        <input v-model="game.enable_hokenn_syoukenn" type="checkbox" class="peer hidden" />
        <div
          class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
        ></div>
      </label>
    </div>

    <!-- ゲームの操作 -->
    <div
      class="flex items-center pb-4 pt-6 text-xl text-gray-800 before:mx-4 before:flex-1 before:border-t-4 before:border-dotted before:border-gray-400 after:mx-4 after:flex-1 after:border-t-4 after:border-dotted after:border-gray-400 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600"
    >
      ゲームの操作
    </div>
    <div class="space-y-1">
      <div class="flex items-center justify-between">
        <span class="text-base font-medium text-gray-900 dark:text-gray-300"> 最初から始める </span>
        <button
          class="rounded-lg border bg-white px-2 py-1 text-base text-gray-900 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          :class="[
            'border-red-400 hover:bg-red-100 hover:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)] focus:bg-red-100 focus:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)] active:bg-red-100 active:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)]',
          ]"
          type="button"
          @click="handleRestart"
        >
          最初から
        </button>
      </div>
    </div>
    <div class="space-y-1">
      <div class="flex items-center justify-between">
        <span class="text-base font-medium text-gray-900 dark:text-gray-300">
          ゲームを削除する
        </span>
        <button
          class="rounded-lg border bg-white px-2 py-1 text-base text-gray-900 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          :class="[
            'border-red-400 hover:bg-red-100 hover:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)] focus:bg-red-100 focus:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)] active:bg-red-100 active:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)]',
          ]"
          type="button"
          @click="handleDelete"
        >
          削除する
        </button>
      </div>
    </div>
  </main>
</template>
