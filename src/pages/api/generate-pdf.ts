import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            const url = req.body; // Assume the blob URL is sent in the request body

            // Launch Puppeteer
            const browser = await puppeteer.launch({
                args: ['--start-maximized']
            });
            const page = await browser.newPage();

            // Set the content of the page to the data URL
            await page.goto(url, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                width: "30cm",
                height: "20cm",
                displayHeaderFooter: false,
                landscape: false,
                printBackground: true,
            });

            await browser.close();

            const pdfPath = path.join(process.cwd(), 'public', 'screenshot.pdf');
            fs.writeFileSync(pdfPath, pdfBuffer);
            res.send(pdfBuffer);
        } else {
            // Handle any other HTTP method
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error("ERROR", error);
        res.status(500).end('Internal Server Error');
    }
}
