const { dialog, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')

autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

exports.check = () => {

  // start update check
  autoUpdater.checkForUpdates()

  // listen for download (update) found
  autoUpdater.on('update-available', () => {

    // tracking progress percent
    let downloadProgress = 0

    // prompt user to update
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version of the app is available. Do you want to update now?',
      buttons: ['Update', 'No']
    }, (buttonIndex) => {

      // if not "Update" button, return
      if (buttonIndex !== 0) {
        return
      }

      // else start download and show progress in new window
      autoUpdater.downloadUpdate()

      // create progress window
      let progressWin = new BrowserWindow({
        width: 350,
        height: 35,
        useContentSize: true,
        autoHideMenuBar: true,
        maximizable: false,
        fullscreen: false,
        fullscreenable: false,
        resizable: false
      })

      // load progress html
      progressWin.loadURL(`file://${__dirname}/renderer/progress.html`)

      // handle win close
      progressWin.on('closed', () => {
        progressWin = null
      })

      // listen for progress request from progressWin
      ipcMain.on('download-progress-request', (e) => {
        e.returnValue = downloadProgress
      })

      // track download progress on autoUpdater
      autoUpdater.on('download-progress', (d) => {
        downloadProgress = d.percent

        autoUpdater.logger.info(downloadProgress)
      })

      // listen for completed update download
      autoUpdater.on('update-downloaded', () => {
        // close progressWin
        if (progressWin) {
          progressWin.close()
        }

        // prompt user to quit and install update
        dialog.showMessageBox({
          type: 'info',
          title: 'Update Ready',
          message: 'A new version of the app is ready to install. Quit and install now?',
          buttons: ['Yes', 'Later']
        }, (buttonIndex) => {

          // update if "Yes"
          if (buttonIndex === 0) {
            autoUpdater.quitAndInstall()
          }
        })
      })
    })
  })
}
