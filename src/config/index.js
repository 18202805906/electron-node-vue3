import { remote, app } from 'electron';
const APP = process.type === 'renderer' ? remote.app : app;
const env = process.env;
const IS_PRODUCTION = env.NODE_ENV === 'production';

const apiHost = IS_PRODUCTION ? env.VUE_APP_API_HOST : env.VUE_APP_API_PREFIX;
export default {
  appTitle: '凯旭订单管理系统',
  appAuthor: '谢小前端',
  appVersion: APP.getVersion(),
  userPath: APP.getPath('userData'),
  homePath: APP.getPath('home'),
  // git地址
  downloadUrl: 'https://api.github.com/repos/18202805906/electron-node-vue3/releases',
  releaseUrl: 'https://api.github.com/repos/18202805906/electron-node-vue3/releases/latest',
  repositoryUrl: 'https://github.com/18202805906/electron-node-vue3',
  issuesUrl: 'https://github.com/18202805906/electron-node-vue3/issues',
  docsUrl: 'https://github.com//18202805906/electron-node-vue3',
  iconUrl: '/iconfont/iconfont.js',
  themeList: {
    system: {
      icon: 'system',
      next: 'light',
      title: '跟随系统',
      name: 'system'
    },
    light: {
      icon: 'light',
      next: 'dark',
      title: '明亮模式',
      name: 'light'
    },
    dark: {
      icon: 'dark',
      next: 'system',
      title: '暗黑模式',
      name: 'dark'
    }
  },
  pagination: {
    showSizeChanger: false,
    showQuickJumper: true,
    size: 'large',
    current: 1,
    pageSize: 10,
    total: 0
  },
  tokenKey: 'token', // token在cookie中的key
  apiHost
};
