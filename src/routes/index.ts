import express, { Express, Request, Response } from 'express';

var router = express.Router();

router.get('/', function(req: Request, res: Response, next) {
    res.send('index page');
});

module.exports = router;