'use strict';
import { app, protocol, BrowserWindow, dialog } from 'electron';
import fixPath from 'fix-path';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
// import { autoUpdater } from 'electron-updater';
//import installExtension from 'electron-devtools-installer';
import updateChecker from './helpers/updateChecker';
// import {updateHandle} from './helpers/updater';
import registerModule from './modules';
const isDevelopment = process.env.NODE_ENV !== 'production';
import config from '../config';
import path from 'path';
const fork = require('child_process').fork;

fixPath(); // 修复打包后的path
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

async function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 350,
    height: 500,
    //width: 1200,
    //height: 700,
    minWidth: 350,
    minHeight: 500,
    center: true,
    frame: true, // 不创建frameless窗口
    fullscreenable: true, // 是否允许全屏
    // show: false,  // 创建后是否显示
    backgroundColor: '#eee', // 背景颜色
    titleBarStyle: 'hidden', // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等
    resizable: true, // 是否允许拉伸大小
    transparent: true, // 是否是透明窗口（仅macOS）
    // vibrancy: 'ultra-dark', // 窗口模糊的样式（仅macOS）
    autoHideMenuBar: true,
    title: config.appTitle,
    // eslint-disable-next-line no-undef
    icon: path.join(__static, 'images/logo.png'),
    webPreferences: {
      // backgroundThrottling: false, // 当页面被置于非激活窗口的时候是否停止动画和计时器
      webSecurity: false, //跨域限制
      // sandbox: false,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js'),
      // nodeIntegrationInWorker: true,
      // nodeIntegrationInSubFrames: true,
      enableRemoteModule: true,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://../index.html');
    // 更新
    // updateHandle(win);
    updateChecker();
    // autoUpdater.checkForUpdatesAndNotify();
  }

  // 导航完成时触发，即选项卡的旋转器将停止旋转，并指派onload事件后。
  // win.webContents.on('did-finish-load', () => {
  //     // 发送数据给渲染程序
  //     win.webContents.send('reMessage', '主进程发送到渲染进程的数据');
  // });
  // 加载完成再显示
  // win.once('ready-to-show', win.show);
  // 关闭后清空win
  win.on('closed', () => {
    // event.preventDefault();
    win = null;
  });
  registerModule(win);
  // 设置dock进度条
  // win.setProgressBar(0.5);
  createServerProcess();
}

// 创建子进程
function createServerProcess() {
  console.log('dir', __dirname);
  let serverProcess;
  if (!isDevelopment) {
    // 生产环境
    // serverProcess = fork('../server/bin/www.js', [], {
    //   cwd: path.join(__dirname, '../server')
    // });
    serverProcess = fork(path.join(path.resolve(__dirname, '..'), '/server/bin/www.js'));
  } else {
    // 开发环境
    serverProcess = fork(require.resolve('../../server/bin/www.js'));
    serverProcess.on('close', (code) => {
      console.log('子线程已经退出', code);
    });
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  app.quit();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension({
  //       id: 'ljjemllljcmogpfapbkkighbhhppjdbg',
  //       electron: '>=1.2.1'
  //     });
  //     // await installExtension(VUEJS_DEVTOOLS);
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString());
  //   }
  // }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
    // app.setAppUserModelId('org.xxxx.electron') // 设置应用id，否则windows不能使用通知
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
