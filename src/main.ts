import { createApp } from 'vue';
import VueLogger from 'vuejs3-logger';
import { ToastPlugin } from '@/plugins/toast/Toast';
import App from './App.vue';
import router from './router/router';
import { ModalPlugin } from './plugins/modal/Modal';

require('@/styles/Styles.scss');

const isProduction = process.env.NODE_ENV === 'production';

const options = {
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true,
};

const app = createApp(App);

app.use(VueLogger, options);
app.use(ToastPlugin);
app.use(ModalPlugin);
app.use(router);

app.mount('#app');
