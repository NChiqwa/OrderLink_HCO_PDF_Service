# OrderLink PDF Service

Microservice for generating PDF documents for the OrderLink system.

## Features
- Generates order PDFs with Arabic support.
- Built with Node.js, Express, and Puppeteer.
- Lightweight and scalable.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   npm start
   ```

## API

### POST /generate-pdf
Generates a PDF for the provided order data.

**Body:** JSON object containing order details.

