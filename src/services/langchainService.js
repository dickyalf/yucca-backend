const { ChatOpenAI } = require('langchain/chat_models/openai');
const { ConversationChain, LLMChain } = require('langchain/chains');
const { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } = require('langchain/prompts');
const { BufferMemory } = require('langchain/memory');
const { ElevenLabsClient } = require("elevenlabs");
const { PDFLoader } = require('langchain/document_loaders/fs/pdf');
const { ProgramSimulator, programData } = require('./majorRecommender');
const scholarshipScraper = require('./scraper/scholarshipScraper');
const AchievementScraper = require('./scraper/AchievementScraper');
const AccreditationScraper  = require('./scraper/AccreditationScraper');
const config = require('../config/config');


class LangChainService {
    constructor() {
        this.programSimulator = new ProgramSimulator();
        this.model = new ChatOpenAI({
            temperature: config.llm.temperature,
            modelName: config.llm.model,
            openAIApiKey: config.openaiApiKey
        });

        this.elevenlabs = new ElevenLabsClient({
            apiKey: config.elevenLabsApiKey
        });

        this.memory = new BufferMemory({
            memoryKey: "chat_history",
            inputKey: "question",
            outputKey: "answer"
        });

        this.knowledgeBase = {
            pmb: null,
            academic: null,
            scholarships: null,
            kosLocations: null,
            foodLocations: null,
            programGuide: null,
            studentOrganization: null,
            featuredProgram: null,
            achievements: null,
            accreditations: null
        };

    }

    async initialize() {
        try {
            await this.loadDocuments();

            const chatPrompt = ChatPromptTemplate.fromPromptMessages([
                SystemMessagePromptTemplate.fromTemplate(config.llm.systemPrompt),
                HumanMessagePromptTemplate.fromTemplate(
                    "Berikut adalah konteks informasi yang tersedia:\n\n" +
                    "INFORMASI PMB:\n{pmb_info}\n\n" +
                    "INFORMASI AKADEMIK:\n{academic_info}\n\n" +
                    "INFORMASI BEASISWA:\n{scholarship_info}\n\n" +
                    "INFORMASI KOS TERDEKAT:\n{kos_info}\n\n" +
                    "INFORMASI TEMPAT MAKAN & CAFE:\n{food_info}\n\n" +
                    "INFORMASI PROGRAM STUDI:\n{program_info}\n\n" +
                    "INFORMASI ORGANISASI KEMAHASISWAAN:\n{org_info}\n\n" +
                    "INFORMASI PROGRAM UNGGULAN:\n{feat_info}\n\n" +
                    "PRESTASI TERBARU UC:\n{achievement_info}\n\n" +
                    "INFORMASI AKREDITASI:\n{accreditation_info}\n\n" +
                    "RIWAYAT CHAT:\n{chat_history}\n\n" +
                    "PERTANYAAN TERBARU: {question}\n\n" +
                    "Berikan jawaban yang formal namun ramah, berdasarkan informasi yang tersedia di atas."
                )
            ]);

            this.chain = new LLMChain({
                llm: this.model,
                prompt: chatPrompt,
                memory: this.memory,
                outputKey: "answer"
            });

            console.log('LangChain service initialized successfully');
        } catch (error) {
            console.error('Error initializing LangChain service:', error);
            throw error;
        }
    }

