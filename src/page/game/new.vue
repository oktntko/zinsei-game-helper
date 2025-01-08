<script setup lang="ts">
import { db } from '~/db';
import { games } from '~/db/schema';

const $router = useRouter();
const $route = useRoute('/game/new/[game_id]');
const game_id = $route.params.game_id;

const modelValue = ref<typeof games.$inferSelect>({
  name: '',
  description: '',
  initial_money: 3000,
  players: 4,
  roll: 10,
  game_id: '',
});

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
            <component :is="Component" v-model="modelValue"></component>

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
