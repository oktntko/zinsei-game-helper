<script setup lang="ts">
import { asc } from 'drizzle-orm';
import * as R from 'remeda';
import { db } from '~/db';
import { games, players } from '~/db/schema';

const $router = useRouter();
const $route = useRoute('/game/[game_id]');
const game_id = $route.params.game_id;

const game = ref<typeof games.$inferSelect>();
const player_list = ref<(typeof players.$inferSelect)[]>([]);

onMounted(async () => {
  const foundGame = await db.query.games.findFirst({
    with: {
      player_list: {
        orderBy: asc(players.order),
      },
    },
    where: (games, { eq }) => eq(games.game_id, game_id),
  });

  if (!foundGame) {
    return $router.replace({ name: '/game/' });
  }

  game.value = R.omit(foundGame, ['player_list']);
  player_list.value = R.prop(foundGame, 'player_list');
});
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component && game">
      <Transition
        mode="out-in"
        enter-from-class="transform opacity-0"
        enter-active-class="transition ease-out duration-200"
        enter-to-class="transform opacity-100"
      >
        <KeepAlive>
          <Suspense>
            <!-- main content -->
            <component :is="Component" v-model="game" v-model:player_list="player_list"></component>

            <!-- loading state -->
            <template #fallback>
              <div class="flex max-w-3xl grow flex-col items-center justify-center gap-4">
                <span
                  class="icon-[line-md:loading-loop] h-16 w-16 text-gray-600 text-opacity-60"
                ></span>
                <span class="animate-pulse">Loading...</span>
              </div>
            </template>
          </Suspense>
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>
