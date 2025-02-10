<script setup lang="ts">
import type { games, players } from '~/db/schema';

const props = defineProps<{
  game: typeof games.$inferSelect;
  current: typeof players.$inferSelect;
}>();

const player = defineModel<typeof players.$inferSelect>('player', { required: true });
const turn = defineModel<number>('turn', { required: true });

const mul = ref<1 | 10>(1);

const pointDiff = computed(() => {
  return player.value.point - props.current.point;
});

const refRadio = ref<HTMLInputElement>();
watchEffect(() => {
  if (turn.value === player.value.order) {
    refRadio.value?.focus();
  }
});
</script>

<template>
  <div
    class="relative flex w-full grow flex-col justify-center gap-2 rounded bg-white transition-colors"
    :class="[turn === player.order ? 'border-8 p-6' : 'border-4 p-7']"
    :style="{
      'border-color': turn === player.order ? `rgb(${player.color})` : `rgba(${player.color},0.6)`,
    }"
  >
    <div>
      <label
        class="inline-flex cursor-pointer items-center gap-1"
        :class="[
          'before:h-6 before:w-6 before:rounded-full before:border before:border-gray-200 before:bg-gray-50 before:transition-all',
          turn === player.order
            ? 'before:bg-green-400 before:shadow-[inset_0_0_0_4px_rgba(243,244,246,0.9)]'
            : '',
        ]"
      >
        <input
          ref="refRadio"
          v-model="turn"
          type="radio"
          class="absolute opacity-0"
          :value="player.order"
        />
        <div class="flex h-10 w-10 items-center justify-center">
          <img :src="player.image" width="40" height="40" />
        </div>
        <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {{ player.name }}
        </h5>
      </label>
    </div>

    <div class="flex grow flex-col justify-center gap-1">
      <template v-if="pointDiff === 0">
        <InputCommafyNumber
          v-model.lazy="player.point"
          class="w-full items-center justify-center text-center text-3xl leading-none"
          type="number"
          :step="game.step"
        >
        </InputCommafyNumber>
      </template>
      <template v-else>
        <div class="relative flex items-end justify-center gap-2">
          <div class="text-2xl">
            {{ current.point.toLocaleString() }}
          </div>

          <div class="text-xl" :class="[pointDiff > 0 ? 'text-blue-600' : 'text-red-600']">
            {{ pointDiff > 0 ? '+' : '-' }}
          </div>

          <div class="text-2xl" :class="[pointDiff > 0 ? 'text-blue-600' : 'text-red-600']">
            {{ Math.abs(pointDiff).toLocaleString() }}
          </div>

          <div class="text-xl">=</div>

          <div class="max-w-40 text-3xl leading-none">
            <!-- https://codepen.io/regic/pen/pyyKbd -->
            <InputCommafyNumber
              v-model="player.point"
              class="w-full text-center"
              type="number"
              :step="game.step"
            >
            </InputCommafyNumber>
          </div>

          <button
            type="button"
            class="absolute -right-4 -top-3 h-6 w-6 rounded-full bg-transparent text-gray-400 transition-colors hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-500 dark:hover:text-white"
            @click="
              async () => {
                if (await $dialog.confirm(`${player.name} の ポイント を もとにもどしますか？`)) {
                  player.point = current.point;
                }
              }
            "
          >
            <span class="icon-[bi--x] h-6 w-6" />
          </button>
        </div>
      </template>

      <div class="flex items-center justify-center gap-2">
        <div class="flex items-center justify-center gap-2">
          <label
            v-for="i of [1, 10]"
            :key="i"
            class="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full font-medium shadow-[0_0_2px_1px_rgba(0,0,0,0.25)] transition-transform"
            :class="[mul === i ? `scale-125` : 'scale-90']"
          >
            <span class="icon-[uim--multiply] text-xs"></span>
            <span class="-ml-0.5 text-xs">{{ i }}</span>
            <input v-model="mul" type="radio" :value="i" class="sr-only" />
          </label>
        </div>

        <div class="flex items-center justify-center gap-2">
          <button
            v-for="sign of [-1, 1]"
            :key="sign"
            class="w-20 rounded-md border bg-white px-2 py-1 text-base text-gray-900 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            :class="[
              sign > 0
                ? 'border-green-400 hover:bg-green-100 hover:shadow-[0_0_2px_2px_rgba(74,222,128,0.25)] focus:bg-green-100 focus:shadow-[0_0_2px_2px_rgba(74,222,128,0.25)] active:bg-green-100 active:shadow-[0_0_2px_2px_rgba(74,222,128,0.25)]'
                : 'border-red-400 hover:bg-red-100 hover:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)] focus:bg-red-100 focus:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)] active:bg-red-100 active:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)]',
            ]"
            type="button"
            @click="
              () => {
                player.point = player.point + game.step * sign * mul;
              }
            "
          >
            {{ sign > 0 ? '+' : '' }}{{ (game.step * sign * mul).toLocaleString() }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
