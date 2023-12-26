import { CommonHelper } from '@helpers/common.helper';
import { Page, ElectronApplication, Locator } from '@playwright/test';
import { step } from '@helpers/allure.helper';
import { config } from 'config_data';

export class NavigationPage extends CommonHelper {
    public readonly appIcons: Locator;
    public readonly storeAppIcon: Locator;
    public readonly walletAppIcon: Locator;
    public readonly marketplaceAppIcon: Locator;
    public readonly gameDevCenterIcon: Locator;
    public readonly ultraCloudIcon: Locator;
    public readonly helpCenterIcon: Locator;
    public readonly masterCenterIcon: Locator;
    public readonly dimensionIcons: Locator;
    public readonly marketplaceDimensionIcon: Locator;
    public readonly gameDevCenterDimensionIcon: Locator;
    public readonly masterCenterDimensionIcon: Locator;
    constructor(page:Page) {
        super(page);
        this.appIcons = page.locator('[data-id="item-app-link"]');
        this.storeAppIcon = this.appIcons.first();
        this.walletAppIcon = this.appIcons.nth(1);
        this.marketplaceAppIcon = this.appIcons.nth(2);
        this.gameDevCenterIcon = this.appIcons.first();
        this.ultraCloudIcon = this.appIcons.nth(1);
        this.helpCenterIcon = this.appIcons.nth(2);
        this.masterCenterIcon = this.appIcons.first();
        this.dimensionIcons = page.locator('[data-id="item-dimension-link"]');
        this.marketplaceDimensionIcon = this.dimensionIcons.first();
        this.gameDevCenterDimensionIcon = this.dimensionIcons.nth(1);
        this.masterCenterDimensionIcon = this.dimensionIcons.nth(2);
    }

    static async getPageByURL(electronApp: ElectronApplication): Promise<NavigationPage> {
        return new NavigationPage(await this.openWindowByURL(electronApp, config.APP.NAV));
    }

    @step('Open Store app')
    public async openStoreApp(): Promise<void> {
        await this.storeAppIcon.click();
    }

    @step('Open Wallet app')
    public async openWalletApp(): Promise<void> {
        await this.walletAppIcon.click();
    }

    @step('Open Marketplace app')
    public async openMarketplaceApp(): Promise<void> {
        await this.marketplaceAppIcon.click();
    }

    @step('Open Game Dev Center app')
    public async openGameDevCenterApp(): Promise<void> {
        await this.gameDevCenterIcon.click();
    }

    @step('Open Ultra Cloud app')
    public async openUltraCloudApp(): Promise<void> {
        await this.ultraCloudIcon.click();
    }

    @step('Open Help Center app')
    public async openHelpCenterApp(): Promise<void> {
        await this.helpCenterIcon.click();
    }

    @step('Open Master Center app')
    public async openMasterCenterApp(): Promise<void> {
        await this.masterCenterIcon.click();
    }

    @step('Open Ultra Marketplace')
    public async openMarketPlace(): Promise<void> {
        await this.marketplaceDimensionIcon.click();
    }

    @step('Open Ultra Games')
    public async openGameDevCenter(): Promise<void> {
        await this.dimensionIcons;
        await this.gameDevCenterDimensionIcon.click();
    }

    @step('Open Ultra OS')
    public async openMasterCenter(): Promise<void> {
        await this.marketplaceDimensionIcon.click();
    }
}
