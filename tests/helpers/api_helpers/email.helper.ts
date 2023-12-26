import imaps from 'imap-simple';
import { config } from 'config_data';

const commonConfig = {
    imap: {
        user: config.IMAP.USER,
        password: config.IMAP.PASSWORD,
        host: config.IMAP.HOST,
        port: 993,
        markSeen: true,
        authTimeout: 10000,
        tls: true,
        tlsOptions: { servername: config.IMAP.HOST },
    },
};

export class EmailHelper {
    static async deleteAllEmails(): Promise<any> {
        console.log('Cleaning mailbox ...');
        try {
            const connection = await imaps.connect(commonConfig);
            await connection.openBox('INBOX');
            const fetchOptions = {
                bodies: ['TEXT'],
                markSeen: false,
                struct: true,
            };
            const searchCriteria = ['ALL'];
            const messages = await connection.search(searchCriteria, fetchOptions);
            if (messages.length >= 1) {
                const deletePromises = messages.map((message: any) => {
                    return new Promise<void>((resolve, reject) => {
                        connection.addFlags(message.attributes.uid, '\\Deleted', (err: any) => {
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                });
                await Promise.all(deletePromises);
            }
            connection.imap.closeBox(true, (err) => {
                if (err) {
                    console.error(err);
                }
            });
            connection.end();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getEmailCode(user: any, type: string): Promise<string> {
        let code = '';
        let subject = '';
        let sep = '';
        let sep2 = '';
        const fetchOptions = {
            bodies: ['TEXT'],
            markSeen: false,
            unseen: true,
            recent: true
        };
        switch (type) {
            case 'signup': {
                subject = 'Welcome  to Ultra! Confirm Your Email';
                sep = 'your email:';
                sep2 = 'If';
                break;
            }
            case 'login': {
                subject = 'Ultra: Account authentication check';
                sep = 'your identity:';
                sep2 = 'If';
                break;
            }
            case 'reset your password': {
                subject = 'Ultra: Resetting your password';
                sep = 'verification code!';
                sep2 = 'This code';
                break;
            }
        }
        const searchCriteria = [
            'ALL',
            ['TO', await user['email']],
            ['SUBJECT', subject],
        ];
        for (let i = 0; i < 20; i++) {
            if (code !== '') {
                break;
            }
            await imaps
                .connect(commonConfig)
                .then(
                    async (connection) => {
                        return await connection.openBox('INBOX').then(async () => {
                            return await connection
                                .search(searchCriteria, fetchOptions)
                                .then(async results => {
                                    if (results.length >= 1) {
                                        const temp = await results[results.length - 1].parts[0].body;
                                        code = temp
                                            .split(sep)[1]
                                            .split(sep2)[0]
                                            .trim();
                                    }
                                    return connection.end();
                                });
                        });
                    },
                )
                .catch((error: any) => {
                    console.log('ERROR: ', error);
                });
        }
        if (code === '') {
            throw new Error('Cannot get email confirmation code from gmail');
        }
        return code;
    }

    static async getEmailInfo(user: any): Promise<string> {
        let info = '';
        const subject = 'Thank you for your Ultra purchase';
        const fetchOptions = {
            bodies: ['TEXT'],
            markSeen: false,
        };
        const searchCriteria = [
            'ALL',
            ['TO', await user['email']],
            ['SUBJECT', subject],
        ];

        for (let i = 0; i < 20; i++) {
            if (info !== '') {
                break;
            }
            await imaps
                .connect(commonConfig)
                .then(
                    async (connection) => {
                        return await connection.openBox('INBOX').then(async () => {
                            return await connection
                                .search(searchCriteria, fetchOptions)
                                .then(async results => {
                                    if (results.length >= 1) {
                                        const temp = await results[results.length - 1].parts[0].body;
                                        info = temp
                                            .trim();
                                    }
                                    return connection.end();
                                });
                        });
                    },
                )
                .catch((error: any) => {
                    console.log('ERROR: ', error);
                });
        }
        if (info === '') {
            throw new Error('Cannot get email confirmation code from gmail');
        }
        return info;
    }
}
