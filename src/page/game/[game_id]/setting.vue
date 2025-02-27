<script setup lang="ts">
import type { games, players } from '~/db/schema';

const game = defineModel<typeof games.$inferSelect>({ required: true });
const player_list = defineModel<(typeof players.$inferSelect)[]>('player_list', { required: true });

useTitle(`せってい | ${game.value.name}`);
</script>

<template>
  <div class="flex h-lvh flex-col overflow-hidden">
    <header class="z-10 shrink-0 rounded-b-sm bg-gray-600 shadow-sm">
      <div class="container mx-auto flex max-w-xl items-center justify-center gap-2 px-2 py-2">
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
      </div>
    </header>

    <div class="flex shrink-0 justify-center gap-4 bg-gray-50 p-2 text-gray-800 shadow-sm">
      <RouterLink
        :to="{
          name: '/game/[game_id]/setting/',
          params: { game_id: game.game_id },
        }"
        class="group/item inline-flex items-center justify-center gap-1 rounded-sm p-2"
        exact-active-class="text-blue-500 bg-blue-100/50"
      >
        <div
          class="icon-[simple-icons--gamejolt] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
        ></div>
        <div class="text-sm">ゲーム</div>
      </RouterLink>
      <RouterLink
        :to="{
          name: '/game/[game_id]/setting/player',
          params: { game_id: game.game_id },
        }"
        class="group/item inline-flex items-center justify-center gap-1 rounded-sm p-2"
        exact-active-class="text-blue-500 bg-blue-100/50"
      >
        <div
          class="icon-[emojione-monotone--family-man-woman-girl-girl] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
        ></div>
        <div class="text-sm">あそぶひと</div>
      </RouterLink>
    </div>

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
                <div class="flex min-h-lvh grow flex-col items-center justify-center gap-4">
                  <span
                    class="icon-[line-md--loading-loop] h-16 w-16 text-gray-600 text-opacity-60"
                  ></span>
                  <span class="animate-pulse">ちょっとまってね</span>
                </div>
              </template>
            </Suspense>
          </KeepAlive>
        </Transition>
      </template>
    </RouterView>
  </div>
</template>
