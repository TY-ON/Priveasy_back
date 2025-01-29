import express, { Request, Response } from 'express';
import { crawlPrivacy } from '../utils/crawl';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const url = req.query.url?.toString();
    if (!url) {
        res.status(404).send("no url");
        return;
    }
    const result = await crawlPrivacy(url);

    if (!result) {
        res.status(404).send("no privacy");
        return;
    }
    res.status(200).send(result);
});

module.exports = router;