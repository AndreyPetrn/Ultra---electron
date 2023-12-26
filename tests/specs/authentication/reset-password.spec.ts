import { ElectronApplication } from 'playwright';
import { test, expect } from '@playwright/test';
import { NavigationPage } from '@pages/navigation/navigation.page';
import { WalletPage } from '@pages/wallet/wallet.page';
import { CommonHelper } from '@helpers/common.helper';
import { EmailHelper } from '@helpers/api_helpers/email.helper';
import { UserDataHelper } from '@helpers/data_helpers/user.data.helper';
import { ResetPasswordPage } from '@pages/authentication/reset-password.page';

let electronApp: ElectronApplication;

test.beforeAll(async () => {
    await EmailHelper.deleteAllEmails();
    electronApp = await CommonHelper.launchElectronApp();
});

test.afterAll(async () => {
    await CommonHelper.closeElectronApp(electronApp);
});

test.describe('Reset Password', async () => {
    test('[ID#36] Successful password reset @authentication', async () => {
        const user = await UserDataHelper.getUser('authorisation');
        const resetPasswordPage = await ResetPasswordPage.getPageByURL(electronApp);
        await resetPasswordPage.clickResetCredential();

        await test.step('Fill all required fields', async () => {
            await resetPasswordPage.fillMail(user);
            await resetPasswordPage.clickContinue();
            await resetPasswordPage.fillConfirmationMailCode(user);
            await resetPasswordPage.fillNewPassword(user);
            await resetPasswordPage.fillConfirmPassword(user);
            await resetPasswordPage.clickResetPassword();
            await resetPasswordPage.clickLogin();
        });

        await test.step('Check that user was successfully logged in', async () => {
            const navBar = await NavigationPage.getPageByURL(electronApp);
            await navBar.openWalletApp();

            const walletPage = await WalletPage.getPageByURL(electronApp);
            expect(walletPage.myWalletButton).toBeTruthy();
        });
    });
});
