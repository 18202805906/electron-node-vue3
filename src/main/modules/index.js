import ipcMain from './ipcMain';
import appMenu from './appMenu';
import appShortcut from './shortcut';
import appTray from './tray';
import themer from './themer';
//import globalData from './globalData';
//import notification from './notification';
export default (win) => {
  //global._state = globalData;
  ipcMain(win);
  appMenu(win);
  appShortcut(win);
  themer(win);
  appTray(win);
  //notification();
};
