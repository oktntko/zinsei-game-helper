<script setup lang="ts">
import { useDialog } from '~/plugin/DialogPlugin';

// TODO: FunctionalComponent でその場モーダルも作れるようにする
withDefaults(
  defineProps<{
    component: unknown;
    componentProps?: object;
    componentEvents?: unknown;
    componentClass?: string;
    dialogClass?: string;
  }>(),
  {
    componentClass: '',
    dialogClass: '',
    componentProps: () => ({}),
    componentEvents: () => ({}),
  },
);

const emit = defineEmits<{
  close: [data?: unknown];
}>();

const refDialog = ref<HTMLDialogElement>();
const open = ref(false);

onMounted(() => {
  if (refDialog.value) {
    const dialog = refDialog.value;
    dialog.showModal();

    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeDelay();
    });

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        closeDelay();
      }
    });

    open.value = true;
  }
});

function closeDelay(returnValue?: unknown | undefined) {
  if (refDialog.value) {
    const dialog = refDialog.value;

    dialog.addEventListener(
      'transitionend',
      () => {
        dialog.close();
        emit('close', returnValue);
      },
      { once: true },
    );

    open.value = false;
  } else {
    emit('close', returnValue);
  }
}

// TODO お試し
// https://ja.vuejs.org/api/composition-api-lifecycle#onerrorcaptured
const $dialog = useDialog();
onErrorCaptured((message: string) => {
  $dialog.alert(message);
  closeDelay();
  return false;
});
</script>

<template>
  <dialog ref="refDialog" :class="['rounded-lg text-gray-900 shadow-xl', { open }, dialogClass]">
    <Suspense>
      <component
        :is="component"
        :class="componentClass"
        v-bind="componentProps"
        v-on="componentEvents"
        @close="(data: unknown) => closeDelay(data)"
      />

      <template #fallback>
        <div class="flex max-w-3xl grow flex-col items-center justify-center gap-4">
          <span class="icon-[ line-md:loading-loop] h-16 w-16 text-gray-600 text-opacity-60"></span>
          <span class="animate-pulse">Loading...</span>
        </div>
      </template>
    </Suspense>
    <button
      type="button"
      class="absolute right-2 top-2 h-6 w-6 rounded-full bg-transparent text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-500 dark:hover:text-white"
      aria-label="Close"
      @click="closeDelay()"
    >
      <span class="icon-[bi--x] h-6 w-6" />
    </button>
  </dialog>
</template>

<style scoped lang="postcss">
dialog {
  @apply translate-y-4 transform opacity-0 transition duration-200 ease-out sm:translate-y-0 sm:scale-95;
}

dialog.open {
  @apply translate-y-0 opacity-100 sm:scale-100;
}

dialog::backdrop,
dialog + .backdrop {
  @apply bg-gray-400/50 opacity-0 transition duration-150 ease-out;
}

dialog.open::backdrop,
dialog.open + .backdrop {
  @apply opacity-100;
}
</style>
