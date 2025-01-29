import express from 'express';
const router = express.Router();

const analyzePolicy = require('./analyzePolicy');

router.use('/analyzePolicy', analyzePolicy);

module.exports = router;