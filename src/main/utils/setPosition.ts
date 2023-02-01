


export const width = 800
export const height = 0
// 设置位置
export function setPosition(mainWindow) {
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
}