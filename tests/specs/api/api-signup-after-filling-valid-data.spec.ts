import { test } from '@playwright/test';
import { ElectronApplication } from 'playwright';
import { CommonHelper } from '@helpers/common.helper';
import { EmailHelper } from '@helpers/api_helpers/email.helper';
import { NavigationPage } from '@pages/navigation/navigation.page';
import { KeycloakHelper } from '@helpers/api_helpers/keycloak.helper';
import { WalletPage } from '@pages/wallet/wallet.page';
import { TransactionHelper } from '@helpers/api_helpers/transaction.helper';
import { LoginPage } from '@pages/authentication/login.page';

let electronApp: ElectronApplication;
let keycloakHelper: KeycloakHelper;

test.beforeAll(async () => {
    await EmailHelper.deleteAllEmails();
    const token = await KeycloakHelper.getAccessToken();
    keycloakHelper = new KeycloakHelper(token);
});

test.afterAll(async () => {
    await CommonHelper.closeElectronApp(electronApp);
});

test.describe('Sign Up', async () => {
    test('[ID#37][API] Successful user signup @api', async () => {
        await test.step('Create User by Keycloak API', async () => {
            const newUser = await keycloakHelper.createNewUser('default user');
            electronApp = await CommonHelper.launchElectronApp();
            await LoginPage.login(electronApp, newUser);
        });
        await test.step('Top up User balance by user wallet ID', async () => {
            const navBar = await NavigationPage.getPageByURL(electronApp);
            await navBar.openWalletApp();
            const walletPage = await WalletPage.getPageByURL(electronApp);
            await walletPage.clickMyWallet();
            const walletId = await walletPage.getWalletId();
            await TransactionHelper.sendUOS('1', walletId);
        });
    });
});
