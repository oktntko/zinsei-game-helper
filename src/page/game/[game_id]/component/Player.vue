<script setup lang="ts">
import type { games, players } from '~/db/schema';
import TogglePlusMinus from './TogglePlusMinus.vue';

const props = defineProps<{
  game: typeof games.$inferSelect;
  current: typeof players.$inferSelect;
}>();

const player = defineModel<typeof players.$inferSelect>('player', { required: true });

const isPlus = ref<boolean>(true);

const pointDiff = computed(() => {
  return player.value.point - props.current.point;
});
</script>

<template>
  <div
    class="relative flex w-full grow flex-col justify-center gap-2 rounded border-8 bg-white p-6"
    :style="{ 'border-color': `rgb(${player.color})` }"
  >
    <slot></slot>

    <div class="flex items-center gap-1">
      <img :src="player.image" width="40" height="40" class="h-10 w-10" />
      <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ player.name }}
      </h5>
    </div>

    <div class="flex grow flex-col justify-center gap-1">
      <template v-if="pointDiff === 0">
        <InputCommafyNumber
          v-model.lazy="player.point"
          class="w-full items-center justify-center text-center text-3xl"
          type="number"
          :step="game.step"
        >
        </InputCommafyNumber>
      </template>
      <template v-else>
        <div class="relative flex items-center justify-between gap-2">
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

          <div class="text-3xl">
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
        <div class="ml-[60px] inline-flex flex-1 gap-1">
          <div v-for="i of [1, 10]" :key="i" class="flex-1">
            <button
              class="w-full rounded-md border bg-white px-2 py-1 text-sm text-gray-900 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              :class="[
                isPlus
                  ? 'border-blue-400 hover:bg-blue-100 hover:shadow-[0_0_2px_2px_rgba(96,165,250,0.25)] focus:bg-blue-100 focus:shadow-[0_0_2px_2px_rgba(96,165,250,0.25)] active:bg-blue-100 active:shadow-[0_0_2px_2px_rgba(96,165,250,0.25)]'
                  : 'border-red-400 hover:bg-red-100 hover:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)] focus:bg-red-100 focus:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)] active:bg-red-100 active:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)]',
              ]"
              type="button"
              @click="
                () => {
                  player.point = player.point + (isPlus ? 1 : -1) * (game.step * i);
                }
              "
            >
              {{ isPlus ? '+' : '-' }}{{ (game.step * i).toLocaleString() }}
            </button>
          </div>
        </div>

        <TogglePlusMinus v-model="isPlus"></TogglePlusMinus>
      </div>
    </div>
  </div>
</template>
