import { CommonHelper } from '@helpers/common.helper';
import { Page, Locator, ElectronApplication, expect } from '@playwright/test';
import { step } from '@helpers/allure.helper';
import { config } from 'config_data';
import { ElementHandle } from 'playwright';

type genreSelector = ['action' | 'rpg' | 'flight' | 'adventure' | 'fighting' | 'fps' | 'indie' | 'puzzle' | 'racing' | 'simulation' | 'strategy' | 'sports'];
type tagSelector = ['2022' | 'topcars' | 'race'];

export class StorePage extends CommonHelper {
    public readonly yourLibraryButton: Locator;
    public readonly gamesCount: Locator;
    public readonly filterGenres: (value: any) => Locator;
    public readonly firstGame: Locator;
    public readonly filterSearchTags: Locator;
    public readonly filterTags: (value: any) => Locator;
    public readonly filterGroupTxt: (value: string) => Promise<ElementHandle<Element>[]>;
    public readonly searchBrowseGames: Locator;
    public readonly goToStoreBtn: Locator;
    public readonly recommendedGamesSlides: Locator;
    public readonly activeSlideTitle: Locator;
    public readonly activeSlideArrowBtn: (value: string) => Locator;
    public readonly activeSlidePriceBtn: Locator;
    public readonly activeSlideDarkBtn: Locator;
    public readonly changeSlideUsingBottomSelector: Promise<ElementHandle<Element>[]>;
    public readonly gameDetailsButton: Promise<ElementHandle<Element>[]>;
    constructor(page:Page) {
        super(page);
        this.yourLibraryButton = page.locator('[data-id="navbar-link-/your-library"]');
        this.gamesCount = page.locator('[data-id="pagination-total-count"]').first();
        this.filterGenres = (value: any) => page.locator(`[data-id="filter-genres-${value}"]`);
        this.firstGame = page.locator('.games-list .preview-container').first();
        this.filterSearchTags = page.locator('[data-id="filters-tags-search-form"]');
        this.filterTags = (value: any) => page.locator(`[data-id="filter-tags-${value}"]`);
        this.filterGroupTxt = (value: string) => page.$$(`[label="${value}"] [data-id*="checkbox-filter-"]`);
        this.searchBrowseGames = page.locator('[data-id="browse-game-search-form"]');
        this.goToStoreBtn = page.locator('[data-id="navbar-link-/store"]');
        this.recommendedGamesSlides = page.locator('ultra-recommended-games-slideshow ultra-game-item-slideshow:not(.swiper-slide-duplicate ultra-game-item-slideshow)');
        this.activeSlideTitle = page.locator('.swiper-slide-active ultra-game-item-slideshow .game__title');
        this.activeSlideArrowBtn = (arrow: string) => page.locator(`//div[@class="ultra-slider theme-carousel"]/div/button[contains(@class, "ultra-slider-button-${arrow}")]`);
        this.activeSlidePriceBtn = page.locator('.swiper-slide-active ultra-game-item-slideshow .price');
        this.activeSlideDarkBtn = page.locator('.swiper-slide-active ultra-game-item-slideshow .btn-dark');
        this.changeSlideUsingBottomSelector = page.$$('.swiper-pagination-bullet');
        this.gameDetailsButton = page.$$('.swiper-slide-active ultra-game-item-slideshow .btn-slide-show-min-width');
    }

    static async getPageByURL(electronApp: ElectronApplication): Promise<StorePage> {
        return new StorePage(await this.openWindowByURL(electronApp, config.STORE.URL));
    }

    @step('Get the "Games count" value')
    async getGamesCount(): Promise<string | null> {
        return await this.gamesCount.textContent();
    }

    @step('Click Your Library button')
    public async clickYourLibraryButton(): Promise<void> {
        await this.yourLibraryButton.click();
    }

    @step('Check filter by genre')
    async checkFilterByGenre(genres: genreSelector[]): Promise<void> {
        for (let i = 0; i < genres.length; i++) {
            await this.filterGenre(genres[i]);
        }
        await this.openFirstGame();
    }

    @step('Filter genre')
    async filterGenre(genre: genreSelector): Promise<void> {
        await this.filterGenres(genre).click();
        await this.page.waitForTimeout(1000); // wait for load games
    }

    @step('Open the first game details page')
    async openFirstGame(): Promise<void> {
        await this.page.waitForTimeout(2000); // wait for load games
        await this.firstGame.hover();
        await this.firstGame.click();
    }

    @step('Check filter by tag')
    async checkFilterByTag(tag: tagSelector): Promise<void> {
        await this.filterTag(tag);
        await this.openFirstGame();
    }

    @step('Filter tag')
    async filterTag(tag: tagSelector): Promise<void> {
        await this.filterSearchTags.clear();
        await this.filterSearchTags.type(String(tag));
        await this.filterTags(tag).click();
        await this.page.waitForTimeout(1000); // wait for load games
    }

    @step('Check filter game by playing mode')
    async checkFilterByMode(modes: string[]): Promise<void> {
        for (let i = 0; i < modes.length; i++) {
            await this.filterPlayingMode(modes[i]);
        }
        await this.openFirstGame();
    }