    async loadDocuments() {
        try {
            try {
                const pmbLoader = new PDFLoader(config.sources.pmb.path);
                const pmbDocs = await pmbLoader.load();
                this.knowledgeBase.pmb = pmbDocs.map(doc => doc.pageContent).join('\n');
                console.log('PMB document loaded successfully');
            } catch (error) {
                console.error('Error loading PMB document:', error);
                this.knowledgeBase.pmb = 'Informasi PMB tidak tersedia';
            }

            try {
                const academicLoader = new PDFLoader(config.sources.academicGuideline.path);
                const academicDocs = await academicLoader.load();
                this.knowledgeBase.academic = academicDocs.map(doc => doc.pageContent).join('\n');
                console.log('Academic document loaded successfully');
            } catch (error) {
                console.error('Error loading Academic document:', error);
                this.knowledgeBase.academic = 'Informasi Academic Guidelines tidak tersedia';
            }

            try {
                const studentOrganizationLoader = new PDFLoader(config.sources.studentOrganization.path);
                const studentOrganizationDocs = await studentOrganizationLoader.load();
                this.knowledgeBase.studentOrganization = studentOrganizationDocs.map(doc => doc.pageContent).join('\n');
                console.log('studentOrganization document loaded successfully');
            } catch (error) {
                console.error('Error loading studentOrganization document:', error);
                this.knowledgeBase.studentOrganization = 'Informasi studentOrganization tidak tersedia';
            }

            try {
                const featuredProgramLoader = new PDFLoader(config.sources.featuredProgram.path);
                const featuredProgramDocs = await featuredProgramLoader.load();
                this.knowledgeBase.featuredProgram = featuredProgramDocs.map(doc => doc.pageContent).join('\n');
                console.log('featuredProgram document loaded successfully');
            } catch (error) {
                console.error('Error loading featuredProgram document:', error);
                this.knowledgeBase.featuredProgram = 'Informasi featuredProgram Guidelines tidak tersedia';
            }

            try {
                const scholarshipData = await scholarshipScraper.scrapeAllScholarships();
                this.knowledgeBase.scholarships = scholarshipData.scholarships
                    .map(s => `${s.title}\n${s.content}`).join('\n\n');
                console.log('Scholarship data loaded successfully');
            } catch (error) {
                console.error('Error loading scholarship data:', error);
                this.knowledgeBase.scholarships = 'Informasi beasiswa tidak tersedia';
            }

            try {
                const kosLocationScraper = require('./scraper/KosLocationScraper');
                const kosData = await kosLocationScraper.searchNearbyKos();
                this.knowledgeBase.kosLocations = kosData.kosLocations
                    .map(kos => `
    Nama: ${kos.name}
    Alamat: ${kos.address}
    Jarak dari UC: ${kos.distance} km
    Telepon: ${kos.phone}
    Rating: ${kos.rating}
    Total Review: ${kos.totalReviews}
    Status: ${kos.openNow ? 'Tersedia' : 'Tidak tersedia'}
    Google Maps: ${kos.url}
                    `).join('\n\n');
                console.log('Kos location data loaded successfully');
            } catch (error) {
                console.error('Error loading kos location data:', error);
                this.knowledgeBase.kosLocations = 'Informasi kos tidak tersedia';
            }

            try {
                const foodLocationScraper = require('./scraper/FoodLocationScraper');
                const foodData = await foodLocationScraper.searchNearbyFood();
                this.knowledgeBase.foodLocations = foodData.foodLocations
                    .map(food => `
    Nama: ${food.name}
    Tipe: ${food.type}
    Alamat: ${food.address}
    Jarak dari UC: ${food.distance} km
    Kisaran Harga: ${food.priceLevel}
    Telepon: ${food.phone}
    Rating: ${food.rating}
    Total Review: ${food.totalReviews}
    Status: ${food.openNow ? 'Buka' : 'Tutup'}
    Jenis Masakan: ${food.cuisine.join(', ') || 'Tidak tersedia'}
    Jam Operasional: ${food.openingHours.length > 0 ? '\n' + food.openingHours.join('\n') : 'Tidak tersedia'}
    Google Maps: ${food.url}
                    `).join('\n\n');
                console.log('Food location data loaded successfully');
            } catch (error) {
                console.error('Error loading food location data:', error);
                this.knowledgeBase.foodLocations = 'Informasi tempat makan tidak tersedia';
            }

            try {
                if (!this.programSimulator || !this.programSimulator.programData) {
                    throw new Error('Program simulator not properly initialized');
                }

                const programContentArray = [];

                for (const [school, programs] of Object.entries(this.programSimulator.programData)) {
                    let schoolContent = `\n== ${school} ==\n`;

                    for (const [program, info] of Object.entries(programs)) {
                        schoolContent += `\nProgram: ${program}\n`;
                        schoolContent += `Deskripsi: ${info.description}\n`;
                        schoolContent += `Minat: ${info.interests.join(', ')}\n`;
                        schoolContent += `Karir: ${info.careers.join(', ')}\n`;
                        schoolContent += `Mata Kuliah Utama: ${info.subjects.join(', ')}\n`;
                        schoolContent += `Kekuatan yang Dibutuhkan: ${info.strengths.join(', ')}\n`;
                        schoolContent += `Bahasa Pengantar: ${info.language}\n`;
                    }

                    programContentArray.push(schoolContent);
                }

                this.knowledgeBase.programGuide = programContentArray.join('\n');
                console.log('Program guide loaded successfully');
            } catch (error) {
                console.error('Error loading program guide:', error);
                this.knowledgeBase.programGuide = 'Informasi program tidak tersedia';
            }

            try {
                const achievementData = await AchievementScraper.scrapeAchievements();
                
                const formattedAchievements = achievementData.achievements.map(achievement => 
                    `Prestasi: ${achievement.title}\n` +
                    `Kategori: ${achievement.type}\n` +
                    `Tahun: ${achievement.date}\n` +
                    `Link: ${achievement.link}\n`
                ).join('\n');
    
                this.knowledgeBase.achievements = formattedAchievements;
                console.log('Achievement data updated successfully');
            } catch (error) {
                console.error('Error updating achievement data:', error);
                this.knowledgeBase.achievements = 'Informasi prestasi tidak tersedia';
            }

            try {
                const accreditationData = await AccreditationScraper.scrape();
                this.knowledgeBase.accreditations = accreditationData;
                console.log('Accreditation data updated successfully');
            } catch (error) {
                console.error('Error updating accreditation data:', error);
                this.knowledgeBase.accreditations = 'Informasi akreditasi tidak tersedia';
            }

            console.log('Documents loading process completed');
        } catch (error) {
            console.error('Error in loadDocuments:', error);
            throw error;
        }
    }

