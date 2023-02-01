import { app, Menu, } from 'electron'


// 顶部菜单
export function setTopMenu(mainWindow) {
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
}