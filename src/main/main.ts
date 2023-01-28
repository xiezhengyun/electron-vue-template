import { app, BrowserWindow, ipcMain, session, Menu } from 'electron'
import { join } from 'path'
import { createServe } from './server'

function createWindow() {
  const width = 800
  const height = 0
  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement',
        },
      ],
    },
  ])

  Menu.setApplicationMenu(menu)

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2]
    mainWindow.loadURL(`http://localhost:${rendererPort}`)
  } else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'))
  }
  mainWindow.webContents.openDevTools()
  // 设置在最上方
  mainWindow.setAlwaysOnTop(true)
  // 让窗口不在任务栏中显示.
  mainWindow.setKiosk(false)
  // 设置title
  mainWindow.setTitle('pacs客户端')
  // 设置窗口位置，最右边
  const [w, h] = mainWindow.getPosition()
  const OSW = w * 2 + width
  const OSH = h * 2 + height
  console.log(w, h, OSW, OSH)
  mainWindow.setSize(width, OSH)
  mainWindow.setPosition(OSW - width, 0)

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('change-win', '12121')
    mainWindow.webContents.send('change-win2', 'qwqwqwqw')
  })

  // 开启服务
  createServe(mainWindow)
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
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.setLoginItemSettings({
  openAtLogin: true,
  // openAsHidden: true,
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
