<script setup lang="ts">
import { eq } from 'drizzle-orm';
import Sortable from 'sortablejs';
import { colors, images } from '~/const';
import { db } from '~/db';
import { games, players } from '~/db/schema';
import ModalEditPlayer from '~/page/game/modal/player/ModalEditPlayer.vue';
import ModalNewPlayer from '~/page/game/modal/player/ModalNewPlayer.vue';
import { useDialog } from '~/plugin/DialogPlugin';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const modelValue = defineModel<typeof games.$inferSelect>({ required: true });
const player_list = defineModel<(typeof players.$inferSelect)[]>('player_list', { required: true });

const sortable = ref<Sortable>();
onMounted(async () => {
  sortable.value?.destroy();

  const el = document.getElementById(`sortable-container-player`)!;

  sortable.value = Sortable.create(el, {
    animation: 150,
    handle: '.my-handle',
    chosenClass: 'chosenClass',
    dragClass: 'dragClass',

    async onEnd(e) {
      if (e.oldIndex == null || e.newIndex == null || e.oldIndex === e.newIndex) return;

      const player = player_list.value[e.oldIndex];
      const tail = player_list.value.slice(e.oldIndex + 1);

      player_list.value.splice(e.oldIndex);
      player_list.value.push(...tail);
      player_list.value.splice(e.newIndex, 0, player);

      await handleReorder();
    },
  });
});

const $dialog = useDialog();
const $loading = useLoading();
const $toast = useToast();

async function handleReorder() {
  try {
    await Promise.all(
      player_list.value.map(async (player, order) =>
        db.update(players).set({ order }).where(eq(players.player_id, player.player_id)),
      ),
    );

    $toast.info(`じゅんばん を ならびかえたよ`);
  } finally {
    //
  }
}

async function handleDelete(player: typeof players.$inferSelect) {
  const yes = await $dialog.confirm(`${player.name} をけしてもいい？`);
  if (!yes) return;

  const loading = $loading.open();
  try {
    await db.delete(players).where(eq(players.player_id, player.player_id));

    player_list.value = player_list.value.filter((x) => x.player_id !== player.player_id);

    $toast.info(`${player.name} をけしたよ`);
  } finally {
    loading.close();
  }
}
</script>

<template>
  <main
    id="sortable-container-player"
    class="container mx-auto flex max-w-xl flex-1 snap-y snap-mandatory flex-col gap-2 overflow-y-auto scroll-smooth p-2 sm:gap-2 sm:p-2"
  >
    <div
      v-for="player of player_list"
      :key="player.player_id"
      class="relative h-24 w-full rounded border-4 bg-white py-6 pe-6 ps-2"
      :style="{ 'border-color': `rgb(${player.color})` }"
    >
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="my-handle flex cursor-move items-center justify-center"
          title="handle"
          tabindex="-1"
        >
          <span class="icon-[radix-icons--drag-handle-dots-2] h-5 w-5"></span>
          <span class="sr-only capitalize">handle</span>
        </button>
        <div class="flex h-10 w-10 items-center justify-center">
          <img :src="player.image" height="40" width="40" />
        </div>
        <h5 class="truncate text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {{ player.name }}
        </h5>
      </div>

      <button
        title="trash"
        type="button"
        class="absolute bottom-2 right-10 h-6 w-6 rounded-full bg-transparent text-gray-400 transition-colors hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-500 dark:hover:text-white"
        @click="
          async () => {
            const filteredPlayerList = player_list.filter((x) => x.player_id !== player.player_id);
            const exists_colors = filteredPlayerList.map((x) => x.color);
            const exists_images = filteredPlayerList.map((x) => x.image);

            const updatedPlayer = await $modal.open<typeof players.$inferSelect>({
              component: ModalEditPlayer,
              componentProps: {
                player_id: player.player_id,
                exists_colors,
                exists_images,
              },
            });

            if (!updatedPlayer) return;

            player_list.splice(
              player_list.findIndex((x) => x.player_id === player.player_id),
              1,
              updatedPlayer,
            );
          }
        "
      >
        <span class="icon-[oui--pencil] h-6 w-6" />
      </button>
      <button
        title="trash"
        type="button"
        class="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-transparent text-gray-400 transition-colors hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-500 dark:hover:text-white"
        @click="
          async () => {
            await handleDelete(player);
          }
        "
      >
        <span class="icon-[tabler--trash] h-6 w-6" />
      </button>
    </div>

    <button
      type="button"
      class="relative flex h-24 w-full shrink-0 items-center justify-center rounded border-4 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500"
      @click="
        async () => {
          const exists_colors = player_list.map((x) => x.color);
          const exists_images = player_list.map((x) => x.image);

          const player = await $modal.open<typeof players.$inferSelect>({
            component: ModalNewPlayer,
            componentProps: {
              game_id: modelValue.game_id,
              order: player_list.length,
              initial_color: colors
                .map(({ value }) => value)
                .filter((color) => !exists_colors.includes(color))[0],
              initial_image: images
                .map(({ value }) => value)
                .filter((image) => !exists_images.includes(image))[0],
              exists_colors,
              exists_images,
            },
          });

          if (!player) return;

          player_list.push(player);
        }
      "
    >
      <span class="icon-[material-symbols--add-rounded]"></span>
      あそぶひと をふやす
    </button>
  </main>
</template>

<style lang="postcss" scoped>
.chosenClass {
  @apply bg-blue-100;
}
.dragClass {
  @apply bg-blue-100;
}
</style>
