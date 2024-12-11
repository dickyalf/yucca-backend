const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../config/config');


class ScholarshipScraper {
    constructor() {
        this.scholarshipUrls = config.sources.scholarship.urls;
        this.delay = 2000;
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async scrapeAllScholarships() {
        const scholarships = [];
        for (const url of this.scholarshipUrls) {
            await this.sleep(this.delay);
            const result = await this.scrapeSingleScholarship(url);
            scholarships.push(result);
        }
        return { scholarships, lastUpdated: new Date().toISOString() };
    }

    async scrapeSingleScholarship(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            $('.post-views').remove();
            $('.l-footer').remove();
            $('script').remove();
            $('style').remove();
            $('.dashicons').remove();

            const content = $('.l-section-h').text()
                .replace(/\s+/g, ' ')
                .replace(/\n+/g, '\n')
                .trim();

            const tables = [];
            $('table').each((_, table) => {
                const tableData = [];
                $(table).find('tr').each((_, row) => {
                    const rowData = $(row).find('td, th')
                        .map((_, cell) => $(cell).text().trim())
                        .get();
                    tableData.push(rowData);
                });
                tables.push(tableData);
            });

            return {
                url,
                title: $('h3').first().text().trim(),
                content,
                tables,
                scrapedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error(`Error scraping ${url}:`, error);
            return {
                url,
                error: error.message,
                scrapedAt: new Date().toISOString()
            };
        }
    }

    extractCleanText(content) {
        return content
            .replace(/<[^>]+>/g, '\n')
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n')
            .trim();
    }
}

module.exports = new ScholarshipScraper();
