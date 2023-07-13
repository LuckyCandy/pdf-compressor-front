const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipc_client', {
  invoke: async (channel, args) => await ipcRenderer.invoke(channel, args),
  removeListener: (name, ...listener) => ipcRenderer.removeListener(name, ...listener),
  addListener: (name, ...listener) => ipcRenderer.addListener(name, ...listener)
})