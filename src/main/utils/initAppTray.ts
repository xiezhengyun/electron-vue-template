


import { app, BrowserWindow, ipcMain, session, Menu, Tray, nativeImage } from 'electron'
import path, { join } from 'path'
import { showActive } from '../main';

let trayIconPath: any;
let appTray: Tray;

// 托盘
export function initAppTray() {
  if (appTray) return
  // 系统托盘右键菜单
  const trayMenuTemplate = [
    {
      label: '退出',
      click: function () {
        app.quit();
      }
    }
  ];
  // 系统托盘图标目录
  trayIconPath = nativeImage.createFromPath(join(app.getAppPath(), '/static/appTray.ico'));
  appTray = new Tray(trayIconPath);

  // 图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  // 设置此托盘图标的悬停提示内容
  appTray.setToolTip('pacs客户端');
  appTray.on('click', function (event) {
    console.log('BrowserWindow.getAllWindows().length', BrowserWindow.getAllWindows().length)
    showActive()
  })

  // 设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu);
}
