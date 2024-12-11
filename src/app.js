const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const chatRoutes = require('./routes/chatRoutes');
const langchainService = require('./services/langchainService');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', chatRoutes);

async function initializeServices() {
    try {
        await langchainService.initialize();
        console.log('Services initialized successfully');
    } catch (error) {
        console.error('Error initializing services:', error);
        process.exit(1);
    }
}

async function startServer() {
    try {
        await initializeServices();
        
        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
            console.log(`Environment: ${config.nodeEnv}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();