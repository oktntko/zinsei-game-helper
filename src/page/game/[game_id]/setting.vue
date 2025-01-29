<script setup lang="ts">
import type { games, players } from '~/db/schema';

const game = defineModel<typeof games.$inferSelect>({ required: true });
const player_list = defineModel<(typeof players.$inferSelect)[]>('player_list', { required: true });

useTitle(`せってい | ${game.value.name}`);
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden">
    <header
      class="z-10 flex shrink-0 justify-center gap-2 rounded-b-sm bg-gray-600 px-2 py-2 shadow"
    >
      <RouterLink
        :to="{
          name: '/game/[game_id]/',
          params: {
            game_id: game.game_id,
          },
        }"
        class="group/item inline-flex flex-col items-center justify-center text-gray-300"
      >
        <div
          class="icon-[weui--back2-outlined] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
        ></div>
      </RouterLink>

      <div class="flex-1 overflow-hidden truncate text-2xl text-yellow-500">せってい</div>

      <div class="flex gap-1 text-gray-300">
        <RouterLink
          :to="{ name: '/game/[game_id]/setting/', params: { game_id: game.game_id } }"
          class="group/item inline-flex w-12 flex-col items-center justify-center"
          exact-active-class="text-blue-600"
        >
          <div
            class="icon-[simple-icons--gamejolt] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
          ></div>
          <div class="-mt-2 text-[8px] text-white">ゲーム</div>
        </RouterLink>
        <RouterLink
          :to="{ name: '/game/[game_id]/setting/player', params: { game_id: game.game_id } }"
          class="group/item inline-flex w-12 flex-col items-center justify-center"
          exact-active-class="text-blue-600"
        >
          <div
            class="icon-[emojione-monotone--family-man-woman-girl-girl] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
          ></div>
          <div class="-mt-2 text-[8px] text-white">あそぶひと</div>
        </RouterLink>
      </div>
    </header>

    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Transition
          mode="out-in"
          enter-from-class="transform opacity-0"
          enter-active-class="transition ease-out duration-200"
          enter-to-class="transform opacity-100"
        >
          <KeepAlive>
            <Suspense>
              <!-- main content -->
              <component
                :is="Component"
                v-model="game"
                v-model:player_list="player_list"
              ></component>

              <!-- loading state -->
              <template #fallback>
                <div class="flex max-w-3xl grow flex-col items-center justify-center gap-4">
                  <span
                    class="icon-[ line-md:loading-loop] h-16 w-16 text-gray-600 text-opacity-60"
                  ></span>
                  <span class="animate-pulse">Loading...</span>
                </div>
              </template>
            </Suspense>
          </KeepAlive>
        </Transition>
      </template>
    </RouterView>
  </div>
</template>
