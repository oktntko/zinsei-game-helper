<script setup lang="ts">
import type { games, players } from '~/db/schema';

const game = defineModel<typeof games.$inferSelect>({ required: true });
const player_list = defineModel<(typeof players.$inferSelect)[]>('player_list', { required: true });

useTitle(`あそび | ${game.value.name}`);
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

    <main class="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
      <div
        v-for="player of player_list"
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
              v-model="player.point"
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

    <footer
      class="z-10 flex h-12 shrink-0 justify-center rounded-t-sm bg-white/70 text-gray-900 shadow backdrop-blur"
    >
      <div class="ms-6 flex h-full flex-1 justify-center">
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
        >
          <span
            class="icon-[mynaui--redo-solid] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
          ></span>
          <span class="text-xs"> やりなおす </span>
        </button>
        <button
          type="button"
          class="group/item inline-flex flex-1 flex-col items-center justify-center"
        >
          <span
            class="icon-[formkit--submit] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
          ></span>
          <span class="text-xs"> つぎへ </span>
        </button>
      </div>

      <button type="button" class="relative w-16">
        <Roulette
          class="absolute bottom-[-12px] right-[-12px] h-20 w-20 -rotate-12 transition-transform duration-100 hover:scale-125"
        ></Roulette>
      </button>
    </footer>
  </div>
</template>
