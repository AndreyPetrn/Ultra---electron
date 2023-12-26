import { ElectronApplication } from 'playwright';
import { test, expect } from '@playwright/test';
import { NavigationPage } from '@pages/navigation/navigation.page';
import { WalletPage } from '@pages/wallet/wallet.page';
import { CommonHelper } from '@helpers/common.helper';
import { EmailHelper } from '@helpers/api_helpers/email.helper';
import { UserDataHelper } from '@helpers/data_helpers/user.data.helper';
import { LoginPage } from '@pages/authentication/login.page';
import { Authentication } from 'test_data/page.data.json';

let electronApp: ElectronApplication;

test.beforeAll(async () => {
    await EmailHelper.deleteAllEmails();
    electronApp = await CommonHelper.launchElectronApp();
});

test.afterAll(async () => {
    await CommonHelper.closeElectronApp(electronApp);
});

test.describe('Sign In', async () => {
    test('[ID#304] Successful resend email code @authentication', async () => {
        const user = await UserDataHelper.getUser('default');
        const loginPage = await LoginPage.getPageByURL(electronApp);

        await test.step('Fill all required fields', async () => {
            await loginPage.fillUsername(user!.email);
            await loginPage.fillPassword(user!.password);
            await loginPage.clickLogin();
        });

        await test.step('Fill incorrect Email code', async () => {
            await loginPage.fillMailCode('faulty');
            await loginPage.clickNext();
            expect(await loginPage.getEmailErrorMessage()).toEqual(Authentication.codeErrorMessage);
        });

        await test.step('Resend Email code', async () => {
            await loginPage.clickResendEmailCode();
            expect(await loginPage.getResendCodeMessage()).toContain(Authentication.codeResendMessage);
        });

        await test.step('Confirm the login process with the correct code', async () => {
            await loginPage.confirmLogin(user);
        });

        await test.step('Check that user was successfully logged in', async () => {
            const navBar = await NavigationPage.getPageByURL(electronApp);
            await navBar.openWalletApp();

            const walletPage = await WalletPage.getPageByURL(electronApp);
            expect(walletPage.myWalletButton).toBeTruthy();
        });
    });
});
