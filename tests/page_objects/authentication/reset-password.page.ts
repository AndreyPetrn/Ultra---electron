import { CommonHelper } from '@helpers/common.helper';
import { EmailHelper } from '@helpers/api_helpers/email.helper';
import { Page, Locator, ElectronApplication } from '@playwright/test';
import { step } from '@helpers/allure.helper';
import { config } from 'config_data';

export class ResetPasswordPage extends CommonHelper {
    public readonly resetCredentialLink: Locator;
    public readonly emailField: Locator;
    public readonly continueButton: Locator;
    public readonly emailCodeField: Locator;
    public readonly newPasswordField: Locator;
    public readonly confirmPasswordField: Locator;
    public readonly resetPasswordButton: Locator;
    public readonly loginButton: Locator;
    public readonly nextButton: Locator;
    constructor(page:Page) {
        super(page);
        this.resetCredentialLink = page.locator('[data-id="login-reset-credentials-link"]');
        this.emailField = page.locator('[data-id="reset-password-username-field"]');
        this.continueButton = page.locator('[data-id="reset-password-continue-button"]');
        this.emailCodeField = page.locator('[data-id="reset-password-mail-code-field"]');
        this.newPasswordField = page.locator('[data-id="reset-password-new-field"]');
        this.confirmPasswordField = page.locator('[data-id="reset-password-confirm-field"]');
        this.resetPasswordButton = page.locator('[data-id="reset-password-button"]');
        this.loginButton = page.locator('[data-id="update-password-login-button"]');
        this.nextButton = page.locator('[data-id="reset-password-next-button"]');
    }

    static async getPageByURL(electronApp: ElectronApplication): Promise<ResetPasswordPage> {
        return new ResetPasswordPage(await this.openWindowByURL(electronApp, config.APP.LAUNCH));
    }

    @step('Click reset credential')
    async clickResetCredential(): Promise<void> {
        await this.resetCredentialLink.click();
    }

    @step('Fill forgot password email')
    async fillMail(user:any): Promise<void> {
        await this.emailField.type(user.email);
    }

    @step('Fill email code')
    async fillMailCode(ecode: string): Promise<void> {
        await this.emailCodeField.type(ecode);
    }

    @step('Click next button')
    async clickNext(): Promise<void> {
        await this.nextButton.click();
    }

    @step('Click continue')
    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }

    @step('Fill confirmation email code')
    async fillConfirmationMailCode(user:any): Promise<void> {
        if (this.emailCodeField !== null){
            await this.fillMailCode(await EmailHelper.getEmailCode(user, 'reset your password'));
            await this.clickNext();
        }
    }

    @step('Fill new password')
    async fillNewPassword(user:any): Promise<void> {
        await this.newPasswordField.type(user.password);
    }

    @step(`Fill 'confirm new password'`)
    async fillConfirmPassword(user:any): Promise<void> {
        await this.confirmPasswordField.type(user.password);
    }

    @step('Click reset password button')
    async clickResetPassword(): Promise<void> {
        await this.resetPasswordButton.click();
    }

    @step('Click Login button')
    public async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }
}
