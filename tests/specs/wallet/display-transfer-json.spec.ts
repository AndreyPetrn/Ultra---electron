import { ElectronApplication } from 'playwright';
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/authentication/login.page';
import { NavigationPage } from '@pages/navigation/navigation.page';
import { WalletPage } from '@pages/wallet/wallet.page';
import { CommonHelper } from '@helpers/common.helper';
import { EmailHelper } from '@helpers/api_helpers/email.helper';
import { UserDataHelper } from '@helpers/data_helpers/user.data.helper';
import { config } from 'config_data';

let electronApp: ElectronApplication;
const user = UserDataHelper.getUser('WOC');
const transferData = {
    amount: config.TRANSFER.AMOUNT,
    address: config.TRANSFER.ADDRESS,
    memo: config.TRANSFER.MEMO
};

test.beforeAll(async () => {
    await EmailHelper.deleteAllEmails();
    electronApp = await CommonHelper.launchElectronApp();
    await LoginPage.login(electronApp, await user);
});

test.afterAll(async () => {
    await CommonHelper.closeElectronApp(electronApp);
});

test.describe('My Wallet', async () => {
    test('[ID#59] Verification UOS transfer @wallet', async () => {
        await test.step('Open wallet page', async () => {
            const navBar = await NavigationPage.getPageByURL(electronApp);
            await navBar.openWalletApp();
        });

        const walletPage = await WalletPage.getPageByURL(electronApp);
        await test.step('Transfer UOS', async () => {
            await walletPage.clickMyWallet();
            await walletPage.fillAmount(transferData.amount);
            await walletPage.fillAddress(transferData.address);
            await walletPage.fillMemo(transferData.memo);
            await walletPage.clickSend();
        });

        await test.step('Check transaction data', async () => {
            await walletPage.clickAdvancedView();
            const transaction = await walletPage.getTransactionContent();
            expect(transaction).not.toBeNull();
            expect(parseFloat(transaction!.data.quantity)).toBe(parseFloat(transferData.amount));
            expect(transaction?.data.to).toBe(transferData.address);
            expect(transaction?.data.memo).toBe(transferData.memo);
        });
    });
});
