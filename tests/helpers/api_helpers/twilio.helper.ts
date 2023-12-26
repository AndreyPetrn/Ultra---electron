import axios, { AxiosInstance } from 'axios';
import { config } from 'config_data';

export class TwilioHelper {
    public readonly instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            timeout: 3000,
            headers: {
                Authorization: 'Basic ' + config.TWILIO.AUTH,
            }
        });
    }

    async getNewMobileCode(number: string): Promise<any> {
        while (true) {
            const response = await this.instance.get(`${config.TWILIO.MSG_URL}%2B1${number}&PageSize=20`);
            if (response.data.messages.length > 0) {
                return response.data.messages[0].body.split('is:')[1].trim();
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    async getNewMobileNumber(): Promise<any> {
        const response = await this.instance.get(config.TWILIO.URL);
        return response.data.split('PhoneNumber>+1')[1].split('</PhoneNumber')[0];
    }
}
