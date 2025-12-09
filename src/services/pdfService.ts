import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { getOrderTemplate } from '../templates/orderTemplate';

let browserInstance: any = null;

const getBrowser = async () => {
    if (browserInstance && browserInstance.isConnected()) {
        return browserInstance;
    }

    console.log('Launching new browser instance...');
    browserInstance = await puppeteer.launch({
        args: (chromium as any).args,
        defaultViewport: (chromium as any).defaultViewport || null,
        executablePath: await (chromium as any).executablePath(),
        headless: (chromium as any).headless === undefined ? true : (chromium as any).headless,
        ignoreHTTPSErrors: true,
    } as any);

    return browserInstance;
};

// Ensure browser is closed when process exits
process.on('SIGINT', async () => {
    if (browserInstance) await browserInstance.close();
    process.exit();
});

process.on('SIGTERM', async () => {
    if (browserInstance) await browserInstance.close();
    process.exit();
});

export const generateOrderPDF = async (order: any): Promise<Buffer> => {
    let page;
    try {
        const browser = await getBrowser();
        const htmlContent = getOrderTemplate(order);

        page = await browser.newPage();

        // تعيين المحتوى مع انتظار أقل صرامة لتجنب المهلة
        await page.setContent(htmlContent, {
            waitUntil: 'load', // ننتظر تحميل الصفحة والموارد الأساسية فقط
            timeout: 30000, // مهلة 30 ثانية
        });

        // توليد PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px',
            },
        });

        return Buffer.from(pdfBuffer);

    } catch (error) {
        console.error('Generate PDF error:', error);
        throw error;
    } finally {
        // نغلق الصفحة فقط، ونبقي المتصفح مفتوحاً للطلبات القادمة
        if (page) {
            await page.close();
        }
    }
};
