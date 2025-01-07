// test.js
const langchainService = require('../services/langchainService');

async function testService() {
    try {
        // Initialize service with delay to ensure WebSocket is ready
        await langchainService.initialize();
        // Add small delay after initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Service initialized successfully');

        // Test question
        const question = "Bagaimana cara mendaftar kuliah?";
        console.log('\nAsking question:', question);

        // Process query with callback
        langchainService.processQuery(question, async (response) => {
            if (response.status === 'success') {
                console.log('\nText Response:', response.response.text);
                
                // Save audio file
                const fs = require('fs').promises;
                const audioData = Buffer.from(response.response.voice.audio, 'base64');
                await fs.writeFile('test-response.mp3', audioData);
                console.log('\nAudio saved as test-response.mp3');

                // Test follow-up question
                const followUpQuestion = "Berapa biayanya?";
                console.log('\nAsking follow-up question:', followUpQuestion);
                
                langchainService.processQuery(followUpQuestion, async (followUpResponse) => {
                    if (followUpResponse.status === 'success') {
                        console.log('\nFollow-up Text Response:', followUpResponse.response.text);
                        
                        // Save follow-up audio
                        const followUpAudioData = Buffer.from(followUpResponse.response.voice.audio, 'base64');
                        await fs.writeFile('test-response-2.mp3', followUpAudioData);
                        console.log('\nFollow-up audio saved as test-response-2.mp3');

                        // Disconnect after testing
                        langchainService.disconnect();
                    } else {
                        console.error('Follow-up query failed:', followUpResponse.message);
                    }
                });
            } else {
                console.error('Query failed:', response.message);
            }
        });

    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
testService();