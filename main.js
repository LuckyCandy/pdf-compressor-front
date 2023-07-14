// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const registration = require('./registration')


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 532,
    height: 290,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('dist/index.html')
  return mainWindow
}

app.whenReady().then(() => {
  // Register IPC Handler
  registration(createWindow())
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // if (BrowserWindow.getAllWindows().length === 0) registration(createWindow())
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  app.quit()
})