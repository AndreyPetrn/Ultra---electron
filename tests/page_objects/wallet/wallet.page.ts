import { CommonHelper } from '@helpers/common.helper';
import { Page, Locator, ElectronApplication } from '@playwright/test';
import { ITransferUos } from './interface/transfer-uos.interface';
import { step } from '@helpers/allure.helper';
import { config } from 'config_data';

export class WalletPage extends CommonHelper {
    public readonly myWalletButton: Locator;
    public readonly amountInput: Locator;
    public readonly addressInput: Locator;
    public readonly memoInput: Locator;
    public readonly sendButton: Locator;
    public readonly advancedViewSwitch: Locator;
    public readonly transactionDataCodeLines: string;
    public readonly walletIdContent: Locator;
    constructor(page:Page) {
        super(page);
        this.myWalletButton = page.locator('[data-id="my-wallet-link"]');
        this.amountInput = page.locator('[data-id="send-uos-amount-field"]');
        this.addressInput = page.locator('[data-id="send-uos-address-field"]');
        this.memoInput = page.locator('[data-id="send-uos-memo-field"]');
        this.sendButton = page.locator('[data-id="send-uos-button"]');
        this.advancedViewSwitch = page.locator('[data-id="advanced-view-switch"]');
        this.transactionDataCodeLines = 'ultra-transaction-data .CodeMirror-line';
        this.walletIdContent = page.locator('[data-id="wallet-id-content"]');
    }

    static async getPageByURL(electronApp: ElectronApplication): Promise<WalletPage> {
        return new WalletPage(await this.openWindowByURL(electronApp, config.WALLET.URL));
    }

    @step('Click My Wallet button')
    async clickMyWallet(): Promise<void> {
        await this.myWalletButton.click();
    }

    @step('Fill Amount field')
    async fillAmount(amount: string): Promise<void> {
        await this.amountInput.type(amount);
    }

    @step('Fill Address field')
    async fillAddress(address: string): Promise<void> {
        await this.addressInput.type(address);
    }

    @step('Fill Memo field')
    async fillMemo(memo: string): Promise<void> {
        await this.memoInput.type(memo);
    }

    @step('Click Send button')
    async clickSend(): Promise<void> {
        await this.sendButton.click();
    }

    @step('Click Advanced view button')
    async clickAdvancedView(): Promise<void> {
        await this.advancedViewSwitch.click();
    }

    async getWalletId(): Promise<string | undefined> {
        //TODO create a Timeout object with common values
        await this.page.waitForSelector('.spinner', { state: 'hidden', timeout: 30_000 });
        return (await this.walletIdContent.textContent())?.trim();
    }

    async getTransactionContent(): Promise<ITransferUos | null> {
        await this.page.waitForSelector(this.transactionDataCodeLines);
        return this.page.evaluate((dataCodeLines) => {
            const transactionCodeLines = document.querySelectorAll(dataCodeLines);
            const transactionJSON = Array.from(transactionCodeLines)
                .map((ele) => ele.textContent)
                .join('');
            try {
                return JSON.parse(transactionJSON);
            } catch (err) {
                return null;
            }
        }, this.transactionDataCodeLines);
    }
}
