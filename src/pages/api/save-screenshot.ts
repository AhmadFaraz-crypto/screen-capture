import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IncomingForm } from "formidable";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const form = new IncomingForm();
        
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ error: 'Error processing the file' });
            }
            const uploadedFile = files.file;
            if (!uploadedFile || Array.isArray(uploadedFile[0].filepath)) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const publicDir = path.join(process.cwd(), 'public');
            const filePath = path.join(publicDir, 'screenshot.html');

            fs.rename(uploadedFile[0].filepath, filePath, (err) => {
                if (err) {
                    console.error('Error saving file:', err);
                    return res.status(500).json({ error: 'Error saving file' });
                }

                res.status(200).json({ message: 'File saved successfully', filePath: '/screenshot.html' });
            });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
