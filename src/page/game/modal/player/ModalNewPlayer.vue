<script setup lang="ts">
import { db } from '~/db';
import { players } from '~/db/schema';
import PlayerForm from '~/page/game/modal/player/component/PlayerForm.vue';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const emit = defineEmits<{
  close: [typeof players.$inferSelect];
}>();

const props = defineProps<{
  game_id: string;
  order: number;
  initial_color: string;
  initial_image: string;
  exists_colors: string[];
  exists_images: string[];
}>();

const modelValue = ref<typeof players.$inferInsert>({
  name: '',
  game_id: props.game_id,
  order: props.order,
  color: props.initial_color,
  image: props.initial_image,
});

const $loading = useLoading();
const $toast = useToast();

async function handleSubmit() {
  const loading = $loading.open();

  try {
    const [player] = await db.insert(players).values(modelValue.value).returning();

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
      <span class="text-blue-600 dark:text-blue-500">{{ order + 1 }}人目</span>
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