    async processQuery(question) {
        try {
            console.log('Accreditations:', this.knowledgeBase.accreditations);
            const pmb_info = this.getRelevantInfo(question, 'pmb');
            const academic_info = this.getRelevantInfo(question, 'academic');
            const scholarship_info = this.getRelevantInfo(question, 'scholarships');
            const kos_info = this.getRelevantInfo(question, 'kosLocations');
            const food_info = this.getRelevantInfo(question, 'foodLocations');
            let program_info = this.getRelevantInfo(question, 'programGuide');
            const org_info = this.getRelevantInfo(question, 'studentOrganization');
            const feat_info = this.getRelevantInfo(question, 'featuredProgram');
            const achievement_info = this.getRelevantInfo(question, 'achievements');
            const accreditation_info = this.getRelevantInfo(question, 'accreditations');
            const preferences = this.extractProgramPreferences(question);

            if (preferences) {
                try {
                    const recommendations = await this.programSimulator.simulateProgram(preferences);
                    const recommendationsText = this.formatProgramRecommendations(recommendations);
                    program_info = `${program_info}\n\nREKOMENDASI PROGRAM:\n${recommendationsText}`;
                } catch (error) {
                    console.error('Error generating program recommendations:', error);
                }
            }

            const response = await this.chain.call({
                question,
                pmb_info,
                academic_info,
                scholarship_info,
                kos_info,
                food_info,
                program_info,
                org_info,
                feat_info,
                achievement_info,
                accreditation_info
            });

            const trimmedResponse = response.answer
                .replace(/\s+/g, ' ')
                .replace(/[#*]/g, '')
                .trim();

            const voiceResponse = await this.generateVoiceResponse(trimmedResponse);

            const history = await this.memory.loadMemoryVariables({});

            return {
                status: 'success',
                response: {
                    text: {
                        trim: trimmedResponse,
                        formatted: response.answer
                    },
                    voice: voiceResponse
                },
                history: history.chat_history
            };

        } catch (error) {
            console.error('Error processing query:', error);
            throw error;
        }
    }

    async generateVoiceResponse(text) {
        try {
            const normalizedText = this.normalizeTextForSpeech(text);

            const response = await this.elevenlabs.textToSpeech.convert(
                config.elevenLabs.voiceId, 
                {
                    text: normalizedText,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                        style: 0.05,
                    }
                }
            );

            const chunks = [];
            for await (const chunk of response) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            return buffer.toString('base64');

        } catch (error) {
            console.error('Error generating voice response:', error);
            throw error;
        }
    }

    extractProgramPreferences(question) {
        const lowerQuestion = question.toLowerCase();

        if (!lowerQuestion.includes('jurusan') &&
            !lowerQuestion.includes('program') &&
            !lowerQuestion.includes('fakultas')) {
            return null;
        }

        const preferences = {
            interests: [],
            strengths: [],
            language_preference: 'any',
            career_goals: [],
            academic_subjects: []
        };

        if (lowerQuestion.includes('suka') || lowerQuestion.includes('minat')) {
            const interestKeywords = ['bisnis', 'teknologi', 'seni', 'kesehatan', 'desain', 'komputer'];
            preferences.interests = interestKeywords.filter(keyword =>
                lowerQuestion.includes(keyword));
        }

        if (lowerQuestion.includes('bisa') || lowerQuestion.includes('kemampuan')) {
            const strengthKeywords = ['matematika', 'komunikasi', 'analisis', 'kreativitas'];
            preferences.strengths = strengthKeywords.filter(keyword =>
                lowerQuestion.includes(keyword));
        }

        if (lowerQuestion.includes('bahasa inggris')) {
            preferences.language_preference = 'english';
        } else if (lowerQuestion.includes('bahasa indonesia')) {
            preferences.language_preference = 'indonesia';
        }

        if (preferences.interests.length === 0 &&
            preferences.strengths.length === 0 &&
            preferences.language_preference === 'any') {
            return null;
        }

        return preferences;
    }

    formatProgramRecommendations(recommendations) {
        if (!recommendations || recommendations.recommendations.length === 0) {
            return '';
        }

        return `
    Berdasarkan preferensi yang kamu sebutkan, berikut adalah rekomendasi program studi yang mungkin cocok untukmu:
    
    ${recommendations.recommendations.map((rec, index) => `
    ${index + 1}. ${rec.program} (${rec.school})
       Tingkat Kecocokan: ${rec.overallMatch}
       ${rec.matchDetails.join('\n   ')}
       
       Deskripsi: ${rec.programInfo.description}
       Prospek Karir: ${rec.programInfo.careers.join(', ')}
       Mata Kuliah Utama: ${rec.programInfo.subjects.join(', ')}
    `).join('\n')}
    
    Total program yang dianalisis: ${recommendations.totalPrograms}
    `;
    }

    normalizeTextForSpeech(text) {
        return text
            .replace(/&/g, ' dan ')
            .replace(/\bUC\b/g, 'Universitas Ciputra')
            .replace(/\[Google Maps\]/g, 'Lokasi dapat dilihat melalui link yang tersedia')
            .replace(/https?:\/\/[^\s,]+/g, '')
            .replace(/\bKec\.\s*/g, 'Kecamatan ')
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
            .replace(/(\d+)\.\s+/g, (match, number) => {
                const numbersInWords = [
                    'pertama', 'kedua', 'ketiga', 'keempat', 'kelima',
                    'keenam', 'ketujuh', 'kedelapan', 'kesembilan', 'kesepuluh',
                    'kesebelas', 'kedua belas', 'ketiga belas', 'keempat belas', 'kelima belas',
                    'keenam belas', 'ketujuh belas', 'kedelapan belas', 'kesembilan belas', 'kedua puluh',
                    'kedua puluh satu', 'kedua puluh dua', 'kedua puluh tiga', 'kedua puluh empat', 'kedua puluh lima'
                ];
                return `yang ${numbersInWords[parseInt(number) - 1] || number}, `;
            })
            .replace(/\bUC\b/g, 'Universitas Ciputra')
            .replace(/\b(dr|mr|mrs|ms|prof)\./gi, match => match.toLowerCase() === 'dr.' ? 'dokter' : match)
            .replace(/[-•]\s+/g, ', ')
            .replace(/([.!?])\s+/g, '$1, ')
            .replace(/[:,]\s+/g, ', ')
            .replace(/\((.*?)\)/g, ', $1, ')
            .replace(/[*_#`]/g, '')
            .replace(/\s+/g, ' ')
            .replace(/,+/g, ',')
            .replace(/\s+,/g, ',')
            .replace(/,\s+([,.])/g, '$1')
            .trim();
    }

    numberToWords(num) {

        const numbers = {
            0: 'nol', 1: 'satu', 2: 'dua', 3: 'tiga', 4: 'empat', 5: 'lima',
            6: 'enam', 7: 'tujuh', 8: 'delapan', 9: 'sembilan', 10: 'sepuluh'
        };
        return numbers[num] || num;
    }

    getRelevantInfo(query, type) {
        const content = this.knowledgeBase[type];
        if (!content) return 'Informasi tidak tersedia';

        const paragraphs = content.split('\n\n');
        const keywords = query.toLowerCase().split(' ');

        if (type === 'foodLocations') {
            const foodKeywords = [
                'makan', 'makanan', 'cafe', 'kafe', 'restoran', 'restaurant',
                'warung', 'kuliner', 'coffee', 'kopi', 'murah', 'mahal'
            ];

            if (keywords.some(word => foodKeywords.includes(word))) {
                if (query.includes('murah')) {
                    return paragraphs.filter(para =>
                        para.includes('Murah') || para.includes('Terjangkau')
                    ).join('\n\n');
                }
                if (query.includes('mahal')) {
                    return paragraphs.filter(para =>
                        para.includes('Mahal') || para.includes('Very Expensive')
                    ).join('\n\n');
                }
            }
        }

        const relevantParagraphs = paragraphs.filter(para =>
            keywords.some(keyword =>
                para.toLowerCase().includes(keyword)
            )
        );

        return relevantParagraphs.length > 0
            ? relevantParagraphs.join('\n\n')
            : content.substring(0, 1000);
    }

    formatAccreditationInfo(data) {
        const sections = [];

        if (data.institution.length > 0) {
            const latest = data.institution[0];
            sections.push(`Akreditasi Institusi: ${latest.grade} (${latest.year})`);
        }

        const formatPrograms = (programs, level) => {
            return Object.entries(programs).map(([name, accreditations]) => {
                const latest = accreditations[0];
                return `${name} (${level}): ${latest.grade} (${latest.year})`;
            });
        };

        sections.push(...formatPrograms(data.undergraduate, 'S1'));
        sections.push(...formatPrograms(data.graduate, 'S2/S3'));
        sections.push(...formatPrograms(data.professional, 'Profesi'));

        if (data.external) {
            Object.entries(data.external).forEach(([category, certs]) => {
                if (certs.length > 0) {
                    sections.push(`${category}: ${certs[0].grade} (${certs[0].year})`);
                }
            });
        }

        return sections.join('\n');
    }

    async clearHistory() {
        await this.memory.clear();
    }
}

module.exports = new LangChainService();