    @step('Filter by playing mode')
    async filterPlayingMode(mode: string): Promise<void> {
        let playingMode;
        switch (mode) {
            case 'co-op':
                playingMode = 0;
                break;
            case 'cross-platform':
                playingMode = 1;
                break;
            case 'multi-player':
                playingMode = 2;
                break;
            case 'online co-op':
                playingMode = 3;
                break;
            case 'online multiplayer':
                playingMode = 4;
                break;
            case 'single player':
                playingMode = 5;
                break;
            default:
                throw new Error(`Cannot find requested mode! - ${mode}`);
        }
        const playingModeElements = (await this.filterGroupTxt('Playing modes'))[playingMode];
        if (Array.isArray(playingModeElements)) {
            await Promise.all(playingModeElements.map(element => element.waitForElementState({ state: 'visible' })));
            await playingModeElements.click();
        }
    }

    @step('Check filter game by feature')
    async checkFilterByFeature(features: string[]): Promise<void> {
        for (let i = 0; i < features.length; i++) {
            await this.filterFeature(features[i]);
        }
        await this.openFirstGame();
    }

    @step('Filter game by feature')
    async filterFeature(feature: string): Promise<void> {
        let number;
        switch (feature) {
            case 'Achievements':
                number = 0;
                break;
            case 'Beta':
                number = 1;
                break;
            case 'Cloud Save':
                number = 2;
                break;
            case 'Controller Support':
                number = 3;
                break;
            case 'Early-Access':
                number = 4;
                break;
            case 'Ingame Items':
                number = 5;
                break;
            case 'Leaderboard':
                number = 6;
                break;
            case 'Resalable':
                number = 7;
                break;
            case 'Secure Anti-Cheat':
                number = 8;
                break;
            case 'Transferable':
                number = 9;
                break;
            case 'Vr Support':
                number = 10;
                break;
            case 'Workshop Mods':
                number = 11;
                break;
            default:
                throw new Error(`Cannot find requested feature! - ${feature}`);
        }
        const featuresElements = (await this.filterGroupTxt('Features'))[number];
        if (Array.isArray(featuresElements)) {
            await Promise.all(featuresElements.map(element => element.waitForElementState({ state: 'visible' })));
            await featuresElements.click();
        }
        await this.page.waitForTimeout(1000); // wait for load games
    }

    @step('Check filter game by genre and playing modes')
    async checkFilterByGenreAndPlayingMode(genre: genreSelector, playingMode: string): Promise<void> {
        await this.filterGenre(genre);
        await this.filterPlayingMode(playingMode);
        await this.openFirstGame();
    }

    @step('Reload page')
    async reloadPage() {
        await this.page.reload();
    }

    @step('Wait for Store page displayed')
    async waitForDisplayed(): Promise<void> {
        await this.searchBrowseGames.waitFor({ state: 'attached' });
    }

    @step('Check filter game by tag and features')
    async checkFilterByTagAndFeature(tag: tagSelector, feature: string): Promise<void> {
        await this.filterTag(tag);
        await this.filterFeature(feature);
        await this.openFirstGame();
    }

    @step('Check filter game by all filters')
    async checkFilterByAll(genre: genreSelector, tag: tagSelector, mode: string, feature: string): Promise<void> {
        await this.filterGenre(genre);
        await this.filterTag(tag);
        await this.filterPlayingMode(mode);
        await this.filterFeature(feature);
        await this.openFirstGame();
    }

    @step('Click store btn')
    async clickStoreBtn() {
        await this.goToStoreBtn.click();
    }

    @step('Check the number of recommended games')
    async checkRecommendedGamesCount(count: number): Promise<number> {
        await expect(await this.recommendedGamesSlides.count()).toBeGreaterThanOrEqual(count);
    }

    @step('Get the "Game name" from games carousel')
    async getActiveSlideTitle(): Promise<string | null | undefined> {
        return await this.activeSlideTitle.textContent();
    }

    @step('Navigate through the carousel using right arrow')
    async clickChangeSlideUsingRightArrow(): Promise<void> {
        await this.activeSlideArrowBtn('next').click();
    }

    @step('Wait for the change slide')
    async waitForChangeSlide(): Promise<void> {
        await this.page.waitForTimeout(2000);
    }

    @step('Click the "Buy" button for one of the games from the carousel')
    async clickPriceBtnOnActiveSlide(): Promise<void> {
        await this.activeSlidePriceBtn.waitFor();
        await this.activeSlidePriceBtn.click();
    }

    @step('Click the "Learn More" button for one of the games from the carousel.')
    async clickLearnMoreBtnOnActiveSlide(): Promise<void> {
        await this.activeSlideDarkBtn.click();
    }

    @step('Navigate through the carousel using the bottom selector')
    async clickChangeSlide(selector: number): Promise<void> {
        await this.changeSlideUsingBottomSelector[selector].click();
        await this.gameDetailsButton[0].hover();
    }
}
