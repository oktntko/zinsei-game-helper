<script setup lang="ts">
import { eq } from 'drizzle-orm';
import * as R from 'remeda';
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

const debounceHandleSubmit = R.funnel(handleSubmit, { minQuietPeriodMs: 1000 });

async function handleSubmit() {
  try {
    // TODO 並び替え
  } finally {
    //
  }
}

watch(
  () => modelValue,
  () => debounceHandleSubmit.call(),
  { deep: true },
);

const $dialog = useDialog();
const $loading = useLoading();
const $toast = useToast();

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
  <div class="flex flex-col gap-6 px-4 py-8">
    <section class="flex grow flex-col gap-2">
      <div
        v-for="player of player_list"
        :key="player.player_id"
        class="relative h-24 w-full rounded border-4 bg-white p-6"
        :style="{ 'border-color': `rgb(${player.color})` }"
      >
        <div class="flex items-center gap-1">
          <img :src="player.image" />
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
              const filteredPlayerList = player_list.filter(
                (x) => x.player_id !== player.player_id,
              );
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
        class="sflex-col flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500"
        @click="
          async () => {
            const exists_colors = player_list.map((x) => x.color);
            const exists_images = player_list.map((x) => x.image);

            const player = await $modal.open<typeof players.$inferSelect>({
              component: ModalNewPlayer,
              componentProps: {
                game_id: modelValue.game_id,
                order: player_list.length + 1,
                initial_color: colors
                  .map(([color]) => color)
                  .filter((color) => !exists_colors.includes(color))[0],
                initial_image: images
                  .map(([image]) => image)
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
        <span class="icon-[material-symbols--add-rounded]"></span>あそぶひと をふやす
      </button>
    </section>
  </div>
</template>
