const scholarshipScraper = require('../services/scraper/scholarshipScraper');

async function testScraper() {
    try {
        const results = await scholarshipScraper.scrapeAllScholarships();
        console.log(JSON.stringify(results, null, 2));
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testScraper();