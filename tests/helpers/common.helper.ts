import { findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';
import { Page, ElectronApplication, _electron as electron } from 'playwright';
import * as path from 'path';
import os from 'os';
import 'dotenv/config';

export class CommonHelper {
    public readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    static async launchElectronApp(): Promise<ElectronApplication> {
        let arguments_: string[] = [];
        let executablePath: string = '';
        const env = process.env.ENV;
        if (process.env.CLIENT_BUILD === 'latest') {
            // start electron client by the latest build
            const latestBuild = findLatestBuild(`../electron-client/out/Ultra${env}`);
            const appInfo = parseElectronApp(latestBuild);
            arguments_ = [appInfo.main];
            executablePath = `../electron-client/out/Ultra${env}/Ultra${env}-win32-x64/Ultra${env}.exe`;
        } else if (process.env.CLIENT_BUILD === 'custom') {
            // start electron client by .exe file
            arguments_ = [path.join(os.homedir(),`/AppData/Local/Ultra${env}/app-${process.env.CLIENT_VERSION}/resources/app/.webpack/main`)];
            executablePath = path.join(os.homedir(),`/AppData/Local/Ultra${env}/app-${process.env.CLIENT_VERSION}/Ultra${env}.exe`);
        } else {
            throw new Error('Invalid variant specified. Update config in .env file');
        }
        return electron.launch({
            args: arguments_,
            executablePath,
        });
    }

    static async closeElectronApp(electronApp: ElectronApplication): Promise<void> {
        const windows = electronApp.windows();
        windows.forEach((window) => {
            window.close();
        });
        electronApp.close();
    }

    static async waitForWindowByURL(electronApp: ElectronApplication, expectedUrl: string, timeoutMs: number) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {
            const windows = electronApp.windows();
            const windowsByURL: { [x: string]: any; } = {};
            for (const window of windows) {
                const url = window.url();
                windowsByURL[url] = window;
                if (url === expectedUrl) {
                    return windowsByURL;
                }
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        console.log(`NO ONE WINDOW CONTAINS URL: ${expectedUrl}`);
        return null;
    }

    static async openWindowByURL(electronApp: ElectronApplication, expectedUrl:string) {
        return (await CommonHelper.waitForWindowByURL(electronApp, expectedUrl, 20_000))![expectedUrl];
    }
}
