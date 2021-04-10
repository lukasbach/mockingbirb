import path from 'path';
import { remote } from 'electron';
import { useEffect, useState } from 'react';
import fs from 'fs-extra';
import { trackEvent } from '../analytics';

export interface Settings {
  dark: boolean;
  primaryColor?: string;
  telemetry: boolean;
}

export const defaultSettings: Settings = {
  dark: true,
  telemetry: true,
}

export const appDataPath = path.join(remote.app.getPath('appData'), 'mockingbirb');
export const settingsFile = path.join(appDataPath, 'settingsfile');
export const userIdFile = path.join(appDataPath, 'userid');

export const useSettingsProvider = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    (async () => {
      await fs.ensureDir(appDataPath);
      if (!fs.existsSync(settingsFile)) {
        await fs.writeJson(settingsFile, defaultSettings);
      }
      setSettings(await fs.readJson(settingsFile));
    })();
  }, []);

  const writeSettings = (settings: Partial<Settings>) => {
    setSettings(old => {
      const newSettings = {...old, ...settings};
      fs.writeJson(settingsFile, newSettings);
      trackEvent('settings_write');
      return newSettings;
    })
  };

  return {settings, writeSettings};
};
