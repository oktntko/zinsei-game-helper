<script setup lang="ts">
import * as R from 'remeda';
import type { InputHTMLAttributes } from 'vue';

// https://ja.vuejs.org/guide/components/attrs.html#disabling-attribute-inheritance
defineOptions({ inheritAttrs: false });

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /* @vue-ignore */ InputHTMLAttributes {}
defineProps<Props>();

const modelValue = defineModel<number>({ required: true });

const input = ref<HTMLInputElement>();

const isInput = ref(false);
</script>

<template>
  <input
    v-if="isInput"
    v-bind="$attrs"
    ref="input"
    v-model.number="modelValue"
    @blur="isInput = false"
  />
  <input
    v-else
    v-bind="R.omit($attrs, ['type'])"
    type="text"
    :value="modelValue.toLocaleString()"
    @focus="
      () => {
        isInput = true;
        $nextTick(() => input?.focus());
      }
    "
  />
</template>
