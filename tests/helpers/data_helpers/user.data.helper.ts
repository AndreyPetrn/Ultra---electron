import { faker } from '@faker-js/faker';
import { config } from 'config_data';

const preconditionUser = require('test_data/user.data.json');

export class UserDataHelper {
    static async getUser(type: string) {
        switch (type) {
            case 'new': {
                return {
                    username: faker.person.firstName() + new Date().getTime(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: `testapiapitest+at.${faker.string.alphanumeric(5)}@gmail.com`,
                    password: config.DEFAULT.PASSWORD,
                };
            }
            case 'default': {
                return {
                    email: config.DEFAULT.USERNAME,
                    password: config.DEFAULT.PASSWORD,
                };
            }
            case 'precondition': {
                return {
                    email: preconditionUser.email,
                    password: config.DEFAULT.PASSWORD,
                    country: preconditionUser.attributes.countryCode,
                    username: preconditionUser.username,
                    firstName: preconditionUser.firstName,
                    lastName: preconditionUser.lastName,
                };
            }
            case 'WOC': {
                return {
                    email: config.WALLET.USERNAME,
                    password: config.DEFAULT.PASSWORD,
                    receiverEmail: config.WALLET.WALLETONLY_USERNAME,
                    recipientAddress: config.WALLET.recipientAddress,
                };
            }
            case 'nonWhitelisted': {
                return {
                    email: config.WALLET.NON_WHITELISTED_USERNAME,
                    password: config.DEFAULT.PASSWORD,
                };
            }
            case 'GDC': {
                return {
                    email: config.GDC.USERNAME,
                    password: config.DEFAULT.PASSWORD,
                };
            }
            case 'gdcTestUser': {
                return {
                    name: config.GDCHELP.USERNAME,
                    email: config.GDCHELP.EMAIL,
                    password: config.DEFAULT.PASSWORD,
                    companyName: config.GDCHELP.COMPANY
                };
            }
            case 'marketplace': {
                return {
                    email: config.MARKETPLACE.USERNAME,
                    password: config.DEFAULT.PASSWORD,
                };
            }
            case 'second_user': {
                return {
                    email: config.SECONDUSER.USERNAME,
                    password: config.DEFAULT.PASSWORD,
                    username: config.SECONDUSER.USERNAME,
                };
            }
            case 'authorisation': {
                return {
                    email: config.AUTHORISATION.USERNAME,
                    password: faker.internet.password({ length: 8, memorable: true, pattern: /[A-Z]/, prefix: '1At/' }),
                };
            }
            case 'masterCenter': {
                return {
                    email: config.MASTERCENTER.USERNAME,
                    password: config.DEFAULT.PASSWORD,
                };
            }
            case 'european': {
                return {
                    email: config.EUROPEAN.EMAIL,
                    password: config.DEFAULT.PASSWORD,
                };
            }
        }
    }
}
