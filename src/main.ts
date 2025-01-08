import { createApp } from 'vue';
import App from '~/App.vue';
import router from '~/lib/router';
import '~/main.css';
import DialogPlugin from '~/plugin/DialogPlugin';
import LoadingPlugin from '~/plugin/LoadingPlugin';
import ModalPlugin from '~/plugin/ModalPlugin';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(DialogPlugin);
app.use(LoadingPlugin);
app.use(ModalPlugin);

app.mount('#app');
