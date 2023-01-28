/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  sendMessage: (message: string) => void
  handleCounter: (function)
  changeWin: (function) 
}

declare global {
  interface Window {
    electronAPI: ElectronApi,
    ipcRenderer: import('electron').IpcRenderer
  }
}
