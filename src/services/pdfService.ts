import puppeteer from 'puppeteer';
import { getOrderTemplate } from '../templates/orderTemplate';

export const generateOrderPDF = async (order: any): Promise<Buffer> => {
    let browser;
    try {
        // إعداد HTML
        const htmlContent = getOrderTemplate(order);

        // إطلاق المتصفح مع خيارات محسنة للأداء
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-extensions',
                '--no-zygote',
            ],
        });

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
