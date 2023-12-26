import { CommonHelper } from '@helpers/common.helper';
import { EmailHelper } from '@helpers/api_helpers/email.helper';
import { Page, Locator, ElectronApplication } from '@playwright/test';
import { step } from '@helpers/allure.helper';
import { config } from 'config_data';

export class LoginPage extends CommonHelper {
    public readonly usernameField: Locator;
    public readonly passwordField: Locator;
    public readonly loginButton: Locator;
    public readonly mailCodeField: Locator;
    public readonly nextButton: Locator;
    public readonly errorCodeContent: Locator;
    public readonly resendCodeLink: Locator;
    public readonly resendCodeMessage: Locator;
    constructor(page:Page) {
        super(page);
        this.usernameField = page.locator('[data-id="login-username-field"]');
        this.passwordField = page.locator('[data-id="login-password-field"]');
        this.loginButton = page.locator('[data-id="login-button"]');
        this.mailCodeField = page.locator('[data-id="email-verification-code-field"]');
        this.nextButton = page.locator('[data-id="login-next-button"]');
        this.errorCodeContent = page.locator('[data-id="error-field-content"]');
        this.resendCodeLink = page.locator('[data-id="login-resend-code-link"]');
        this.resendCodeMessage = page.locator('[data-id="resend-code-message-content"]');
    }

    static async getPageByURL(electronApp: ElectronApplication): Promise<LoginPage> {
        return new LoginPage(await this.openWindowByURL(electronApp, config.APP.LAUNCH));
    }

    @step('Fill username field')
    async fillUsername(username:string): Promise<void> {
        await this.usernameField.type(username);
    }

    @step('Fill password field')
    async fillPassword(password:string): Promise<void> {
        await this.passwordField.type(password);
    }

    @step('Click Login button')
    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }

    @step('Fill code from email')
    async fillMailCode(ecode: string): Promise<void> {
        await this.mailCodeField.type(ecode);
    }

    @step('Click Next button')
    async clickNext(): Promise<void> {
        await this.nextButton.click();
    }

    @step('Confirm login process')
    async confirmLogin(user:any): Promise<void> {
        if (this.mailCodeField !== null) {
            await this.fillMailCode(await EmailHelper.getEmailCode(user, 'login'));
            await this.clickNext();
        }
    }

    @step('Click resend email code')
    async clickResendEmailCode(): Promise<void> {
        await this.resendCodeLink.click();
    }

    async getEmailErrorMessage(): Promise<string | null> {
        return await this.errorCodeContent.textContent();
    }

    async getResendCodeMessage(): Promise<string | null> {
        return await this.resendCodeMessage.textContent();
    }

    static async login(electronApp: ElectronApplication, user:any) {
        const loginPage = await this.getPageByURL(electronApp);
        await loginPage.fillUsername(user.email);
        await loginPage.fillPassword(user.password);
        await loginPage.clickLogin();
        await loginPage.confirmLogin(user);
    }
}
