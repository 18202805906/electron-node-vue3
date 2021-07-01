import { createApp } from 'vue';
import 'ant-design-vue/dist/antd.css';
import '@/assets/style/common.less';
import App from './App.vue';
import router from './router';
import store from './store';
import plugins from '@/plugins';
import DisableDrag from '@/mixins/DisableDrag';
import { contextmenu } from './utils/contextMenu';
import * as Icons from '@ant-design/icons-vue';
import config from '@/config';
contextmenu();

const icons = Icons;
const app = createApp(App);

app.use(plugins); // 注册插件
app.mixin([DisableDrag]);
app.use(store);
app.use(router);
app.provide('$pagination', config.pagination); // 注入分页配置
app.mount('#app');
for (const i in icons) {
  app.component(i, icons[i]);
}

export default app;
