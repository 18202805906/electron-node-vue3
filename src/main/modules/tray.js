import path from 'path';
import { app, nativeImage, dialog, Menu, Tray, ipcMain, shell } from 'electron';
import config from '@/config';

const myGlobal = global;
export default (win) => {
  createTray(win);
  // app.whenReady().then(() => createTray(win));
  ipcMain.on('hideTray', () => removeTray());
  ipcMain.on('showTray', () => createTray(win));
  app.on('will-quit', removeTray);
};
// 创建tray
function createTray(win) {
  if (myGlobal._tray) return;
  myGlobal._tray = null; // 此变量保存Tray实例，需要用全局变量或挂载到其他全局对象上,否则会被回收
  // eslint-disable-next-line no-undef
  const image = nativeImage.createFromPath(path.join(__static, 'images/trayTemplate.png'));

  image.setTemplateImage(true);
  myGlobal._tray = new Tray(image); //系统托盘图标
  const menuTemplate = [
    {
      label: '帮助文档',
      click: () => openUrlWithBrowser(config.docsUrl)
    },
    {
      label: '意见反馈',
      click: () => openUrlWithBrowser(config.issuesUrl)
    },
    {
      label: '关于',
      click() {
        dialog.showMessageBox({
          title: config.appTitle,
          message: config.appTitle,
          detail: `Version: ${config.appVersion}\nAuthor: ${config.appAuthor}\nGithub: ${config.repositoryUrl}`
        });
      }
    },
    {
      type: 'separator'
    },
    {
      label: '显示/隐藏',
      click: () => toggleWindowShow(win)
    },
    // {
    //   role: 'reload',
    //   label: '重启'
    // },
    {
      role: 'quit',
      label: '退出'
    }
  ];
  const contextMenu = Menu.buildFromTemplate(menuTemplate);
  myGlobal._tray.setToolTip(config.appTitle); // 鼠标放上时候的提示
  // myGlobal._tray.setTitle('misthin');
  // 右键点击
  myGlobal._tray.on('right-click', () => {
    if (myGlobal._tray) {
      myGlobal._tray.popUpContextMenu(contextMenu);
    } // 应用菜单项
  });
  // 左键点击
  myGlobal._tray.on('click', () => {
    if (myGlobal._tray) {
      myGlobal._tray.popUpContextMenu(contextMenu);
    } // 应用菜单项
    //showWindow(win);
  });
}
// 移除tray
function removeTray() {
  if (myGlobal._tray) {
    myGlobal._tray.destroy();
  }
  myGlobal._tray = null;
}
// 隐藏窗口
function hideWindow(win) {
  win.hide();
}
// 显示窗口
function showWindow(win) {
  win.show();
}
function toggleWindowShow(win) {
  win.isVisible() ? hideWindow(win) : showWindow(win);
}
function openUrlWithBrowser(url) {
  shell.openExternal(url);
}
