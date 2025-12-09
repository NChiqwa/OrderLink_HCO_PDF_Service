import express, { Request, Response } from 'express';
import cors from 'cors';
import { generateOrderPDF } from './services/pdfService';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for large order data

app.post('/generate-pdf', async (req: Request, res: Response) => {
    try {
        const order = req.body;
        
        if (!order || !order.orderNumber) {
             res.status(400).json({ error: 'Invalid order data' });
             return;
        }

        console.log(`Generating PDF for order #${order.orderNumber}`);

        const pdfBuffer = await generateOrderPDF(order);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=order-${order.orderNumber}.pdf`
        );
        res.setHeader('Content-Length', pdfBuffer.length);

        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'OrderLink PDF Service' });
});

app.listen(PORT, () => {
    console.log(`PDF Service running on port ${PORT}`);
});
