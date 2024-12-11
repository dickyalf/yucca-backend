const { ChatOpenAI } = require('langchain/chat_models/openai');
const { ConversationChain, LLMChain } = require('langchain/chains');
const { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } = require('langchain/prompts');
const { BufferMemory } = require('langchain/memory');
const { PDFLoader } = require('langchain/document_loaders/fs/pdf');
const scholarshipScraper = require('./scraper/scholarshipScraper');
const config = require('../config/config');

class LangChainService {
    constructor() {
        this.model = new ChatOpenAI({
            temperature: config.llm.temperature,
            modelName: config.llm.model,
            openAIApiKey: config.openaiApiKey
        });

        this.memory = new BufferMemory({
            memoryKey: "chat_history",
            inputKey: "question",
            outputKey: "answer"
        });
        
        this.knowledgeBase = {
            pmb: null,
            academic: null,
            scholarships: null
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
                const scholarshipData = await scholarshipScraper.scrapeAllScholarships();
                this.knowledgeBase.scholarships = scholarshipData.scholarships
                    .map(s => `${s.title}\n${s.content}`).join('\n\n');
                console.log('Scholarship data loaded successfully');
            } catch (error) {
                console.error('Error loading scholarship data:', error);
                this.knowledgeBase.scholarships = 'Informasi beasiswa tidak tersedia';
            }

            console.log('Documents loading process completed');
        } catch (error) {
            console.error('Error in loadDocuments:', error);
            throw error;
        }
    }

    async processQuery(question) {
        try {
            if (!this.chain) {
                throw new Error('LangChain service not initialized');
            }
    
            const pmb_info = this.getRelevantInfo(question, 'pmb');
            const academic_info = this.getRelevantInfo(question, 'academic');
            const scholarship_info = this.getRelevantInfo(question, 'scholarships');
    
            const response = await this.chain.call({
                question: question,
                pmb_info: pmb_info,
                academic_info: academic_info,
                scholarship_info: scholarship_info
            });
    
            const trimmedResponse = response.answer
                .replace(/\s+/g, ' ')
                .replace(/[#*]/g, '')
                .trim();
    
            const history = await this.memory.loadMemoryVariables({});
    
            return {
                status: 'success',
                response: {
                    trim: trimmedResponse,
                    formatted: response.answer
                },
                history: history.chat_history
            };
    
        } catch (error) {
            console.error('Error processing query:', error);
            throw error;
        }
    }

    getRelevantInfo(query, type) {
        const content = this.knowledgeBase[type];
        if (!content) return 'Informasi tidak tersedia';

        const paragraphs = content.split('\n\n');
        const keywords = query.toLowerCase().split(' ');
        const relevantParagraphs = paragraphs.filter(para => 
            keywords.some(keyword => 
                para.toLowerCase().includes(keyword)
            )
        );

        return relevantParagraphs.length > 0 
            ? relevantParagraphs.join('\n\n')
            : content.substring(0, 1000);
    }

    async clearHistory() {
        await this.memory.clear();
    }
}

module.exports = new LangChainService();