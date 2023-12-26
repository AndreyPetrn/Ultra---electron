import { CommonHelper } from '@helpers/common.helper';
import { Page, Locator, ElectronApplication } from '@playwright/test';
import { step } from '@helpers/allure.helper';
import { config } from 'config_data';

export class SignupPage extends CommonHelper {
    public readonly signupLink: Locator;
    public readonly usernameInput: Locator;
    public readonly firstNameInput: Locator;
    public readonly lastNameInput: Locator;
    public readonly emailInput: Locator;
    public readonly passwordInput: Locator;
    public readonly termsCheckbox: Locator;
    public readonly nextButton: Locator;
    public readonly emailCodeInput: Locator;
    public readonly countryDropdown: Locator;
    public readonly countryInput: Locator;
    public readonly countryLabel: Locator;
    public readonly phoneInput: Locator;
    public readonly phoneCodeInput: Locator;
    public readonly checkRegisterStep: Locator;
    public readonly checkPageTitle: Locator;
    public readonly checkCompletedStep: Locator;
    public readonly changePhoneNumberButton: Locator;
    public readonly errorEmailCode: Locator;
    public readonly resendMobileCodeButton: Locator;
    public readonly resendCodeMessage: Locator;
    constructor(page:Page) {
        super(page);
        this.signupLink = page.locator('[data-id="login-registration-link"]');
        this.usernameInput = page.locator('[data-id="register-username-field"]');
        this.firstNameInput = page.locator('[data-id="register-firstname-field"]');
        this.lastNameInput = page.locator('[data-id="register-lastname-field"]');
        this.emailInput = page.locator('[data-id="register-email-field"]');
        this.passwordInput = page.locator('[data-id="register-password-field"]');
        this.termsCheckbox = page.locator('[data-id="register-terms-conditions-checkbox"]');
        this.nextButton = page.locator('[data-id="next-step-button"]');
        this.emailCodeInput = page.locator('[data-id="email-verification-code-field"]');
        this.countryDropdown = page.locator('[class="select2-selection__rendered"]');
        this.countryInput = page.locator('input[type="search"]');
        this.countryLabel = page.locator('.iti__us');
        this.phoneInput = page.locator('[data-id="register-geolocation-phone-field"]');
        this.phoneCodeInput = page.locator('[data-id="phone-verification-code-field"]');
        this.checkRegisterStep = page.locator('[data-id="register-step-content"]');
        this.checkPageTitle = page.locator('[data-id="page-title-content"]');
        this.checkCompletedStep = page.locator('.completed.step');
        this.changePhoneNumberButton = page.locator('[data-id="change-phone-numer-link"]');
        this.errorEmailCode = page.locator('[data-id="error-field-content"]');
        this.resendMobileCodeButton = page.locator('[data-id="resend-phone-code-link"]');
        this.resendCodeMessage = page.locator('[data-id="resend-code-message-content"]');
    }

    static async getPageByURL(electronApp: ElectronApplication): Promise<SignupPage> {
        return new SignupPage(await this.openWindowByURL(electronApp, config.APP.LAUNCH));
    }

    async getPhoneErrorMessage(): Promise<string | null> {
        return await this.errorEmailCode.textContent();
    }

    async getResendCodeMessage(): Promise<string | null> {
        return await this.resendCodeMessage.textContent();
    }

    async registerStepText(): Promise<string | null> {
        return await this.checkRegisterStep.textContent();
    }

    async pageTitleText(): Promise<string | null> {
        return await this.checkPageTitle.textContent();
    }

    async getCompletedStepValue(): Promise<number> {
        return (await this.checkCompletedStep.all()).length;
    }

    @step('Click on the "Signup" button')
    async clickSignup(): Promise<void> {
        await this.signupLink.click();
    }

    @step('Fill username data')
    async fillUsername(username: string): Promise<void> {
        await this.usernameInput.type(username);
    }

    @step('Fill first name data')
    async fillFirstName(firstName: string): Promise<void> {
        await this.firstNameInput.type(firstName);
    }

    @step('Fill last name data')
    async fillLastname(lastName: string): Promise<void> {
        await this.lastNameInput.type(lastName);
    }

    @step('Fill email data')
    async fillEmail(email: string): Promise<void> {
        await this.emailInput.type(email);
    }

    @step('Fill password data')
    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.type(password);
    }

    @step('Check terms data')
    async checkTerms(): Promise<void> {
        await this.termsCheckbox.click();
    }

    @step('Fill code from email')
    async fillEmailCode(ecode: string): Promise<void> {
        await this.emailCodeInput.type(ecode);
    }

    @step('Click on the "Next" button')
    async clickNext(): Promise<void> {
        await this.nextButton.click();
    }

    @step('Select country')
    async selectCountry(): Promise<void> {
        await this.countryDropdown.click();
    }

    @step('Fill country data')
    async fillCountry(country: string): Promise<void> {
        await this.countryInput.type(country);
    }

    @step('Click on the country from list')
    async clickCountry(): Promise<void> {
        await this.countryLabel.click();
    }

    @step('Clear phone number data')
    async clearOldPhone(): Promise<void> {
        await this.phoneInput.click({clickCount: 3});
        await this.phoneInput.press('Backspace');
    }

    @step('Fill phone number')
    async fillPhone(phone: string): Promise<void> {
        await this.phoneInput.type(phone);
    }

    @step('Fill code from phone')
    async fillPhoneCode(mcode:string):Promise<void> {
        await this.phoneCodeInput.type(mcode);
    }

    @step('Fill user data')
    async fillUserData(user:any): Promise<void> {
        await this.fillUsername(await user.username);
        await this.fillFirstName(await user.firstName);
        await this.fillLastname(await user.lastName);
        await this.fillEmail(await user.email);
        await this.fillPassword(await user.password);
    }

    @step('Click on the "Change phone number" button')
    async changePhoneNumber(): Promise<void> {
        await this.changePhoneNumberButton.click();
    }

    @step('Click on the "Resend mobile code" button')
    async resendMobileCode(): Promise<void> {
        await this.resendMobileCodeButton.click();
    }
}
