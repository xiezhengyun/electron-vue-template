import { app, BrowserWindow, ipcMain, session, Menu, Tray, nativeImage } from 'electron'
import path, { join } from 'path'
import { createServe } from './utils/server'
import { setTopMenu } from './utils/setTopMenu'
import { width, height, setPosition } from './utils/setPosition'
import { initAppTray } from './utils/initAppTray'
import { setProtocolClient, handleArgv, handleUrl } from './utils/setProtocolClient'
import { checkUpdate } from './utils/checkUpdate'
import dotenv from 'dotenv'
import fs from 'fs'

let mainWindow: BrowserWindow; 
// expand env
if (app.isPackaged) {
  const envConfig = dotenv.parse(fs.readFileSync(join(app.getAppPath(), `/build/main`, `/utils/.env`) ))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

export const NODE_ENV = process.env.NODE_ENV
export const APP_INDEX_URL = process.env.APP_INDEX_URL
export const APP_UPDATE_URL = process.env.APP_UPDATE_URL

// 获取单实例锁
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  // 如果获取失败，说明已经有实例在运行了，直接退出
  app.quit();
}

export function createWindow() {
  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  })
  // "http://127.0.0.1:9005/"
  if (NODE_ENV === 'dev') {
    const rendererPort = process.argv[2]
    mainWindow.loadURL(`http://localhost:${rendererPort}`)
  } else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'))
  }

  // 顶部菜单
  setTopMenu(mainWindow)
  // 设置位置
  setPosition(mainWindow)
  // 托盘
  initAppTray()
  // 开启服务
  createServe(mainWindow)

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('change-win', '12121')
    mainWindow.webContents.send('change-win2', '222222')
    log('updateDownloading', process.env.APP_UPDATE_URL )
    // 协议打开
    setProtocolClient()
  })

  // if (process.env.NODE_ENV === 'dev') {
  mainWindow.webContents.openDevTools()
  console.log('process.env.NODE_ENV', NODE_ENV)
  // }
}

app.whenReady().then(() => {
  createWindow()

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["script-src 'self'"],
      },
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  //每次启动程序，就检查更新
  if(app.isPackaged) checkUpdate()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    // app.quit()
  }
})

// 自启动
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true,
});
// win 已经存在实例，监控协议打开
app.on('second-instance', (event, argv) => {
  showActive()
  process.argv = argv
  log('second-instance', argv)
  if (process.platform === 'win32') {
    // Windows
    handleArgv(argv);
  }
});

// macOS
app.on('open-url', (event, urlStr) => {
  showActive()
  handleUrl(urlStr);
});


ipcMain.on('message', (event, message) => {
  console.log(message)
})

ipcMain.on('counter-value', (event, value) => {
  console.log(value) // will print value to Node console
})

ipcMain.on('change-win2-back', (event, value) => {
  console.log(value) // will print value to Node console
  // event.sender.send('change-win2', 'qwqwqwqw')
})

export function log(name, val) {
  mainWindow.webContents.send(name, val)
}

export function showActive() {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    mainWindow.showInactive()
  }
}