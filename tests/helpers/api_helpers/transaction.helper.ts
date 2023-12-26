import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { TextDecoder, TextEncoder } from 'text-encoding';
import { config } from 'config_data';

const fetch = require('cross-fetch');
const eosioUrl = config.EOSIO.URL;
const eosioKey = config.EOSIO.KEY;

export class TransactionHelper {
    static async sendUOS(UOSAmount: string, walletId: string|any): Promise<any> {
        const signatureProvider = new JsSignatureProvider([eosioKey]);
        const rpc = new JsonRpc(eosioUrl, { fetch });
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        try {
            const result = await api.transact({
                actions: [{
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: 'ultra.test',
                        permission: 'active',
                    }],
                    data: {
                        from: 'ultra.test',
                        to: walletId,
                        quantity: `${UOSAmount}.00000000 UOS`,
                        memo: 'First transfer',
                    },
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
            console.dir(result);
        } catch (err) {
            console.error(err);
        }
    }
}
