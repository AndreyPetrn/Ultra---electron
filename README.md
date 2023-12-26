# Electron client end-2-end automated tests

## Setup
1. Install node `v.18` (a.g. `18.12.1`)
2. From the `electron-client` repo (`https://gitlab.com/ultraio/frontend/electron-client`) build and install the Ultra electron application:
    2.1 Checkout to the `main` branch
    2.2 In the main folder (`electron-client`) install dependencies `npm install` - if there are problems, check out the `electron-client/README.md`
    2.3 Set `'loadDevTools': false` by path `\electron-client\src\base\common\data\`{ENV}`\ultra-config.ts` - to disable dev tools for client
    2.4 Build the application `npm run make:`{ENV}
    2.5 Install the Ultra application to your local machine
    2.6 Copy `workflow.dll` to the root of the `e2e-client-electron` folder
6. Go to the `e2e-client-electron` folder
7. Install dependencies `npm install`
8. Paste your config file by the path `config\config.data.json`
9. Check/update paths for `launchElectronApp()` function by path `\electron-client\e2e-tests\tests\helpers\common.helper.ts`
- if you are going to run tests on an installed client on your computer - update:
  `arguments_ = ['C:/Users/admin/AppData/Local/UltraQA/app-0.0.6/resources/app/.webpack/main'];`
  `executablePath = 'C:/Users/admin/AppData/Local/UltraQA/app-0.0.6/UltraQA.exe';`
   use the template to set YOUR local paths::
  `arguments_ = ['C:/Users/`USERNAME`/AppData/Local/Ultra`ENV`/app-`x.x.x`/resources/app/.webpack/main'];`
  `executablePath = 'C:/Users/`USERNAME`/AppData/Local/Ultra`ENV`/app-`x.x.x`/Ultra`ENV`.exe';`
- if you are going to run tests on a fresh client build - check:
  `const latestBuild = findLatestBuild('./../out/UltraAlphaQA')` 
  `executablePath = './../out/UltraAlphaQA/UltraAlphaQA-win32-x64/UltraAlphaQA.exe'`
  also, update `electronApp = await CommonHelper.launchElectronApp('custom')` to `'latest'` in specs that you are going to execute


## Running the tests

#### Login tests

`npm run test:login`

#### Wallet tests

`npm run test:wallet`

#### All tests

`npm run test`

## Allure

- To manually generate the Allure report run `npm run posttest`

## Linter

- To validate code by ESLint rules run `npm run eslint:validate` 
- To fix minor errors by ESLint run `npm run eslint:fix`

## Notes

- If you get an error when generating the Allure report, check that you have Java installed.
- In the tests used shortcut paths (e.g. `{ CommonHelper } from '@helpers/common.helper'`)
if you want to add a new shortcut, you can do it according to the example in `tsconfig.json` (`"@helpers/*": ["./tests/helpers/*"]`)

## How to encrypt data file?

`https://ultraio.atlassian.net/wiki/spaces/QA/pages/2262827009/Setting+up+and+running+client+automation+tests`
