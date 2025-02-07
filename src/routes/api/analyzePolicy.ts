import express, { Request, Response } from 'express';
import { crawlPrivacy } from '../utils/crawl';
import { generateContentWithGemini } from '../utils/useAi';

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

router.post('/', async (req: Request, res: Response) => {
    const {privacyText} = req.body;
    if(!privacyText) {
        res.status(400).send("no privacyText");
        return;
    }
    try{
        const summary = await generateContentWithGemini(`summarize this privacy policy:\n\n${privacyText}`);
        if (!summary){
            res.status(500).send("failed to generate summary");
            return;
        }
        res.status(200).send(summary);
    }catch(error){
        console.error("AI summarization error", error);
        res.status(500).send("internal server error");
    }
} )

module.exports = router;