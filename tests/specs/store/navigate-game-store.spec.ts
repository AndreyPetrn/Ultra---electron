import { expect, test } from '@playwright/test';
import { ElectronApplication } from 'playwright';
import { CommonHelper } from '@helpers/common.helper';
import { EmailHelper } from '@helpers/api_helpers/email.helper';
import { NavigationPage } from '@pages/navigation/navigation.page';
import { LoginPage } from '@pages/authentication/login.page';
import { UserDataHelper } from '@helpers/data_helpers/user.data.helper';
import { StorePage } from '@pages/store/store.page';
import { GameDetailsPage } from '@pages/store/game-details-page';
import { Store } from 'test_data/page.data.json';

let electronApp: ElectronApplication;
const user = UserDataHelper.getUser('default');

test.beforeAll(async () => {
    await EmailHelper.deleteAllEmails();
    electronApp = await CommonHelper.launchElectronApp();
    await LoginPage.login(electronApp, await user);
});

test.afterAll(async () => {
    await CommonHelper.closeElectronApp(electronApp);
});

test.describe('Game store main page', async () => {
    test('[ID#245][Ultra Games] Browse the games using filters @store', async () => {
        await test.step('Open store page', async () => {
            const navBar = await NavigationPage.getPageByURL(electronApp);
            await navBar.openStoreApp();
        });

        const storePage = await StorePage.getPageByURL(electronApp);
        const gameDetailsPage = await GameDetailsPage.getPageByURL(electronApp);

        await test.step('Filter games by single genre and check what is displayed in details', async () => {
            await storePage.checkFilterByGenre([['action']]);
            await gameDetailsPage.checkFilters('Genres', [Store.action]);
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Filter games by two genres and check what is displayed in details', async () => {
            await storePage.checkFilterByGenre([['rpg'], ['adventure']]);
            await gameDetailsPage.checkFilters('Genres', [Store.rpg, Store.adventure]);
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Filter games by genre and then remove the applied filter - check the games count is correct', async () => {
            const gamesCount = await storePage.getGamesCount();
            await storePage.filterGenre(['action']);
            await storePage.filterGenre(['action']); // removes the applied filter
            await expect(await storePage.getGamesCount()).toEqual(gamesCount);
        });

        await test.step('Filter games by tag and check what is displayed in details', async () => {
            await storePage.checkFilterByTag(['2022']);
            await gameDetailsPage.checkFilters('Tags', [Store.tag2022]);
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Filter games by tag and then remove the applied filter - check the games count is correct', async () => {
            const gamesCount = await storePage.getGamesCount();
            await storePage.filterTag(['2022']);
            await storePage.filterTag(['2022']); // removes the applied filter
            await expect(await storePage.getGamesCount()).toEqual(gamesCount);
        });

        await test.step('Filter game by playing mode and check what is displayed in details', async () => {
            await storePage.checkFilterByMode([Store.coop]);
            await gameDetailsPage.checkFilters('Playing Modes', [Store.coop]);
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Filter game by two playing modes and check what is displayed in details', async () => {
            await storePage.checkFilterByMode([Store.multiPlayer, Store.singlePlayer]);
            await gameDetailsPage.checkFilters('Playing Modes', [Store.multiPlayer, Store.singlePlayer]);
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Filter games by playing mode and then remove the applied filter - check the games count is correct', async () => {
            const gamesCount = await storePage.getGamesCount();
            await storePage.filterPlayingMode(Store.coop);
            await storePage.filterPlayingMode(Store.coop); // removes the applied filter
            await expect(await storePage.getGamesCount()).toEqual(gamesCount);
        });

        await test.step('Filter game by single feature and check what is displayed in details', async () => {
            await storePage.checkFilterByFeature([Store.beta]);
            await gameDetailsPage.checkFilterByFeature([Store.beta]);
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Filter game by two features and check what is displayed in details', async () => {
            await storePage.checkFilterByFeature([Store.leaderboard, Store.vrSupport]);
            await gameDetailsPage.checkFilterByFeature([Store.leaderboard, Store.vrSupport]);
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Filter game by two features and check what is displayed in details', async () => {
            const gamesCount = await storePage.getGamesCount();
            await storePage.filterFeature(Store.beta);
            await storePage.filterFeature(Store.beta); // removes the applied filter
            await expect(await storePage.getGamesCount()).toEqual(gamesCount);
        });

        await test.step('Filter game by genre and playing modes.Check what is displayed in details', async () => {
            await storePage.checkFilterByGenreAndPlayingMode(['flight'], Store.singlePlayer);
            await gameDetailsPage.checkFilters('Genres', [Store.flight]);
            await gameDetailsPage.checkFilters('Playing Modes', [Store.singlePlayer]);
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Filter game by tag and features.Check what is displayed in details', async () => {
            await storePage.reloadPage();
            await storePage.waitForDisplayed();
            await storePage.checkFilterByTagAndFeature(['topcars'], Store.leaderboard);
            await gameDetailsPage.checkFilters('Tags', [Store.topCars]);
            await gameDetailsPage.checkFeatureIcon(Store.leaderboard);
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Filter game by all filters and check what is displayed in details', async () => {
            await storePage.checkFilterByAll(['adventure'], ['topcars'], Store.multiPlayer, Store.leaderboard);
            await gameDetailsPage.checkFilters('Genres', [Store.adventure]);
            await gameDetailsPage.checkFilters('Tags', [Store.topCars]);
            await gameDetailsPage.checkFilters('Playing Modes', [Store.multiPlayer]);
            await gameDetailsPage.checkFeatureIcon(Store.leaderboard);
        });
    });

    test('[ID#252][Ultra Games] Navigate through the games carousel @store', async () => {
        const storePage = await StorePage.getPageByURL(electronApp);
        const gameDetailsPage = await GameDetailsPage.getPageByURL(electronApp);

        await test.step('See 2 recommended games', async () => {
            await storePage.clickStoreBtn();
            await storePage.waitForDisplayed();
            await storePage.checkRecommendedGamesCount(2);
        });

        await test.step('Check that content is changed by clicking the arrows, selector from the bottom of the carousel is changed correspondingly', async () => {
            const gameName = await storePage.getActiveSlideTitle();
            await storePage.clickChangeSlideUsingRightArrow();
            await storePage.waitForChangeSlide();
            const gameNameAfterChange = await storePage.getActiveSlideTitle();
            await expect(gameName).not.toBe(gameNameAfterChange);
        });

        await test.step('Navigate through the carousel using the bottom selector', async () => {
            const gameName = await storePage.getActiveSlideTitle();
            await storePage.clickChangeSlide(0);
            await storePage.waitForChangeSlide();
            const gameNameAfterChange = await storePage.getActiveSlideTitle();
            await expect(gameName).not.toBe(gameNameAfterChange);
        });

        const gameName = await storePage.getActiveSlideTitle();

        await test.step('Open game details page using the "Learn More" button', async () => {
            await storePage.clickLearnMoreBtnOnActiveSlide();
        });

        await test.step('Open game details page using the "Learn More" button', async () => {
            const checkGameDetails = await gameDetailsPage.getGameNameTxt();
            await expect(gameName).toBe(checkGameDetails);
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Return back to the main Games Store page', async () => {
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Open game details page using the "Buy" button', async () => {
            const gameName = await storePage.getActiveSlideTitle();
            await storePage.clickPriceBtnOnActiveSlide();
            const checkGameDetails = await gameDetailsPage.getGameNameTxt();
            await expect(gameName).toBe(checkGameDetails);
        });

        await test.step('Return back to the main Games Store page', async () => {
            await gameDetailsPage.clickStoreBtn();
        });

        await test.step('Navigate through the gallery preview using arrows', async () => {
            const gameName = await storePage.getActiveSlideTitle();
            await storePage.clickChangeSlideUsingRightArrow();
            await storePage.waitForChangeSlide();
            const gameNameAfterChange = await storePage.getActiveSlideTitle();
            await expect(gameName).not.toBe(gameNameAfterChange);
            await gameDetailsPage.clickStoreBtn();
        });
    });
});
