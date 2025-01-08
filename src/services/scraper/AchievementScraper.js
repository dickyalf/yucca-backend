const axios = require('axios');
const cheerio = require('cheerio');

class AchievementScraper {
    constructor() {
        this.baseUrl = 'https://www.ciputra.ac.id/uc-prestasi/';
        this.limit = 9; // Number of achievements to fetch
    }

    async scrapeAchievements() {
        try {
            const html = await this.fetchPage();
            const achievements = await this.parseAchievements(html);
            
            return {
                status: 'success',
                achievements: achievements.slice(0, this.limit),
                total: achievements.length
            };
        } catch (error) {
            console.error('Error scraping achievements:', error);
            throw error;
        }
    }

    async fetchPage() {
        try {
            const response = await axios.get(this.baseUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching page:', error);
            throw new Error('Failed to fetch achievements page');
        }
    }

    async parseAchievements(html) {
        const $ = cheerio.load(html);
        const achievements = [];

        // Select all grid items
        $('.w-grid-item').each((_, item) => {
            const $item = $(item);
            
            // Get the title from the h2 element
            const title = $item.find('h2.post_title a').text().trim();
            
            // Get the link
            const link = $item.find('h2.post_title a').attr('href');
            
            // Get the image URL
            const imageUrl = $item.find('img').attr('src');
            
            // Determine achievement type from title
            const type = this.determineAchievementType(title);
            
            // Create achievement object
            const achievement = {
                title,
                link,
                imageUrl,
                type,
                date: this.extractDateFromTitle(title)
            };

            achievements.push(achievement);
        });

        return achievements;
    }

    determineAchievementType(title) {
        const lowerTitle = title.toLowerCase();
        
        if (lowerTitle.includes('international') || lowerTitle.includes('internasional')) {
            return 'International';
        } else if (lowerTitle.includes('nasional') || lowerTitle.includes('national')) {
            return 'National';
        } else if (lowerTitle.includes('regional')) {
            return 'Regional';
        } else {
            return 'Other';
        }
    }

    extractDateFromTitle(title) {
        const yearMatch = title.match(/\d{4}/);
        return yearMatch ? yearMatch[0] : null;
    }

    formatAchievement(achievement) {
        return {
            title: achievement.title,
            type: achievement.type,
            year: achievement.date,
            link: achievement.link,
            imageUrl: achievement.imageUrl
        };
    }
}

module.exports = new AchievementScraper();