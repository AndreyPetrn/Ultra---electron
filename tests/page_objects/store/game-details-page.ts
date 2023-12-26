import { CommonHelper } from '@helpers/common.helper';
import {Page, Locator, ElectronApplication, expect} from '@playwright/test';
import { step } from '@helpers/allure.helper';
import { config } from 'config_data';
import { ElementHandle } from 'playwright';

export class GameDetailsPage extends CommonHelper {
    public readonly gameGenres: Promise<ElementHandle<Element>[]>;
    public readonly goToStoreBtn: Locator;
    public readonly gameTags: Promise<ElementHandle<Element>[]>;
    public readonly gameModes: Promise<ElementHandle<Element>[]>;
    public readonly featureIcons: (value: string) => Locator;
    public readonly gameName: Locator;
    constructor(page:Page) {
        super(page);
        this.gameGenres = page.$$('[data-id="game-details-categories-item"]');
        this.goToStoreBtn = page.locator('[data-id="navbar-link-/store"]');
        this.gameTags = page.$$('[data-id="game-details-tags-item"]');
        this.gameModes = page.$$('[data-id="ultra-game-detail-playingModes-item"]');
        this.featureIcons = (value: string) => page.locator(`[data-id="game-details-features-item--${value}"]`);
        this.gameName = page.locator('[data-id="game-details-title"]');
    }

    static async getPageByURL(electronApp: ElectronApplication): Promise<GameDetailsPage> {
        return new GameDetailsPage(await this.openWindowByURL(electronApp, config.STORE.URL));
    }

    @step('Check filter by type')
    async checkFilters(type: string, filter: string[]): Promise<void> {
        for (let i = 0; i < filter.length; i++) {
            let gameFilters;
            switch (type) {
                case 'Genres':
                    gameFilters = await this.getGameFilters(type);
                    break;
                case 'Tags':
                    gameFilters = await this.getGameFilters(type);
                    break;
                case 'Playing Modes':
                    gameFilters = await this.getGameFilters(type);
                    break;
                default:
                    throw new Error(`Cannot find game filter! - ${type}`);
            }
            if (gameFilters) {
                await expect(gameFilters).toContain(filter[i]);
            }
        }
    }

    @step('Wait for game filter')
    async getGameFilters(type: string): Promise<(string | null)[]> {
        let filterHandles;
        switch (type) {
            case 'Genres':
                filterHandles = await this.gameGenres;
                break;
            case 'Tags':
                filterHandles = await this.gameTags;
                break;
            case 'Playing Modes':
                filterHandles = await this.gameModes;
                break;
            default:
                throw new Error(`Cannot find game filter! - ${type}`);
        }
        const list = [];
        for (let i = 0; i < filterHandles.length; i++) {
            if (filterHandles[i]) {
                const filter = await filterHandles[i].textContent();
                list.push(filter);
            }
        }
        return list;
    }

    @step('Click store btn')
    async clickStoreBtn() {
        await this.goToStoreBtn.click();
    }

    @step('Check filter game by feature')
    async checkFilterByFeature(features: string[]): Promise<void> {
        for (let i = 0; i < features.length; i++) {
            await this.checkFeatureIcon(features[i]);
        }
    }

    @step('Check feature icon inside game details page')
    async checkFeatureIcon(feature: string): Promise<void> {
        switch (feature) {
            case 'Achievements':
                await this.featureIcons('achievements');
                break;
            case 'Beta':
                await this.featureIcons('beta');
                break;
            case 'Cloud Save':
                await this.featureIcons('cloud save');
                break;
            case 'Controller Support':
                await this.featureIcons('controller support');
                break;
            case 'Early-Access':
                await this.featureIcons('early-access');
                break;
            case 'Ingame Items':
                await this.featureIcons('ingame items');
                break;
            case 'Leaderboard':
                await this.featureIcons('leaderboard');
                break;
            case 'Secure Anti-Cheat':
                await this.featureIcons('secure anti-cheat');
                break;
            case 'Vr Support':
                await this.featureIcons('vr support');
                break;
            case 'Workshop Mods':
                await this.featureIcons('workshop mods');
                break;
            case 'Transferable':
                await this.featureIcons('transferable');
                break;
            case 'Resalable':
                await this.featureIcons('resalable');
                break;
            default:
                throw new Error(`Cannot find requested feature icon inside the game details page! - ${feature}`);
        }
    }

    @step('Get the "Game name" value')
    async getGameNameTxt(): Promise<any> {
        return await this.gameName.textContent();
    }
}
