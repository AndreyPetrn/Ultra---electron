import { UserDataHelper } from '@helpers/data_helpers/user.data.helper';
import { FileHelper } from '@helpers/file.helper';
import axios, { AxiosInstance } from 'axios';
import { config } from 'config_data';

const adminGroupConfig = [
    config.KEYCLOAK.Platform_Admin,
    config.KEYCLOAK.Company_Admin,
    config.KEYCLOAK.Company_Owner,
    config.KEYCLOAK.Game_Admin,
    config.KEYCLOAK.Wallet_Admin,
    config.KEYCLOAK.Marketplace_Admin,
    config.KEYCLOAK.Ultra_Admin,
];

export class KeycloakHelper {
    public readonly instance: AxiosInstance;
    constructor(token: any) {
        this.instance = axios.create({
            baseURL: config.KEYCLOAK.USR_URL,
            timeout: 3000,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                Cookie: config.KEYCLOAK.USR_COOK,
            }
        });
    }

    static async getAccessToken(): Promise<string> {
        const response = await axios.post(config.KEYCLOAK.ACC_URL, new URLSearchParams({
            grant_type: config.KEYCLOAK.TYPE,
            client_id: config.KEYCLOAK.CLIENTID,
            client_secret: config.KEYCLOAK.CLIENTSECRET
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data.access_token;
    }

    async createUser(user: any): Promise<any> {
        const userPayload = {
            username: user.username,
            email: user.email,
            emailVerified: true,
            firstName: user.firstName,
            lastName: user.lastName,
            attributes: {
                //TODO add the ability to use different phone numbers via Twilio API
                countryCode: 'FR',
                countryCodeVerified: true,
                mobilePhoneNumber: '+33610203040',
                mobilePhoneNumberVerified: true,
                termsAndConditionsAcceptedAt: '1',
            },
            credentials: [
                {
                    type: 'password',
                    value: config.STORE.PASSWORD,
                },
            ],
            enabled: true,
        };
        await this.instance.post(this.instance.defaults.baseURL!, JSON.stringify(userPayload));
    }

    async getUserId(user: any): Promise<any> {
        const emailParts = user.email.split('+');
        const response = await this.instance.get(`?briefRepresentation=true&first=0&max=20&search=${emailParts[0]}%2B${emailParts[1]}`);
        return response.data[0].id;
    }

    async getUserData(id: string): Promise<any> {
        const response = await this.instance.get(`/${id}`);
        return response.data;
    }

    async putUserToGroup(userId: string, groups: string): Promise<any> {
        await this.instance.put(`/${userId}/groups/${groups}`, null);
    }

    async removeUserFromGroup(userId: string, groups: string): Promise<any> {
        this.instance.defaults.baseURL = config.KEYCLOAK.GRP_URL;
        await this.instance.delete(`/${userId}/groups/${groups}`);
    }

    async createNewUser(type: string): Promise<any> {
        // Create new user
        const user = await UserDataHelper.getUser('new');
        await this.createUser(user);
        const userId = await this.getUserId(user);

        // Create user.data file
        const userData = await this.getUserData(userId);
        await FileHelper.deleteFile('test_data/user.data.json');
        await FileHelper.writeResponseToJson(userData, 'test_data/user.data.json');

        switch (type) {
            case 'WOC user': {
                break;
            }
            case 'default user': {
                await this.putUserToGroup(userId, config.KEYCLOAK.Game_User);
                await this.putUserToGroup(userId, config.KEYCLOAK.Marketplace_User);
                break;
            }
            case 'admin user': {
                for (const groupConfig of adminGroupConfig) {
                    await this.putUserToGroup(userId, groupConfig);
                }
                break;
            }
        }
        console.log('A new user was created');
        return user;
    }
}
