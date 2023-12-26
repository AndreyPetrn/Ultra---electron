import { test } from '@playwright/test';
import { allure } from 'allure-playwright';

interface PageContext {
  page: import('playwright').Page;
}

export function step<This extends PageContext>(stepName: string) {
    return function (
        target: (this: This, ...args: any[]) => Promise<void>,
        context: ClassMethodDecoratorContext<This, (this: This, ...args: any[]) => Promise<void>>,
    ) {
        async function replacementMethod(this: This, ...args: any[]): Promise<void> {
            const name = stepName || `${this.constructor.name}.${context.name as string}(${args.map((a) => JSON.stringify(a)).join(',')})`;
            return test.step(name, async () => {
                try {
                    await target.call(this, ...args);
                } catch (error) {
                    const screenshot = await this.page.screenshot();
                    await allure.attachment('Screenshot', screenshot, 'image/png');
                    test.fail;
                    throw error;
                }
            });
        }
        return replacementMethod;
    };
}
