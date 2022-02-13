import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { chromium, Browser as PlaywrightBrowser, Page } from 'playwright';
import { Arguments } from '~/types';
import { fromPromiseWithError } from '../utils';

type BrowserInit = {
  /** @default true */
  headless?: boolean;
};

type PageInit = Arguments<PlaywrightBrowser['newPage']>[0][0];

const chromiumArgs = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--disk-cache-size=33554432',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];

export class Browser {
  #browser: PlaywrightBrowser | undefined;

  launch(init?: BrowserInit) {
    return fromPromiseWithError(
      chromium.launch({
        headless: init?.headless ?? true,
        args: chromiumArgs,
      }),
    ).map((browser) => {
      this.#browser = browser;
      return this;
    });
  }

  newPage(init?: PageInit) {
    if (this.#browser == null) {
      return errAsync<Page, Error>(new Error('No browser instance.'));
    }
    return fromPromiseWithError(this.#browser.newPage(init));
  }

  closeAndMap<T>(value: T): ResultAsync<T, unknown> {
    if (this.#browser == null) {
      return okAsync(value);
    }
    return fromPromiseWithError(this.#browser.close()).map(() => value);
  }

  close(): ResultAsync<void, unknown> {
    return this.closeAndMap(undefined);
  }
}
