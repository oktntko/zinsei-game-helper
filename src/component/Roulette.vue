<script setup lang="ts">
const { size = 10 } = defineProps<{ size?: number }>();
</script>

<template>
  <div>
    <div class="ui-wheel-of-fortune" :style="{ '--_items': size }">
      <ul ref="wheel">
        <li v-for="(_, i) of Array.from({ length: size })" :key="i">
          <div>
            <span class="inline-block -rotate-90">{{ i + 1 }}</span>
          </div>
        </li>
      </ul>
      <div
        :class="[
          'aspect-square place-self-center rounded-full border-none bg-white/80',
          'w-[20cqi]',
          'transition-colors duration-150 disabled:cursor-wait disabled:bg-gray-100/80 disabled:text-gray-500',
        ]"
      ></div>
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
    height: 8cqi;
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
      color: gray;
      font-size: 12cqi;
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
