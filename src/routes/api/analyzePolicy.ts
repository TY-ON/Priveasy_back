import { Request, Response } from 'express';
import { crawlPrivacy } from '../utils/crawl';

export async function analyzePolicy(req: Request, res: Response) {
    const url = req.query.url?.toString();
    if (!url) {
        return false;
    }
    const result = await crawlPrivacy(url);
    return result;
};