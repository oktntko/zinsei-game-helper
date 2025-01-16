<script setup lang="ts">
import { db } from '~/db';
import { games, players } from '~/db/schema';

const $router = useRouter();
const $route = useRoute('/game/new/[game_id]');
const game_id = $route.params.game_id;

const modelValue = ref<typeof games.$inferSelect>();
const playerList = ref<(typeof players.$inferSelect)[]>([]);

onMounted(async () => {
  const game = await db.query.games.findFirst({
    where: (games, { eq }) => eq(games.game_id, game_id),
  });

  if (!game) {
    return $router.replace({ name: '/game/' });
  }

  modelValue.value = game;
});
</script>

<template>
  <RouterView v-slot="{ Component }" class="grow">
    <template v-if="Component && modelValue">
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
              v-model="modelValue"
              v-model:players="playerList"
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
</template>
