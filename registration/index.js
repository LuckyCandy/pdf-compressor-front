const { ipcMain } = require('electron')
const { dialog } = require('electron');
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process');
// const { exec } = require('child_process');

const executeFile = path.resolve(__dirname, '../cmds', 'pdfc')
const register = (win) => {
  // 选择文件或路径
  ipcMain.handle('CHANNEL_FILE_UPLOAD', () => {
    // exec('pwd', (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`执行命令出错: ${error}`);
    //     return;
    //   }
    //   console.log(`命令输出: ${stdout}`);
    // });
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
    

    console.log('1111111111', executeFile, [paramObject.targetDir, paramObject.imgDpi, paramObject.pageNo]);
    const cmd = spawn(executeFile, [paramObject.targetDir, paramObject.imgDpi, paramObject.pageNo]);

    // 监听命令的标准输出
    cmd.stdout.on('data', (data) => {
      console.log('stdout', data)
      win.webContents.send('CHANNEL_EXECUTE_COMPRESS_INFO', JSON.stringify({
        start: true, message: data.toString('utf-8'), type: 'warning'
      }))
    });

    // 监听命令的标准错误输出
    cmd.stderr.on('data', (data) => {
      console.log('stderr', data)
      win.webContents.send('CHANNEL_EXECUTE_COMPRESS_INFO', JSON.stringify({
        start: true, message: data.toString('utf-8'), type: 'error'
      }))
    });

    // 监听命令的退出事件
    cmd.on('close', (code) => {
      console.log('close', code)
      win.webContents.send('CHANNEL_EXECUTE_COMPRESS_INFO', JSON.stringify({
        start: false, message: '已停止', type: 'info'
      }))
    });
  })
}

module.exports = register
