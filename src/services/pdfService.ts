import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { getOrderTemplate } from '../templates/orderTemplate';

export const generateOrderPDF = async (order: any): Promise<Buffer> => {
    let browser;
    try {
        // إعداد HTML
        const htmlContent = getOrderTemplate(order);

        // إطلاق المتصفح مع خيارات محسنة للأداء ومتوافقة مع Render
        browser = await puppeteer.launch({
            args: (chromium as any).args,
            defaultViewport: (chromium as any).defaultViewport || null,
            executablePath: await (chromium as any).executablePath(),
            headless: (chromium as any).headless === undefined ? true : (chromium as any).headless,
            ignoreHTTPSErrors: true,
        } as any);

        const page = await browser.newPage();

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
        // إغلاق المتصفح دائماً لتجنب استهلاك الذاكرة
        if (browser) {
            await browser.close();
        }
    }
};
