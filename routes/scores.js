const express = require('express');
const router = express.Router();
const { saveScore, getBestScore } = require('../controllers/scores');
const isAuthenticated = require('../middleware/auth');

router.post('/submit', isAuthenticated, async (req, res) => {
    const idUser = req.user;
    const { gameId, score } = req.body;
    try {
        await saveScore(idUser, gameId, score);
        res.status(200).json({ message: 'Score saved successfully' });
    } catch (error) {
        console.error('Failed to save score:', error);
        res.status(500).json({ message: 'Failed to save score', error: error.message });
    }
});

router.get('/best', isAuthenticated, async (req, res) => {
    const idUser = req.user;
    const { gameId } = req.query;
    try {
        const bestScore = await getBestScore(idUser, gameId);
        res.json({ bestScore });
    } catch (error) {
        console.error('Failed to retrieve best score:', error);
        res.status(500).send('Failed to retrieve best score');
    }
});

module.exports = router;
