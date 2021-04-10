import pkg from '../package.json';
import fs from 'fs-extra';
import { appDataPath, settingsFile, userIdFile } from './components/useSettingsProvider';
import { existsSync } from 'fs';
import * as uuid from 'uuid';
import { useEffect } from 'react';

export const setUseTelemetry = (use: boolean) => USE_TELEMETRY = use;
let USE_TELEMETRY = true;

const GANALYTICS_PROP_ID = 'G-0ZRGCFQHYC';
const APP_NAME = pkg.name;
const APP_VERSION = pkg.version;

const gtag: (...args: any[]) => void = function() {
  if (!(window as any).dataLayer) {
    console.error('Could not send gtag data');
    console.log(arguments);
  } else {
    (window as any).dataLayer.push(arguments);
  }
};

export const install = (trackingId: string, userId: string) => {
  const scriptId = 'ga-gtag';

  if (document.getElementById(scriptId)) return;

  const {head} = document;
  const script = document.createElement('script');
  script.id = scriptId;
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  head.insertBefore(script, head.firstChild);

  (window as any).dataLayer = (window as any).dataLayer || [];

  gtag('js', new Date());
  gtag('config', trackingId, {
    'user_id': userId,
    'end_page_view': false,
  });
};

export const trackScreenView = (screenName: string) => {
  if (USE_TELEMETRY) {
    console.log(`Tracked screen ${screenName}`);
    gtag('event', 'page_view', {
      'page_title': screenName,
      'page_location': screenName,
      'page_path': screenName,
      'send_to': GANALYTICS_PROP_ID
    });
  } else {
    console.log(`Skipped tracking screen ${screenName}`);
  }
};
export const trackEvent = (action: string) => {
  if (USE_TELEMETRY) {
    console.log(`Tracked ${action}`);
    gtag('event', action, {
      'event_category': 'app',
    });
  } else {
    console.log(`Skipped tracking ${action}`);
  }
};
export const useScreenView = (view: string) => {
  useEffect(() => {
    trackScreenView(view);
  }, []);
};

(async () => {
  let telemetry = true;
  try {
    telemetry = (await fs.readJson(settingsFile)).telemetry;
    setUseTelemetry(telemetry);
  } catch(e) {
  }

  await fs.ensureDir(appDataPath);

  if (!existsSync(userIdFile)) {
    await fs.writeFile(userIdFile, uuid.v4(), { encoding: 'utf8' });
  }
  const userId = await fs.readFile(userIdFile, { encoding: 'utf8' });

  if (telemetry) {
    install(GANALYTICS_PROP_ID, userId);
    console.log(`Connected to telemetry with user ID "${userId}".`);
    trackEvent('startup');
    trackEvent('version-' + APP_VERSION);
  } else {
    console.log('Not connected to telemetry.');
  }
})();
