const express = require('express');
const router = express.Router();
const langchainService = require('../services/langchainService');

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({
                status: 'error',
                message: 'Message is required'
            });
        }
        
        const result = await langchainService.processQuery(message);
        res.json(result);
        
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ 
            status: 'error',
            message: error.message
        });
    }
});

router.post('/clear', async (req, res) => {
    try {
        await langchainService.clearHistory();
        res.json({ message: 'Conversation history cleared' });
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

module.exports = router;