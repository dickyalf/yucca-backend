const axios = require('axios');
const cheerio = require('cheerio');

class AccreditationScraper {
    constructor() {
        this.baseUrl = 'https://www.ciputra.ac.id/qa/certification-and-accreditation/';
    }

    async fetchPage() {
        try {
            const response = await axios.get(this.baseUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching page:', error);
            throw new Error('Failed to fetch accreditation page');
        }
    }

    async scrape() {
        try {
            const htmlContent = await this.fetchPage();
            const $ = cheerio.load(htmlContent);
            
            const accreditations = {
                institutional: await this.scrapeInstitutional($),
                programs: await this.scrapePrograms($),
                additional: await this.scrapeAdditional($)
            };
            
            return this.formatForLangChain(accreditations);
        } catch (error) {
            console.error('Error scraping:', error);
            throw error;
        }
    }

    scrapeInstitutional($) {
        const institutionalData = {
            current: null,
            history: []
        };

        const panel = $('.vc_tta-panel').filter(function() {
            return $(this).find('.vc_tta-title-text').text().includes('Akreditasi Institusi');
        });

        panel.find('a').each((_, link) => {
            const text = $(link).text().trim();
            const url = $(link).attr('href');
            
            const matches = text.match(/\((\w+)\)/);
            const yearMatch = text.match(/\d{4}/);
            
            if (matches && yearMatch) {
                const status = matches[1];
                const year = parseInt(yearMatch[0]);
                const entry = { status, year, url };

                if (text.includes('2023') && status === 'Unggul') {
                    institutionalData.current = entry;
                } else {
                    institutionalData.history.push(entry);
                }
            }
        });

        return institutionalData;
    }

    scrapePrograms($) {
        const programs = {};

        $('.vc_tta-panel').each((_, panel) => {
            const title = $(panel).find('.vc_tta-title-text').text().trim();
            if (!title.includes('Program Studi')) return;

            const programName = this.normalizeProgramName(title);
            if (!programName) return;

            const programData = {
                current: null,
                history: [],
                international: []
            };

            $(panel).find('a').each((_, link) => {
                const text = $(link).text().trim();
                const url = $(link).attr('href');

                if (text.includes('FIBAA')) {
                    const yearMatch = text.match(/\d{4}/);
                    if (yearMatch) {
                        programData.international.push({
                            type: 'FIBAA',
                            year: parseInt(yearMatch[0]),
                            period: '2024-2029',
                            url
                        });
                    }
                    return;
                }

                const matches = text.match(/\(([\w\s-]+)\)/);
                const yearMatch = text.match(/\d{4}/);
                
                if (matches && yearMatch) {
                    const status = matches[1];
                    const year = parseInt(yearMatch[0]);
                    const entry = { status, year, url };

                    if (year >= 2023) {
                        programData.current = entry;
                    } else {
                        programData.history.push(entry);
                    }
                }
            });

            programs[programName] = programData;
        });

        return programs;
    }

    scrapeAdditional($) {
        return {
            library: this.scrapeLibrary($),
            iso: this.scrapeISO($)
        };
    }

    scrapeLibrary($) {
        const libraryData = {
            current: null,
            history: []
        };

        const panel = $('.vc_tta-panel').filter(function() {
            return $(this).find('.vc_tta-title-text').text().includes('Perpustakaan');
        });

        panel.find('a').each((_, link) => {
            const text = $(link).text().trim();
            const url = $(link).attr('href');
            
            const matches = text.match(/\((\w+)\)/);
            const yearMatch = text.match(/\d{4}/);
            
            if (matches && yearMatch) {
                const status = matches[1];
                const year = parseInt(yearMatch[0]);
                const entry = { status, year, url };

                if (year === 2024) {
                    libraryData.current = entry;
                } else {
                    libraryData.history.push(entry);
                }
            }
        });

        return libraryData;
    }

    scrapeISO($) {
        const isoData = { certifications: [] };

        const panel = $('.vc_tta-panel').filter(function() {
            return $(this).find('.vc_tta-title-text').text().includes('ISO');
        });

        panel.find('a').each((_, link) => {
            const text = $(link).text().trim();
            const url = $(link).attr('href');
            
            const matches = text.match(/ISO (\d+:\d+)\s*\((\d{4}-\d{4})\)/);
            if (matches) {
                isoData.certifications.push({
                    standard: matches[1],
                    period: matches[2],
                    url
                });
            }
        });

        return isoData;
    }

    normalizeProgramName(title) {
        const programMap = {
            'Akuntansi': 'accounting',
            'Arsitektur': 'architecture',
            'Desain Komunikasi Visual': 'visual_communication_design',
            'Desain Produk': 'product_design',
            'Ilmu Komunikasi': 'communication_science',
            'Informatika': 'informatics',
            'Kedokteran': 'medicine',
            'Kedokteran Gigi': 'dentistry',
            'Manajemen': 'management',
            'Sistem Informasi': 'information_systems',
            'Pariwisata': 'tourism',
            'Psikologi': 'psychology',
            'Teknologi Pangan': 'food_technology',
            'PSDKU': 'satellite_campus'
        };

        for (const [indo, eng] of Object.entries(programMap)) {
            if (title.includes(indo)) {
                return eng;
            }
        }
        return null;
    }

    formatForLangChain(data) {
        let formattedText = '';

        // Format institutional accreditation
        if (data.institutional.current) {
            formattedText += `AKREDITASI INSTITUSI:\n`;
            formattedText += `Status Terkini: ${data.institutional.current.status} (${data.institutional.current.year})\n`;
            if (data.institutional.history.length > 0) {
                formattedText += `Riwayat: ${data.institutional.history.map(h => 
                    `${h.status} (${h.year})`).join(', ')}\n`;
            }
            formattedText += '\n';
        }

        // Format program accreditations
        formattedText += `AKREDITASI PROGRAM STUDI:\n`;
        Object.entries(data.programs).forEach(([program, info]) => {
            formattedText += `\n${program.toUpperCase()}:\n`;
            if (info.current) {
                formattedText += `Status Terkini: ${info.current.status} (${info.current.year})\n`;
            }
            if (info.international.length > 0) {
                formattedText += `Akreditasi Internasional: ${info.international.map(i => 
                    `${i.type} (${i.period})`).join(', ')}\n`;
            }
            if (info.history.length > 0) {
                formattedText += `Riwayat: ${info.history.map(h => 
                    `${h.status} (${h.year})`).join(', ')}\n`;
            }
        });

        // Format additional accreditations
        if (data.additional.library.current) {
            formattedText += `\nAKREDITASI PERPUSTAKAAN:\n`;
            formattedText += `Status Terkini: ${data.additional.library.current.status} (${data.additional.library.current.year})\n`;
            if (data.additional.library.history.length > 0) {
                formattedText += `Riwayat: ${data.additional.library.history.map(h => 
                    `${h.status} (${h.year})`).join(', ')}\n`;
            }
        }

        if (data.additional.iso.certifications.length > 0) {
            formattedText += `\nSERTIFIKASI ISO:\n`;
            data.additional.iso.certifications.forEach(cert => {
                formattedText += `ISO ${cert.standard} (Periode: ${cert.period})\n`;
            });
        }

        return formattedText;
    }
}

module.exports = new AccreditationScraper();