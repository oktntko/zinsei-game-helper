<script setup lang="ts">
import type { games, players } from '~/db/schema';

const game = defineModel<typeof games.$inferSelect>({ required: true });
const player_list = defineModel<(typeof players.$inferSelect)[]>('player_list', { required: true });
</script>

<template>
  <div class="flex h-dvh flex-col">
    <RouterView v-slot="{ Component }" class="m-2 flex grow flex-col gap-1">
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
                <div class="m-2 flex grow flex-col gap-1">
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

    <footer class="sticky bottom-0 z-10 flex h-16 shrink-0 justify-center">
      <div class="flex w-full flex-1 items-center">
        <RouterLink
          :to="{ name: '/game/[game_id]/setting/', params: { game_id: game.game_id } }"
          class="group/item w-full text-center"
          exact-active-class="text-blue-600"
        >
          <div
            class="icon-[simple-icons--gamejolt] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
          ></div>
          <div class="text-xs">ゲーム</div>
        </RouterLink>
      </div>
      <div class="flex w-full flex-1 items-center">
        <RouterLink
          :to="{ name: '/game/[game_id]/setting/player', params: { game_id: game.game_id } }"
          class="group/item w-full text-center"
          exact-active-class="text-blue-600"
        >
          <div
            class="icon-[emojione-monotone--family-man-woman-girl-girl] h-6 w-6 transition-transform duration-100 group-hover/item:scale-125"
          ></div>
          <div class="text-xs">あそぶひと</div>
        </RouterLink>
      </div>
    </footer>
  </div>
</template>
