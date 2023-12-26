import fs from 'fs/promises';

export class FileHelper {
    static async deleteFile(path: string): Promise<void> {
        try {
            await fs.unlink(path);
        } catch (error: any) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }

    static async writeResponseToJson(responseBody: any, path: string): Promise<void> {
        try {
            await fs.writeFile(path, JSON.stringify(responseBody, null, '\t'));
        } catch (error: any) {
            throw error;
        }
    }
}
