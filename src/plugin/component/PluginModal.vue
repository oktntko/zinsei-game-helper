<script setup lang="ts">
import { useDialog } from '~/plugin/DialogPlugin';

// TODO: FunctionalComponent でその場モーダルも作れるようにする
const {
  componentClass = '',
  dialogClass = '',
  componentProps = () => ({}),
  componentEvents = () => ({}),
} = defineProps<{
  component: unknown;
  componentProps?: object;
  componentEvents?: unknown;
  componentClass?: string;
  dialogClass?: string;
}>();

const emit = defineEmits<{
  close: [data?: unknown];
}>();

const refDialog = ref<HTMLDialogElement>();
const open = ref(false);

onMounted(() => {
  refDialog.value?.showModal();
  open.value = true;
});

function closeDelay(returnValue?: unknown | undefined) {
  if (refDialog.value) {
    const dialog = refDialog.value;

    dialog.addEventListener('transitionend', (e) => {
      if (e.target === dialog) {
        dialog.close();
        emit('close', returnValue);
      }
    });

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
  <dialog
    ref="refDialog"
    :class="[
      'm-auto rounded-lg text-gray-900 shadow-xl',
      { open },
      'translate-y-4 scale-100 transform opacity-0 transition duration-200 ease-out sm:translate-y-4 sm:scale-95',
      '[&.open]:translate-y-0 [&.open]:opacity-100 [&.open]:sm:scale-100',
      'backdrop:bg-gray-400/50 backdrop:opacity-0 backdrop:transition backdrop:duration-200 backdrop:ease-out',
      '[&.open]:backdrop:opacity-100',
      dialogClass,
    ]"
    @click="
      (e) => {
        // ダイアログの外側がクリックされたとき閉じる
        if (e.target === refDialog) {
          e.preventDefault();
          closeDelay();
        }
      }
    "
    @cancel="
      (e: Event) => {
        // ESCキーでキャンセルするとき閉じる
        e.preventDefault();
        closeDelay();
      }
    "
  >
    <Suspense>
      <component
        :is="component"
        :class="componentClass"
        v-bind="componentProps"
        v-on="componentEvents"
        @close="(data: unknown) => closeDelay(data)"
      />

      <template #fallback>
        <div class="flex h-full w-full grow flex-col items-center justify-center gap-4">
          <span class="icon-[line-md--loading-loop] text-opacity-60 h-16 w-16 text-gray-600"></span>
          <span class="animate-pulse">ちょっとまってね</span>
        </div>
      </template>
    </Suspense>
    <button
      type="button"
      class="absolute top-2 right-2 h-6 w-6 cursor-pointer rounded-full bg-transparent text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-500 dark:hover:text-white"
      aria-label="Close"
      @click="closeDelay()"
    >
      <span class="icon-[bi--x] h-6 w-6" />
    </button>
  </dialog>
</template>
