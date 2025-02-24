<script setup lang="ts">
import { BASE_URL } from '~/const';
import { games, players } from '~/db/schema';
import ModalEditMyhome from './ModalEditMyhome.vue';
import ModalEditNumber from './ModalEditNumber.vue';

const props = defineProps<{
  game: typeof games.$inferSelect;
  current: typeof players.$inferSelect;
}>();

const player = defineModel<typeof players.$inferSelect>('player', { required: true });
const turn = defineModel<number>('turn', { required: true });

const mul = ref<1 | 10>(1);

const pointDiff = computed(() => {
  return player.value.point - props.current.point;
});

const refRadio = ref<HTMLInputElement>();
watchEffect(() => {
  if (turn.value === player.value.order) {
    refRadio.value?.focus();
  }
});
</script>

<template>
  <div
    class="relative flex w-full grow flex-col justify-center gap-2 rounded bg-white transition-colors"
    :class="[turn === player.order ? 'border-8 p-3 sm:p-6' : 'border-4 p-4 sm:p-7']"
    :style="{
      'border-color': turn === player.order ? `rgb(${player.color})` : `rgba(${player.color},0.6)`,
    }"
  >
    <!-- ターン -->
    <label
      class="triangle absolute left-0 top-0 inline-flex cursor-pointer transition-colors"
      :class="[
        turn === player.order ? 'w-11 bg-green-400' : 'w-12 bg-green-400/10 hover:bg-green-400/50',
      ]"
    >
      <input
        ref="refRadio"
        v-model="turn"
        type="radio"
        class="absolute opacity-0"
        :value="player.order"
      />
    </label>

    <!-- イラスト／けっこん・こども／なまえ／マイホーム -->
    <div class="grid grid-cols-[80px_1fr_40px] grid-rows-[40px_16px] gap-2 px-2">
      <div class="inline-flex items-center justify-center">
        <img title="イラスト" :src="player.image" width="40" height="40" />
        <button
          type="button"
          class="-ml-2 transition-all hover:scale-110"
          :class="[
            !game.enable_marry
              ? 'invisible'
              : player.is_married
                ? ''
                : 'opacity-10 grayscale hover:opacity-50 hover:filter-none',
          ]"
          @click="
            async () => {
              const yes = await $dialog.open({
                icon: player.is_married
                  ? 'icon-[lets-icons--broken-heart-duotone]'
                  : 'icon-[mdi--heart]',
                colorset: 'blue',
                autofocus: 'confirm',
                cancelText: 'いいえ',
                confirmText: 'はい',
                message: player.is_married ? 'けっこんをやめる？' : 'けっこんした？',
              });

              if (yes) {
                player.is_married = !player.is_married;
              }
            }
          "
        >
          <img
            title="けっこん"
            :src="`${BASE_URL}images/kohacu.com_samune_003545.png`"
            width="40"
            height="40"
          />
        </button>
      </div>

      <div
        class="mx-2 truncate text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
        title="なまえ"
      >
        {{ player.name }}
      </div>

      <button
        type="button"
        class="row-span-2 inline-flex flex-col items-center justify-center transition-all hover:scale-110"
        :class="[
          !game.enable_myhome
            ? 'invisible'
            : player.myhome?.value
              ? ''
              : 'opacity-10 grayscale hover:opacity-50 hover:filter-none',
        ]"
        title="マイホーム"
        @click="
          async () => {
            const data = await $modal.open<typeof players.$inferSelect.myhome>({
              component: ModalEditMyhome,
              componentProps: {
                image: player.myhome?.image,
                value: player.myhome?.value,
              },
            });

            if (data != null) {
              player.myhome = data;
            }
          }
        "
      >
        <img
          :src="player.myhome?.image ?? `${BASE_URL}images/housing_01.gif`"
          width="40"
          height="40"
        />
        <span class="text-xs" :class="[player.myhome?.value ? '' : 'invisible']">
          {{ player.myhome?.value.toLocaleString() ?? '' }}
        </span>
      </button>

      <div class="col-span-2 overflow-hidden">
        <button
          type="button"
          class="inline-flex items-center gap-px transition-all hover:scale-110"
          :class="[
            !game.enable_marry
              ? 'invisible'
              : player.children
                ? ''
                : 'opacity-10 grayscale hover:opacity-50 hover:filter-none',
          ]"
          title="こども"
          @click="
            async () => {
              if (player.children <= 0) {
                const yes = await $dialog.open({
                  icon: 'icon-[mdi--heart]',
                  colorset: 'blue',
                  autofocus: 'confirm',
                  cancelText: 'いいえ',
                  confirmText: 'はい',
                  message: 'こどもがうまれた？',
                });

                if (yes) {
                  player.children = 1;
                }
                return;
              } else {
                const data = await $modal.open<number>({
                  component: ModalEditNumber,
                  componentProps: {
                    title: 'こども',
                    data: player.children,
                    unit: '人',
                  },
                });

                if (data != null) {
                  player.children = data;
                }
              }
            }
          "
        >
          <img
            v-for="(_, i) of Array.from({ length: player.children <= 0 ? 1 : player.children })"
            :key="i"
            :src="`${BASE_URL}images/kohacu.com_samune_003545.png`"
            width="16"
            height="16"
          />
        </button>
      </div>
    </div>

    <div class="flex grow flex-col justify-center gap-2">
      <!-- ポイント表示 そのまま ⇔ 計算式 -->
      <template v-if="pointDiff === 0">
        <InputCommafyNumber
          v-model.lazy="player.point"
          class="w-full items-center justify-center text-center text-3xl leading-none"
          type="number"
          :step="game.step"
        >
        </InputCommafyNumber>
      </template>
      <template v-else>
        <div class="relative flex items-end justify-center gap-2">
          <div class="text-2xl">
            {{ current.point.toLocaleString() }}
          </div>

          <div class="text-xl" :class="[pointDiff > 0 ? 'text-blue-600' : 'text-red-600']">
            {{ pointDiff > 0 ? '+' : '-' }}
          </div>

          <div class="text-2xl" :class="[pointDiff > 0 ? 'text-blue-600' : 'text-red-600']">
            {{ Math.abs(pointDiff).toLocaleString() }}
          </div>

          <div class="text-xl">=</div>

          <div class="max-w-40 text-3xl leading-none">
            <!-- https://codepen.io/regic/pen/pyyKbd -->
            <InputCommafyNumber
              v-model="player.point"
              class="w-full text-center"
              type="number"
              :step="game.step"
            >
            </InputCommafyNumber>
          </div>

          <button
            type="button"
            class="absolute -right-4 -top-3 h-6 w-6 rounded-full bg-transparent text-gray-400 transition-colors hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-500 dark:hover:text-white"
            @click="
              async () => {
                if (await $dialog.confirm(`${player.name} の ポイント をもとにもどしますか？`)) {
                  player.point = current.point;
                }
              }
            "
          >
            <span class="icon-[bi--x] h-6 w-6" />
          </button>
        </div>
      </template>

      <!-- ポイントの加算・減算 -->
      <div class="flex items-center justify-center gap-2">
        <!-- ×金額 -->
        <div class="flex items-center justify-center gap-2">
          <label
            v-for="i of [1, 10]"
            :key="i"
            class="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full font-medium shadow-[0_0_2px_1px_rgba(0,0,0,0.25)] transition-all"
            :class="[mul === i ? `scale-125` : 'scale-90', 'hover:bg-gray-100']"
          >
            <span class="icon-[uim--multiply] text-xs"></span>
            <span class="-ml-0.5 text-xs">{{ i }}</span>
            <input v-model="mul" type="radio" :value="i" class="sr-only" />
          </label>
        </div>

        <!-- プラスマイナス -->
        <div class="flex items-center justify-center gap-2">
          <button
            v-for="sign of [-1, 1]"
            :key="sign"
            class="w-20 rounded-lg border bg-white px-2 py-1 text-base text-gray-900 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            :class="[
              sign > 0
                ? 'border-green-400 hover:bg-green-100 hover:shadow-[0_0_2px_2px_rgba(74,222,128,0.25)] focus:bg-green-100 focus:shadow-[0_0_2px_2px_rgba(74,222,128,0.25)] active:bg-green-100 active:shadow-[0_0_2px_2px_rgba(74,222,128,0.25)]'
                : 'border-red-400 hover:bg-red-100 hover:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)] focus:bg-red-100 focus:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)] active:bg-red-100 active:shadow-[0_0_2px_2px_rgba(248,113,113,0.25)]',
            ]"
            type="button"
            @click="
              () => {
                player.point = player.point + game.step * sign * mul;
              }
            "
          >
            {{ sign > 0 ? '+' : '' }}{{ (game.step * sign * mul).toLocaleString() }}
          </button>
        </div>
      </div>
    </div>

    <!-- 株券・保険証券 -->
    <div class="flex justify-between">
      <!-- 保険証券 -->
      <div class="inline-flex items-center justify-center">
        <button
          type="button"
          class="relative h-10 w-10 text-green-600 transition-all hover:scale-110"
          :class="[
            !game.enable_kabukenn
              ? 'invisible'
              : player.seimei_hokenn
                ? ''
                : 'opacity-10 grayscale hover:opacity-50 hover:filter-none',
          ]"
          title="せいめいほけん"
          @click="
            async () => {
              const yes = await $dialog.open({
                icon: player.seimei_hokenn
                  ? 'icon-[uit--shield-slash]'
                  : 'icon-[uit--shield-check]',
                colorset: 'blue',
                autofocus: 'confirm',
                cancelText: 'いいえ',
                confirmText: 'はい',
                message: player.seimei_hokenn
                  ? 'せいめいほけんが なくなった？'
                  : 'せいめいほけんに はいった？',
              });

              if (yes) {
                player.seimei_hokenn = !player.seimei_hokenn;
              }
            }
          "
        >
          <span class="icon-[mdi--shield-outline] absolute inset-0 m-auto h-10 w-10"></span>
          <span class="icon-[mdi--heart] absolute inset-0 m-auto h-6 w-6"></span>
        </button>
        <button
          type="button"
          class="relative h-10 w-10 text-green-600 transition-all hover:scale-110"
          :class="[
            !game.enable_kabukenn
              ? 'invisible'
              : player.kasai_hokenn
                ? ''
                : 'opacity-10 grayscale hover:opacity-50 hover:filter-none',
          ]"
          title="かさいほけん"
          @click="
            async () => {
              const yes = await $dialog.open({
                icon: player.kasai_hokenn ? 'icon-[uit--shield-slash]' : 'icon-[uit--shield-check]',
                colorset: 'blue',
                autofocus: 'confirm',
                cancelText: 'いいえ',
                confirmText: 'はい',
                message: player.kasai_hokenn
                  ? 'かさいほけんが なくなった？'
                  : 'かさいほけんに はいった？',
              });

              if (yes) {
                player.kasai_hokenn = !player.kasai_hokenn;
              }
            }
          "
        >
          <span class="icon-[mdi--shield-outline] absolute inset-0 m-auto h-10 w-10"></span>
          <span class="icon-[mdi--fire] absolute inset-0 m-auto h-6 w-6"></span>
        </button>
        <button
          type="button"
          class="relative h-10 w-10 text-green-600 transition-all hover:scale-110"
          :class="[
            !game.enable_kabukenn
              ? 'invisible'
              : player.zidousya_hokenn
                ? ''
                : 'opacity-10 grayscale hover:opacity-50 hover:filter-none',
          ]"
          title="じどうしゃほけん"
          @click="
            async () => {
              const yes = await $dialog.open({
                icon: player.zidousya_hokenn
                  ? 'icon-[uit--shield-slash]'
                  : 'icon-[uit--shield-check]',
                colorset: 'blue',
                autofocus: 'confirm',
                cancelText: 'いいえ',
                confirmText: 'はい',
                message: player.zidousya_hokenn
                  ? 'じどうしゃほけんが なくなった？'
                  : 'じどうしゃほけんに はいった？',
              });

              if (yes) {
                player.zidousya_hokenn = !player.zidousya_hokenn;
              }
            }
          "
        >
          <span class="icon-[mdi--shield-outline] absolute inset-0 m-auto h-10 w-10"></span>
          <span class="icon-[mdi--car] absolute inset-0 m-auto h-6 w-6"></span>
        </button>
      </div>

      <!-- 株券 -->
      <div class="inline-flex items-center justify-center gap-2">
        <button
          type="button"
          class="relative inline-flex h-10 w-10 flex-col items-center justify-center transition-all hover:scale-110"
          :class="[
            !game.enable_syakkinn_yakusoku_tegata
              ? 'invisible'
              : player.yakusoku_tegata
                ? ''
                : 'opacity-10 grayscale hover:opacity-50 hover:filter-none',
          ]"
          title="やくそくてがた"
          @click="
            async () => {
              const data = await $modal.open<number>({
                component: ModalEditNumber,
                componentProps: {
                  title: 'やくそくてがた',
                  data: player.yakusoku_tegata,
                  unit: '枚',
                },
              });

              if (data != null) {
                player.yakusoku_tegata = data;
              }
            }
          "
        >
          <span
            class="icon-[clarity--dollar-bill-solid] absolute inset-0 m-auto h-10 w-10 text-red-600"
          ></span>
          <span
            class="absolute -bottom-3 text-xs"
            :class="[player.yakusoku_tegata ? '' : 'invisible']"
          >
            {{ player.yakusoku_tegata?.toLocaleString() ?? '' }}
          </span>
        </button>

        <button
          type="button"
          class="relative inline-flex h-10 w-10 flex-col items-center justify-center transition-all hover:scale-110"
          :class="[
            !game.enable_kabukenn
              ? 'invisible'
              : player.kabukenn
                ? ''
                : 'opacity-10 grayscale hover:opacity-50 hover:filter-none',
          ]"
          title="かぶけん"
          @click="
            async () => {
              const data = await $modal.open<number>({
                component: ModalEditNumber,
                componentProps: {
                  title: 'かぶけん',
                  data: player.kabukenn,
                  unit: '枚',
                },
              });

              if (data != null) {
                player.kabukenn = data;
              }
            }
          "
        >
          <span class="icon-[noto--root-vegetable] absolute inset-0 m-auto h-10 w-10"></span>
          <span class="absolute -bottom-3 text-xs" :class="[player.kabukenn ? '' : 'invisible']">
            {{ player.kabukenn?.toLocaleString() ?? '' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.triangle {
  aspect-ratio: 1;
  clip-path: polygon(0 0, 100% 0, 0 100%);
}
</style>
