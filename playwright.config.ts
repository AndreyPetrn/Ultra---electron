import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: 'tests',
    workers: 1,
    maxFailures: 0,
    reportSlowTests: null,
    timeout: 300_000,
    globalTimeout: 300_000,
    expect:{
        timeout:3000
    },
    reporter: [['list'], ['allure-playwright', { outputFolder: 'allure-results' }]],
    use: {
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        viewport: { width: 1600, height: 800 },
        ignoreHTTPSErrors: true,
        bypassCSP: true,
        navigationTimeout: 60_000,
        actionTimeout: 5000,
    },
};

export default config;
