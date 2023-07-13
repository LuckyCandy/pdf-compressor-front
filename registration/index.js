const { ipcMain } = require('electron')
const { dialog } = require('electron');
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process');

const register = (win) => {
  // 选择文件或路径
  ipcMain.handle('CHANNEL_FILE_UPLOAD', () => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(result => {
      win.webContents.send('CHANNEL_FILE_UPLOAD_RES', result.filePaths[0])
    }).catch(err => {
      win.webContents.send('CHANNEL_FILE_UPLOAD_RES', err)
    });
  })
  // 执行压缩操作
  ipcMain.handle('CHANNEL_EXECUTE_COMPRESS', (_sender, params) => {
    var paramObject = JSON.parse(params)
    win.webContents.send('CHANNEL_EXECUTE_COMPRESS_INFO', JSON.stringify({
      start: true, message: '准备执行...', type: 'warning'
    }))
    // 处理文件

    const cmd = spawn('pdfc', [paramObject.targetDir, paramObject.imgDpi, paramObject.pageNo]);

    // 监听命令的标准输出
    cmd.stdout.on('data', (data) => {
      win.webContents.send('CHANNEL_EXECUTE_COMPRESS_INFO', JSON.stringify({
        start: true, message: data, type: 'warning'
      }))
    });

    // 监听命令的标准错误输出
    cmd.stderr.on('data', (data) => {
      win.webContents.send('CHANNEL_EXECUTE_COMPRESS_INFO', JSON.stringify({
        start: true, message: data, type: 'error'
      }))
    });

    // 监听命令的退出事件
    cmd.on('close', (code) => {
      win.webContents.send('CHANNEL_EXECUTE_COMPRESS_INFO', JSON.stringify({
        start: false, message: '已停止', type: 'info'
      }))
    });
  })
}

module.exports = register
