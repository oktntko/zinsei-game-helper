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
        <label class="flex cursor-pointer items-center justify-between">
          <span class="text-base font-medium text-gray-900 dark:text-gray-300">
            借金・約束手形
          </span>
          <input
            v-model="modelValue.enable_syakkinn_yakusoku_tegata"
            type="checkbox"
            class="peer sr-only"
          />
          <div
            class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
          ></div>
        </label>
      </div>
      <div class="ml-4 space-y-1">
        <label class="flex cursor-pointer items-center justify-between">
          <span class="text-base font-medium text-gray-900 dark:text-gray-300">
            約束手形の金額
          </span>

          <InputCommafyNumber
            v-model="modelValue.yakusoku_tegata"
            required
            :step="modelValue.step"
            :disabled="!modelValue.enable_syakkinn_yakusoku_tegata"
            type="number"
            class="inline-block rounded-lg border border-gray-300 bg-white p-2 text-right text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </label>
      </div>

      <div class="space-y-1">
        <label class="flex cursor-pointer items-center justify-between">
          <span class="text-base font-medium text-gray-900 dark:text-gray-300"> 職業 </span>
          <input v-model="modelValue.enable_syokugyou" type="checkbox" class="peer sr-only" />
          <div
            class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
          ></div>
        </label>
      </div>
      <div class="space-y-1">
        <label class="flex cursor-pointer items-center justify-between">
          <span class="text-base font-medium text-gray-900 dark:text-gray-300"> 結婚・子ども </span>
          <input v-model="modelValue.enable_marry" type="checkbox" class="peer sr-only" />
          <div
            class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
          ></div>
        </label>
      </div>
      <div class="space-y-1">
        <label class="flex cursor-pointer items-center justify-between">
          <span class="text-base font-medium text-gray-900 dark:text-gray-300"> お宝 </span>
          <input v-model="modelValue.enable_items" type="checkbox" class="peer sr-only" />
          <div
            class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
          ></div>
        </label>
      </div>
      <div class="space-y-1">
        <label class="flex cursor-pointer items-center justify-between">
          <span class="text-base font-medium text-gray-900 dark:text-gray-300"> マイホーム </span>
          <input v-model="modelValue.enable_myhome" type="checkbox" class="peer sr-only" />
          <div
            class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
          ></div>
        </label>
      </div>
      <div class="space-y-1">
        <label class="flex cursor-pointer items-center justify-between">
          <span class="text-base font-medium text-gray-900 dark:text-gray-300"> 株券 </span>
          <input v-model="modelValue.enable_kabukenn" type="checkbox" class="peer sr-only" />
          <div
            class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
          ></div>
        </label>
      </div>
      <div class="space-y-1">
        <label class="flex cursor-pointer items-center justify-between">
          <span class="text-base font-medium text-gray-900 dark:text-gray-300"> 保険証券 </span>
          <input v-model="modelValue.enable_hokenn_syoukenn" type="checkbox" class="peer sr-only" />
          <div
            class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
          ></div>
        </label>
      </div>
    </section>
  </div>
</template>
