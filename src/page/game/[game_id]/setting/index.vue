<script setup lang="ts">
import { eq } from 'drizzle-orm';
import * as R from 'remeda';
import { db } from '~/db';
import { games } from '~/db/schema';
import { useToast } from '~/plugin/ToastPlugin';

const modelValue = defineModel<typeof games.$inferSelect>({ required: true });

const debounceHandleSubmit = R.funnel(handleSubmit, { minQuietPeriodMs: 1000 });

const $toast = useToast();
async function handleSubmit() {
  try {
    await db
      .update(games)
      .set(R.omit(modelValue.value, ['game_id']))
      .where(eq(games.game_id, modelValue.value.game_id))
      .returning();

    $toast.info('ほぞんしました');
  } finally {
    //
  }
}

watch(
  () => modelValue,
  () => debounceHandleSubmit.call(),
  { deep: true },
);
</script>

<template>
  <div class="flex flex-col gap-6 px-4 py-8">
    <section class="flex flex-col gap-4">
      <div class="space-y-1">
        <label for="name" class="block text-sm font-medium text-gray-900 dark:text-white">
          ゲームのなまえ
        </label>
        <input
          id="name"
          v-model="modelValue.name"
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
          v-model="modelValue.description"
          type="text"
          required
          class="block w-full rounded-lg border border-gray-300 bg-white p-2 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          ルーレット（さいころ）のでめ
        </label>

        <div class="flex gap-4">
          <label
            class="flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300"
          >
            <input
              v-model.number="modelValue.roll"
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
              v-model.number="modelValue.roll"
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
              v-model.number="modelValue.roll"
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
              v-model="modelValue.step"
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
          v-model="modelValue.first_point"
          required
          :step="modelValue.step"
          type="number"
          class="inline-block rounded-lg border border-gray-300 bg-white p-2 text-right text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
    </section>
  </div>
</template>
