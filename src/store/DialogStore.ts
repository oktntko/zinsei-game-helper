export const useDialogStore = defineStore('dialog', () => {
  const dialogCount = ref(0);

  function increment() {
    dialogCount.value++;
  }
  function decrement() {
    dialogCount.value--;
  }

  return { dialogCount, increment, decrement };
});
