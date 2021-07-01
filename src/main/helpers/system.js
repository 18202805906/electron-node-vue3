import { app, dialog } from 'electron';
export function checkQuit(win, event) {
  const options = {
    type: 'info',
    title: '关闭确认',
    message: '确认要最小化程序到托盘吗？',
    buttons: ['确认', '关闭程序']
  };
  dialog.showMessageBox(options).then(({ response }) => {
    if (response === 0) {
      //event.preventDefault();
      if (win) {
        win.hide();
      }
    } else {
      win = null;
      app.exit(0);
    }
  });
}
