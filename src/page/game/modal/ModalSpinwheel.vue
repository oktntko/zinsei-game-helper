<script setup lang="ts">
const { size = 10 } = defineProps<{ size?: 6 | 10 | 12 }>();

const wheel = ref<HTMLUListElement>();

const data = ref<{
  degree: number;
  spinResult: number;
  spinning: boolean | undefined;
}>({
  degree: 0,
  spinResult: 1,
  spinning: undefined,
});

const animation = ref<Animation>();

function spin() {
  if (!wheel.value) {
    return;
  }

  data.value.spinning = true;
  for (const li of Array.from(wheel.value.children)) {
    li.classList.remove('highlight');
  }

  const addDegree = Math.random() * 360 + 1800;
  const newDegree = data.value.degree + addDegree;

  animation.value = wheel.value.animate(
    [
      { transform: `rotate(${data.value.degree}deg)` }, //
      { transform: `rotate(${newDegree}deg)` }, //
    ],
    {
      duration: 3000,
      direction: 'normal',
      easing: 'cubic-bezier(0.5, -0.25, 0.000, 1.005)',
      fill: 'forwards',
      iterations: 1,
    },
  );

  function callback(_: AnimationPlaybackEvent) {
    data.value.spinning = false;
    animation.value = undefined;

    wheel.value?.children[data.value.spinResult - 1].classList.add('highlight');
  }
  animation.value.onfinish = callback;
  animation.value.oncancel = callback;
  animation.value.onremove = callback;

  data.value.degree = newDegree;
  const rotate = Math.abs((data.value.degree % 360) /* 360°以内の値に直す */ - 360); // 直感的な回転量に直す;
  data.value.spinResult = Math.trunc(rotate / (360 / size)) + 1; // １つあたりの角度から止まった数値を割り出す
}

function cancel() {
  animation.value?.finish();
}

onMounted(() => {
  setTimeout(spin, 180);
});
</script>

<template>
  <div class="flex flex-col items-center justify-center overflow-hidden px-8 pt-12 pb-4">
    <div class="h-80 w-80 rounded-full shadow-[0_0_4px_4px_rgba(0,0,0,0.25)] sm:h-96 sm:w-96">
      <div class="ui-wheel-of-fortune" :style="{ '--_items': size }">
        <ul ref="wheel">
          <li v-for="(_, i) of Array.from({ length: size })" :key="i">
            <div>
              <span class="inline-block -rotate-90">{{ i + 1 }}</span>
            </div>
          </li>
        </ul>
        <button
          type="button"
          :class="[
            'aspect-square cursor-pointer place-self-center rounded-full border-none bg-white/80',
            'w-[20cqi]',
            'transition-colors duration-150 disabled:cursor-wait disabled:bg-gray-100/80 disabled:text-gray-500',
          ]"
          @click="() => (data.spinning ? cancel() : spin())"
        >
          {{ data.spinning ? '' : 'まわす' }}
        </button>
      </div>
    </div>
    <div class="relative py-4 text-3xl">
      <span v-if="data.spinning === false" class="ml-16 font-bold text-blue-600 dark:text-blue-500">
        {{ data.spinResult }}
        <span class="text-sm text-gray-900"> が でたよ</span>
      </span>
      <span
        v-else
        class="animate-pulse text-gray-300"
        :class="[data.spinning === undefined ? 'invisible' : '']"
      >
        ...
      </span>
    </div>
  </div>
</template>

<style scoped>
/* https://dev.to/madsstoumann/wheel-of-fortune-with-css-p-pi-1ne9 */
:where(.ui-wheel-of-fortune) {
  all: unset;
  aspect-ratio: 1 / 1;
  container-type: inline-size;
  direction: ltr;
  display: grid;
  position: relative;
  width: 100%;
  &::after {
    /* 矢印 */
    aspect-ratio: 1 / cos(30deg);
    background-color: crimson;
    clip-path: polygon(50% 100%, 100% 0, 0 0);
    content: '';
    height: 4cqi;
    position: absolute;
    place-self: start center;
    scale: 1.4;
  }

  & > * {
    position: absolute;
  }

  ul {
    all: unset;
    clip-path: inset(0 0 0 0 round 50%);
    display: grid;
    inset: 0;
    place-content: center start;

    li {
      align-content: center;
      aspect-ratio: 1 / calc(2 * tan(180deg / var(--_items)));
      background: hsl(calc(360deg / var(--_items) * calc(var(--_idx))), 100%, 65%);
      clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
      display: grid;
      font-size: 8cqi;
      grid-area: 1 / -1;
      padding-left: 1ch;
      rotate: calc(
        360deg / var(--_items) * (var(--_idx) - 1) + (90deg + (360deg / var(--_items) / 2))
          /* 開始位置を min と max の間にする */
      );
      transform-origin: center right;
      user-select: none;
      width: 50cqi;

      &:nth-of-type(1) {
        --_idx: 1;
      }
      &:nth-of-type(2) {
        --_idx: 2;
      }
      &:nth-of-type(3) {
        --_idx: 3;
      }
      &:nth-of-type(4) {
        --_idx: 4;
      }
      &:nth-of-type(5) {
        --_idx: 5;
      }
      &:nth-of-type(6) {
        --_idx: 6;
      }
      &:nth-of-type(7) {
        --_idx: 7;
      }
      &:nth-of-type(8) {
        --_idx: 8;
      }
      &:nth-of-type(9) {
        --_idx: 9;
      }
      &:nth-of-type(10) {
        --_idx: 10;
      }
      &:nth-of-type(11) {
        --_idx: 11;
      }
      &:nth-of-type(12) {
        --_idx: 12;
      }
    }
  }
}
/* 点滅アニメーション */
@keyframes pulse {
  0%,
  100% {
    filter: brightness(1);
  }
  55% {
    filter: brightness(2);
  }
}

/* 強調表示用のスタイル */
.highlight {
  animation: pulse 0.3s infinite;
}
</style>
