import { autoUpdater } from "electron-updater"
import { app } from 'electron';

app.on('ready', () => {
  const log = require("electron-log")
  log.transports.file.level = "debug"

  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();
});
