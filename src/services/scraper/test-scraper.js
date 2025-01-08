const UCAccreditationScraper = require('./AccreditationScraper');
const axios = require('axios');

async function test() {
    try {
        // Fetch HTML from the URL
        const response = await axios.get('https://www.ciputra.ac.id/qa/certification-and-accreditation/');
        const html = response.data;

        // Process HTML with the scraper
        const data = await UCAccreditationScraper.scrape(html);
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}

test();
