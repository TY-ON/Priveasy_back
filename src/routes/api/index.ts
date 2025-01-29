import express, { Express, Request, Response } from 'express';
const router = express.Router();

import { analyzePolicy } from './analyzePolicy';


router.get('/analyzePolicy', async (req: Request, res: Response) => {
    const result = await analyzePolicy(req, res);
    if (!result) {
        res.status(404).send("no url");
        return;
    }
    res.status(200).send(result);
});

module.exports = router;