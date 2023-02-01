

import { app, BrowserWindow, ipcMain, session, Menu, Tray, nativeImage } from 'electron'
import path, { join } from 'path'
import { showActive } from '../main';
import { log } from '../main';

const PROTOCOL = 'pacsclient'

// 协议打开
export function setProtocolClient() {
  // 协议
  if (!app.isDefaultProtocolClient(PROTOCOL)) {
    const args: string[] = [];
    if (!app.isPackaged) {
      // 如果是开发阶段，需要把我们的脚本的绝对路径加入参数中
      args.push(path.resolve(process.argv[1]));
    }
    args.push('--');
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args)

    handleArgv(process.argv);
  }
}

export function handleArgv(argv) {
  log('handleArgv', argv)
  const prefix = `${PROTOCOL}:`;
  const offset = app.isPackaged ? 1 : 2;
  const url = argv.find((arg, i) => i >= offset && arg.startsWith(prefix));
  if (url) handleUrl(url);
}

export function handleUrl(urlStr) {
  log('handleUrl-urlStr', urlStr)
  // myapp://?name=1&pwd=2
  const urlObj = new URL(urlStr);
  const { searchParams } = urlObj;
  console.log(urlObj.search); // -> ?name=1&pwd=2
}