<script setup lang="ts">
import { eq } from 'drizzle-orm';
import { db } from '~/db';
import { players } from '~/db/schema';
import { R } from '~/lib/remeda';
import PlayerForm from '~/page/game/modal/player/component/PlayerForm.vue';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const emit = defineEmits<{
  close: [typeof players.$inferSelect];
}>();

const props = defineProps<{
  player_id: string;
  exists_colors: string[];
  exists_images: string[];
}>();

const player = await db.query.players.findFirst({
  where: (players, { eq }) => eq(players.player_id, props.player_id),
});
if (!player) {
  throw 'がめんをこうしんしてください';
}

const modelValue = ref<typeof players.$inferSelect>(player);

const $loading = useLoading();
const $toast = useToast();

async function handleSubmit() {
  const loading = $loading.open();

  try {
    const [player] = await db
      .update(players)
      .set(R.omit(modelValue.value, ['player_id']))
      .where(eq(players.player_id, modelValue.value.player_id))
      .returning();

    $toast.success(`${player.name} と あそぼう！`);
    emit('close', player);
  } finally {
    loading.close();
  }
}
</script>

<template>
  <div class="p-4 sm:w-96">
    <header class="mb-4 text-lg font-bold capitalize">
      <span class="text-blue-600 dark:text-blue-500">{{ player.order + 1 }}人目</span>
      の ひと のことをおしえてね
    </header>

    <PlayerForm
      v-model="modelValue"
      :exists_colors="exists_colors"
      :exists_images="exists_images"
      @submit="handleSubmit"
    ></PlayerForm>
  </div>
</template>
