import express, { Request, Response } from 'express';
import { crawlPrivacy } from '../utils/crawl';
import { generateContentWithGemini } from '../utils/useAi';

const router = express.Router();

// GET 요청: 개인정보처리방침 크롤링 + AI 요약 자동 실행
router.get('/', async (req: Request, res: Response) => {
    const url = req.query.url?.toString();
    if (!url) {
        res.status(404).send("no url");
        return;
    }

    try {
        // 개인정보처리방침 크롤링
        const privacyText = await crawlPrivacy(url);
        if (!privacyText) {
            res.status(404).send("no privacy");
            return;
        }

        //AI 요약 실행
        const summary = await generateContentWithGemini(`Summarize this privacy policy:\n\n${privacyText}`);
        if (!summary) {
            res.status(500).send("failed to generate summary");
            return;
        }

        // 3️⃣ 최종 요약 내용 반환
        res.status(200).send(summary);
    } catch (error) {
        console.error("AI summarization error:", error);
        res.status(500).send("internal server error");
    }
});

router.get('/test', async (req: Request, res: Response) => {
    const url = req.query.url?.toString();
    if (!url) {
        res.status(404).send("no url");
        return;
    }

    try {
        const privacyText = await crawlPrivacy(url);
        if (!privacyText) {
            res.status(404).send("no privacy");
            return;
        }

        res.status(200).send({"privacyText": privacyText});
    } catch (error) {
        console.error("AI summarization error:", error);
        res.status(500).send("internal server error");
    }
});

module.exports = router;
