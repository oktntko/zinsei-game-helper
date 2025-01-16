<script setup lang="ts">
import * as R from 'remeda';
import { db } from '~/db';
import { players, type games } from '~/db/schema';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const $router = useRouter();
const $route = useRoute('/game/new/[sannka_ninnzuu]/[current]');

const game = defineModel<typeof games.$inferSelect>({ required: true });
const playerList = defineModel<(typeof players.$inferSelect)[]>('players', { required: true });

const init = () => {
  const existsColors = playerList.value.map((x) => x.color);
  const existsImages = playerList.value.map((x) => x.image);

  return {
    game_id: game.value.game_id,
    name: '',
    color: colors.map(([color]) => color).filter((color) => !existsColors.includes(color))[0],
    image: images.map(([image]) => image).filter((image) => !existsImages.includes(image))[0],
    point: 0,
  };
};

const colors = [
  ['255, 55, 55', '赤'],
  ['194, 153, 103', '茶'],
  ['255, 226, 114', '黄'],
  ['255, 132, 55', 'オレンジ'],
  ['158, 225, 111', '緑'],
  ['83, 175, 254', '青'],
  ['222, 112, 255', '紫'],
  ['56, 216, 182', 'ターコイズ'],
  ['188, 205, 221', '灰'],
  ['34, 41, 49', '黒'],
  ['255, 255, 255', '白'],
  ['255, 115, 187', 'ピンク'],
];

const images = [
  ['https://hpgpixer.jp/image_icons/season/summer/mushitori_boy.gif', '男の子'],
  ['https://hpgpixer.jp/image_icons/season/school_ceremony/junior_school_girl.gif', '女の子'],
  ['https://hpgpixer.jp/image_icons/animals/animal_icon/dog/golden_retriever.gif', '犬'],
  ['https://hpgpixer.jp/image_icons/vehicle/train/shinkansen_n700_3an.gif', '新幹線'],
  ['https://hpgpixer.jp/image_icons/season/xmas/santa_2022_2an.gif', 'サンタ'],
  ['https://hpgpixer.jp/image_icons/animals/animal_icon/cat/cat_11.gif', '猫'],
  ['https://hpgpixer.jp/image_icons/etc/himawari.gif', 'ひまわり'],
  ['https://hpgpixer.jp/image_icons/vehicle/train/tramway.gif', '電車'],
  ['https://hpgpixer.jp/image_icons/etc/fox_mask.gif', '狐'],
  ['https://hpgpixer.jp/image_icons/space_fantasy/space_vihicle/shuttle.gif', 'シャトル'],
  ['https://hpgpixer.jp/image_icons/vehicle/vehicle_icon/tank_11.gif', '戦車'],
  ['https://hpgpixer.jp/image_icons/season/spring/sakura.gif', '桜'],
  ['https://hpgpixer.jp/image_icons/season/winter/yukidaruma_2.gif', '雪だるま'],
  ['https://hpgpixer.jp/image_icons/season/setsubun/oni_nomen_red_2.gif', '赤鬼'],
  ['https://hpgpixer.jp/image_icons/animals/animal_icon/mammal/horce_1.gif', '馬'],
  ['https://hpgpixer.jp/image_icons/space_fantasy/space_robot/robot.gif', 'ロボット'],
  ['https://hpgpixer.jp/image_icons/animals/animal_icon/animal_etc/monster.gif', '怪獣'],
  ['https://hpgpixer.jp/image_icons/space_fantasy/space_vihicle/ufo_9.gif', 'UFO'],
  ['https://hpgpixer.jp/image_icons/season/halloween/halloween_ghost_3.gif', 'おばけ'],
  ['https://hpgpixer.jp/image_icons/vehicle/vehicle_icon/yacht.gif', 'ヨット'],
];

const modelValue = ref<typeof players.$inferInsert>(init());

watch(
  () => $route.params.current,
  () => {
    console.log(
      'watch',
      playerList.value.map((x) => x.color),
    );
    modelValue.value = init();
  },
);

const $loading = useLoading();
const $toast = useToast();

async function handleSubmit() {
  const loading = $loading.open();

  try {
    const [player] = await db.insert(players).values(modelValue.value).returning();

    playerList.value.push(player);

    if ($route.params.sannka_ninnzuu === $route.params.current) {
      $router.replace({
        name: '/game/new/initial_money',
      });
    } else {
      $router.replace({
        name: '/game/new/[sannka_ninnzuu]/[current]',
        params: {
          sannka_ninnzuu: $route.params.sannka_ninnzuu,
          current: Number($route.params.current) + 1,
        },
      });
    }

    $toast.info(`${player.name}を作ったよ`);
  } finally {
    loading.close();
  }
}
</script>

<template>
  <div>
    <h1
      class="px-4 pb-4 pt-8 text-lg font-extrabold leading-none tracking-tight text-gray-900 dark:text-white"
    >
      <span class="text-blue-600 dark:text-blue-500">{{ $route.params.current }}人目</span>
      について教えてください
    </h1>

    <form class="flex max-w-sm flex-col gap-4 px-4 py-4" @submit.prevent="handleSubmit">
      <div class="space-y-1">
        <label for="name" class="block text-sm font-medium text-gray-900 dark:text-white">
          名前を教えてください
        </label>
        <input
          id="name"
          v-model="modelValue.name"
          type="text"
          required
          class="block w-full rounded-lg border border-gray-300 bg-white p-2 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          好きな色を教えてください
        </label>

        <div v-for="(group, i) of R.chunk(colors, 4)" :key="i" class="flex gap-6">
          <label
            v-for="[color, name] of group"
            :key="color"
            class="inline-flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300"
          >
            <input
              v-model="modelValue.color"
              type="radio"
              :value="color"
              required
              :disabled="!!playerList.find((x) => x.color === color)"
              class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              :style="{
                'accent-color': `rgb(${color})`,
              }"
            />
            <span :style="{ color: `rgb(${color})` }"> ■ </span>
            <span class="text-sm"> {{ name }} </span>
          </label>
        </div>
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-900 dark:text-white">
          好きな形を教えてください
        </label>

        <div v-for="(group, i) of R.chunk(images, 3)" :key="i" class="flex gap-6">
          <label
            v-for="[image, name] of group"
            :key="image"
            class="inline-flex items-center gap-1 text-lg font-medium text-gray-900 dark:text-gray-300"
          >
            <input
              v-model="modelValue.image"
              type="radio"
              :value="image"
              required
              :disabled="!!playerList.find((x) => x.image === image)"
              class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
            <img :src="image" />
            <span class="text-sm"> {{ name }} </span>
          </label>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="inline-flex items-center gap-0.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          <span class="icon-[carbon--continue-filled] h-4 w-4"></span>
          次へ
        </button>
      </div>
    </form>
  </div>
</template>
