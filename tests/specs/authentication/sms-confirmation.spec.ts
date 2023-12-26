import { ElectronApplication } from 'playwright';
import { test, expect } from '@playwright/test';
import { NavigationPage } from '@pages/navigation/navigation.page';
import { WalletPage } from '@pages/wallet/wallet.page';
import { CommonHelper } from '@helpers/common.helper';
import { EmailHelper } from '@helpers/api_helpers/email.helper';
import { UserDataHelper } from '@helpers/data_helpers/user.data.helper';
import { signupDataHelper } from '@helpers/data_helpers/signup.data.helper';
import { SignupPage } from '@pages/authentication/signup.page';
import { TwilioHelper } from '@helpers/api_helpers/twilio.helper';
import { Authentication } from 'test_data/page.data.json';

let electronApp: ElectronApplication;
let twilioHelper: TwilioHelper;

test.beforeAll(async () => {
    await EmailHelper.deleteAllEmails();
    electronApp = await CommonHelper.launchElectronApp();
    twilioHelper = new TwilioHelper();
});

test.afterAll(async () => {
    await CommonHelper.closeElectronApp(electronApp);
});

test.describe('Sign Up', async () => {
    test('[ID#306] Successful change phone number during user signup @authentication', async () => {
        const signupPage = await SignupPage.getPageByURL(electronApp);
        const user = await UserDataHelper.getUser('new');
        const number = await twilioHelper.getNewMobileNumber();
        const secondNumber = await twilioHelper.getNewMobileNumber();
        const stepName = await signupDataHelper.getSignupInfo('steps');

        await test.step('Open Signup page', async () => {
            await signupPage.clickSignup();
            expect(await signupPage.registerStepText()).toBe(Authentication.Signup.first_step);
            expect(await signupPage.pageTitleText()).toContain(stepName!.first);
        });

        await test.step('Fill out User Data', async () => {
            await signupPage.fillUserData(user);
            await signupPage.checkTerms();
            await signupPage.clickNext();
        });

        await test.step('Verify Email', async () => {
            const emailCode = await EmailHelper.getEmailCode(user,'signup');
            await signupPage.fillEmailCode(emailCode);
            expect(await signupPage.registerStepText()).toBe(Authentication.Signup.second_step);
            expect(await signupPage.pageTitleText()).toContain(stepName!.second);
            expect(await signupPage.getCompletedStepValue()).toBe(1);
            await signupPage.clickNext();
        });

        await test.step('Setup Geolocation', async () => {
            await signupPage.selectCountry();
            await signupPage.fillCountry('United state');
            await signupPage.clickCountry();
            await signupPage.fillPhone(number);
            expect(await signupPage.registerStepText()).toBe(Authentication.Signup.third_step);
            expect(await signupPage.pageTitleText()).toContain(stepName!.third);
            expect(await signupPage.getCompletedStepValue()).toBe(2);
            await signupPage.clickNext();
        });

        await test.step('Fill incorrect Phone code', async () => {
            await signupPage.fillPhoneCode('faulty');
            await signupPage.clickNext();
            expect(await signupPage.getPhoneErrorMessage()).toEqual(Authentication.codeErrorMessage);
        });

        await test.step('Change phone number', async () => {
            await signupPage.changePhoneNumber();
            await signupPage.clearOldPhone();
            await signupPage.fillPhone(secondNumber);
            await signupPage.clickNext();
        });

        await test.step('Fill incorrect Phone code', async () => {
            await signupPage.fillPhoneCode('faulty');
            await signupPage.clickNext();
            expect(await signupPage.getPhoneErrorMessage()).toEqual(Authentication.codeErrorMessage);
        });

        await test.step('Resend Phone code', async () => {
            await signupPage.resendMobileCode();
            expect(await signupPage.getResendCodeMessage()).toContain(Authentication.codeResendMessage);
        });

        await test.step('Confirm the phone number with the correct code', async () => {
            const twilioCode = await twilioHelper.getNewMobileCode(secondNumber);
            await signupPage.fillPhoneCode(twilioCode);
            await signupPage.clickNext();
        });

        await test.step('Check that user was successfully logged in', async () => {
            const navBar = await NavigationPage.getPageByURL(electronApp);
            await navBar.openWalletApp();

            const walletPage = await WalletPage.getPageByURL(electronApp);
            expect(walletPage.myWalletButton).toBeTruthy();
        });
    });
});
