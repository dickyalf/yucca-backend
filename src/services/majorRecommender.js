const programData = {
    "School of Business Management": {
        "International Business Management – Regular Class": {
            description: "Program yang fokus pada pengembangan kemampuan manajemen bisnis dengan perspektif internasional",
            interests: ["Bisnis", "Entrepreneurship", "Manajemen", "Ekonomi Global"],
            careers: ["Entrepreneur", "Business Consultant", "Marketing Manager", "Business Development"],
            subjects: ["Manajemen", "Marketing", "Finance", "Business Strategy"],
            strengths: ["Kepemimpinan", "Analisis", "Komunikasi", "Networking"],
            projects: ["Business Plan Development", "Market Analysis", "Start-up Creation"],
            language: "Indonesia"
        },
        "International Business Management – International Class": {
            description: "Program IBM dengan bahasa pengantar Inggris dan exposure internasional yang lebih intensif",
            interests: ["International Business", "Global Trade", "Cross-cultural Management"],
            careers: ["International Business Manager", "Global Entrepreneur", "Export-Import Specialist"],
            subjects: ["International Business", "Global Marketing", "Cross-cultural Management"],
            strengths: ["English Proficiency", "Cultural Awareness", "Global Mindset"],
            projects: ["International Business Strategy", "Global Market Entry"],
            language: "English"
        },
        "Accounting": {
            description: "Program yang memfokuskan pada kemampuan akuntansi, audit, dan analisis keuangan",
            interests: ["Akuntansi", "Keuangan", "Audit", "Analisis Data"],
            careers: ["Akuntan Publik", "Auditor", "Financial Analyst", "Tax Consultant"],
            subjects: ["Financial Accounting", "Management Accounting", "Taxation", "Audit"],
            strengths: ["Numerical", "Analytical", "Detail-oriented", "Systematic"],
            projects: ["Financial Statement Analysis", "Audit Planning"],
            language: "Indonesia"
        },
        "UC Online Learning – S1 IBM": {
            description: "Program IBM yang dapat diakses secara online dengan fleksibilitas waktu",
            interests: ["Business Management", "Digital Business", "Remote Learning"],
            careers: ["Digital Entrepreneur", "Online Business Manager", "E-commerce Specialist"],
            subjects: ["Digital Business", "E-commerce", "Online Marketing"],
            strengths: ["Self-discipline", "Digital Literacy", "Time Management"],
            projects: ["Digital Business Strategy", "E-commerce Development"],
            language: "Indonesia"
        }
    },
    "School of Creative Industry": {
        "Visual Communication Design": {
            description: "Program yang mengembangkan kreativitas dalam desain komunikasi visual",
            interests: ["Desain Grafis", "Branding", "Digital Art", "User Interface"],
            careers: ["Graphic Designer", "UI/UX Designer", "Art Director", "Creative Director"],
            subjects: ["Design Thinking", "Digital Imaging", "Typography", "Brand Design"],
            strengths: ["Creativity", "Visual Thinking", "Software Skills"],
            projects: ["Brand Identity", "Digital Campaign", "UI/UX Design"],
            language: "Indonesia"
        },
        "Interior Architecture": {
            description: "Program yang memadukan desain interior dengan prinsip arsitektur",
            interests: ["Desain Interior", "Arsitektur", "Spatial Design"],
            careers: ["Interior Designer", "Space Planner", "Design Consultant"],
            subjects: ["Interior Design", "Spatial Planning", "Material Studies"],
            strengths: ["Spatial Intelligence", "Technical Drawing", "Creativity"],
            projects: ["Interior Design Projects", "Space Planning"],
            language: "Indonesia"
        },
        "Architecture & Property": {
            description: "Program yang menggabungkan arsitektur dengan manajemen properti",
            interests: ["Arsitektur", "Real Estate", "Urban Planning"],
            careers: ["Architect", "Property Developer", "Urban Planner"],
            subjects: ["Architectural Design", "Property Management", "Construction"],
            strengths: ["Design Skills", "Technical Knowledge", "Project Management"],
            projects: ["Building Design", "Property Development Plan"],
            language: "Indonesia"
        },
        "Fashion Design Business": {
            description: "Program yang memadukan desain fashion dengan bisnis mode",
            interests: ["Fashion", "Design", "Business", "Retail"],
            careers: ["Fashion Designer", "Fashion Buyer", "Brand Manager"],
            subjects: ["Fashion Design", "Textile Knowledge", "Fashion Business"],
            strengths: ["Creativity", "Business Sense", "Trend Analysis"],
            projects: ["Fashion Collection", "Fashion Business Plan"],
            language: "Indonesia"
        }
    },
    "School of Tourism": {
        "Hotel & Tourism Business": {
            description: "Program yang fokus pada manajemen perhotelan dan pariwisata",
            interests: ["Hospitality", "Tourism", "Service Industry"],
            careers: ["Hotel Manager", "Tourism Consultant", "Event Manager"],
            subjects: ["Hospitality Management", "Tourism Planning", "Service Excellence"],
            strengths: ["Customer Service", "Management", "Cultural Awareness"],
            projects: ["Hotel Operations", "Tourism Development Plan"],
            language: "Indonesia"
        },
        "Culinary Business": {
            description: "Program yang menggabungkan seni kuliner dengan manajemen bisnis",
            interests: ["Culinary Arts", "Food Business", "Restaurant Management"],
            careers: ["Restaurant Owner", "Executive Chef", "F&B Manager"],
            subjects: ["Culinary Arts", "F&B Management", "Menu Planning"],
            strengths: ["Culinary Skills", "Business Management", "Creativity"],
            projects: ["Restaurant Concept", "Menu Development"],
            language: "Indonesia"
        },
        "Food Technology Program": {
            description: "Program yang fokus pada teknologi dan inovasi pangan",
            interests: ["Food Science", "Product Development", "Quality Control"],
            careers: ["Food Technologist", "R&D Specialist", "Quality Manager"],
            subjects: ["Food Chemistry", "Product Development", "Food Safety"],
            strengths: ["Scientific Mindset", "Innovation", "Technical Skills"],
            projects: ["Food Product Development", "Quality System Design"],
            language: "Indonesia"
        }
    },
    "School of Information Technology": {
        "Informatics – Artificial Intelligence": {
            description: "Program yang fokus pada pengembangan AI dan machine learning",
            interests: ["AI", "Machine Learning", "Data Science", "Programming"],
            careers: ["AI Engineer", "ML Engineer", "Data Scientist"],
            subjects: ["Machine Learning", "Deep Learning", "AI Programming"],
            strengths: ["Mathematics", "Programming", "Analytical Thinking"],
            projects: ["AI Applications", "ML Models Development"],
            language: "Indonesia"
        },
        "Informatics – Full Stack Application Development": {
            description: "Program pengembangan aplikasi komprehensif",
            interests: ["Web Development", "Mobile Apps", "Software Engineering"],
            careers: ["Full Stack Developer", "Software Engineer", "Tech Lead"],
            subjects: ["Frontend", "Backend", "Database", "DevOps"],
            strengths: ["Programming", "Problem Solving", "System Design"],
            projects: ["Web Applications", "Mobile Apps"],
            language: "Indonesia"
        },
        "Information System for Business – Data Science": {
            description: "Program yang memadukan analisis data dengan bisnis",
            interests: ["Data Analysis", "Business Intelligence", "Statistics"],
            careers: ["Data Analyst", "Business Intelligence Analyst", "Data Consultant"],
            subjects: ["Data Analytics", "Statistics", "Business Intelligence"],
            strengths: ["Analytical", "Statistical", "Business Understanding"],
            projects: ["Data Analysis", "Business Intelligence Solutions"],
            language: "Indonesia"
        },
        "Information System for Business – Enterprise Systems": {
            description: "Program yang fokus pada sistem informasi enterprise",
            interests: ["Enterprise Systems", "Business Process", "IT Management"],
            careers: ["IT Consultant", "System Analyst", "Project Manager"],
            subjects: ["Enterprise Architecture", "Business Process", "IT Strategy"],
            strengths: ["System Thinking", "Project Management", "Business Analysis"],
            projects: ["Enterprise System Implementation", "Process Optimization"],
            language: "Indonesia"
        }
    },
    "School of Medicine": {
        "Kedokteran": {
            description: "Program pendidikan dokter dengan pengantar bahasa Indonesia",
            interests: ["Kesehatan", "Medis", "Biologi", "Penelitian Medis"],
            careers: ["Dokter Umum", "Dokter Spesialis", "Peneliti Medis"],
            subjects: ["Anatomi", "Fisiologi", "Patologi", "Farmakologi"],
            strengths: ["Sains", "Analytical Thinking", "Empati"],
            projects: ["Medical Research", "Clinical Practice"],
            language: "Indonesia"
        },
        "Kedokteran (English)": {
            description: "Program pendidikan dokter dengan pengantar bahasa Inggris",
            interests: ["Medicine", "Healthcare", "Biology", "Global Health"],
            careers: ["General Practitioner", "Specialist", "Medical Researcher"],
            subjects: ["Anatomy", "Physiology", "Pathology", "Pharmacology"],
            strengths: ["Science", "English", "Analytical Thinking"],
            projects: ["Medical Research", "Clinical Practice"],
            language: "English"
        }
    },
    "School of Dental Medicine": {
        "Kedokteran Gigi": {
            description: "Program pendidikan dokter gigi",
            interests: ["Kesehatan Gigi", "Medis", "Anatomi Gigi"],
            careers: ["Dokter Gigi", "Spesialis Gigi", "Peneliti Kedokteran Gigi"],
            subjects: ["Anatomi Gigi", "Ortodonti", "Bedah Mulut"],
            strengths: ["Manual Dexterity", "Visual Spatial", "Patient Care"],
            projects: ["Dental Practice", "Clinical Research"],
            language: "Indonesia"
        },
        "Profesi Kedokteran Gigi": {
            description: "Program profesi untuk dokter gigi",
            interests: ["Clinical Dentistry", "Dental Specialization"],
            careers: ["Clinical Dentist", "Dental Specialist"],
            subjects: ["Clinical Practice", "Advanced Dentistry"],
            strengths: ["Clinical Skills", "Professional Ethics", "Patient Management"],
            projects: ["Clinical Cases", "Dental Procedures"],
            language: "Indonesia"
        }
    },
    "School of Psychology": {
        "Psychology": {
            description: "Program yang mempelajari perilaku dan mental manusia",
            interests: ["Psikologi", "Perilaku Manusia", "Mental Health"],
            careers: ["Psikolog", "Konselor", "HR Specialist", "Researcher"],
            subjects: ["Clinical Psychology", "Social Psychology", "Industrial Psychology"],
            strengths: ["Empathy", "Analysis", "Communication"],
            projects: ["Psychological Research", "Case Studies"],
            language: "Indonesia"
        }
    },
    "School of Communication and Media Business": {
        "Digital Public Relations": {
            description: "Program yang fokus pada PR di era digital",
            interests: ["Public Relations", "Digital Media", "Communication"],
            careers: ["Digital PR Specialist", "Social Media Manager", "Communications Manager"],
            subjects: ["Digital PR", "Social Media Strategy", "Crisis Communication"],
            strengths: ["Communication", "Digital Literacy", "Strategic Thinking"],
            projects: ["PR Campaigns", "Digital Strategy"],
            language: "Indonesia"
        },
        "Cinematography": {
            description: "Program yang fokus pada produksi film dan video",
            interests: ["Film Making", "Visual Storytelling", "Production"],
            careers: ["Film Director", "Cinematographer", "Producer"],
            subjects: ["Film Production", "Cinematography", "Editing"],
            strengths: ["Visual Arts", "Technical Skills", "Storytelling"],
            projects: ["Short Films", "Video Production"],
            language: "Indonesia"
        }
    },
    "Graduate Program": {
        "Program Pascasarjana Magister Manajemen": {
            description: "Program magister manajemen untuk pengembangan karir eksekutif",
            interests: ["Advanced Management", "Business Strategy", "Leadership"],
            careers: ["Senior Manager", "Business Director", "Consultant"],
            subjects: ["Strategic Management", "Leadership", "Business Analytics"],
            strengths: ["Leadership", "Strategic Thinking", "Business Acumen"],
            projects: ["Business Strategy", "Management Research"],
            language: "Indonesia"
        },
        "Program Pascasarjana MM International Class": {
            description: "Program MM dengan perspektif internasional",
            interests: ["Global Business", "International Management"],
            careers: ["International Manager", "Global Consultant"],
            subjects: ["Global Business Strategy", "International Management"],
            strengths: ["English", "Global Perspective", "Leadership"],
            projects: ["Global Business Strategy", "International Research"],
            language: "English"
        },
        "UC Online Learning – S2 MM": {
            description: "Program MM yang dapat diakses secara online",
            interests: ["Digital Business", "Flexible Learning", "Management"],
            careers: ["Digital Business Manager", "Online Business Consultant"],
            subjects: ["Digital Strategy", "Online Business Management"],
            strengths: ["Self-learning", "Digital Skills", "Time Management"],
            projects: ["Digital Strategy", "Online Business Research"],
            language: "Indonesia"
        },
        "Doktor (S3) Ilmu Manajemen": {
            description: "Program doktor untuk pengembangan ilmu manajemen",
            interests: ["Management Research", "Academic Career", "Business Theory"],
            careers: ["Academic", "Research Consultant", "Business Researcher"],
            subjects: ["Research Methodology", "Advanced Management Theory"],
            strengths: ["Research Skills", "Academic Writing", "Critical Thinking"],
            projects: ["Doctoral Dissertation", "Management Research"],
            language: "Indonesia"
        }
    }
};

class ProgramSimulator {
    constructor() {
        this.programData = programData;
    }

    async simulateProgram(userPreferences) {
        const {
            interests = [],
            strengths = [],
            language_preference = 'any',
            career_goals = [],
            academic_subjects = []
        } = userPreferences;

        let recommendations = [];

        // Iterate through all programs
        for (const school in this.programData) {
            for (const program in this.programData[school]) {
                const programInfo = this.programData[school][program];
                let score = 0;
                let matchDetails = [];

                // Calculate interest match
                const interestMatch = this.calculateMatchPercentage(
                    interests,
                    programInfo.interests
                );
                score += interestMatch * 0.3; // 30% weight
                matchDetails.push(`Interest Match: ${(interestMatch * 100).toFixed(1)}%`);

                // Calculate strength match
                const strengthMatch = this.calculateMatchPercentage(
                    strengths,
                    programInfo.strengths
                );
                score += strengthMatch * 0.25; // 25% weight
                matchDetails.push(`Strength Match: ${(strengthMatch * 100).toFixed(1)}%`);

                // Calculate career goals match
                const careerMatch = this.calculateMatchPercentage(
                    career_goals,
                    programInfo.careers
                );
                score += careerMatch * 0.25; // 25% weight
                matchDetails.push(`Career Match: ${(careerMatch * 100).toFixed(1)}%`);

                // Calculate subject match
                const subjectMatch = this.calculateMatchPercentage(
                    academic_subjects,
                    programInfo.subjects
                );
                score += subjectMatch * 0.2; // 20% weight
                matchDetails.push(`Subject Match: ${(subjectMatch * 100).toFixed(1)}%`);

                // Language preference check
                if (language_preference !== 'any') {
                    if (programInfo.language.toLowerCase() === language_preference.toLowerCase()) {
                        score *= 1.1; // 10% bonus for language match
                        matchDetails.push('Language Preference: Match');
                    } else {
                        score *= 0.9; // 10% penalty for language mismatch
                        matchDetails.push('Language Preference: Mismatch');
                    }
                }

                recommendations.push({
                    school,
                    program,
                    score: score * 100,
                    matchDetails,
                    programInfo,
                    overallMatch: `${(score * 100).toFixed(1)}%`
                });
            }
        }

        // Sort recommendations by score
        recommendations.sort((a, b) => b.score - a.score);

        // Return top recommendations with detailed explanations
        return {
            recommendations: recommendations.slice(0, 5),
            totalPrograms: recommendations.length
        };
    }

    calculateMatchPercentage(userItems, programItems) {
        if (!userItems || !programItems || userItems.length === 0) return 0;
        
        const normalizedUserItems = userItems.map(item => item.toLowerCase());
        const normalizedProgramItems = programItems.map(item => item.toLowerCase());
        
        let matches = 0;
        for (const userItem of normalizedUserItems) {
            for (const programItem of normalizedProgramItems) {
                if (programItem.includes(userItem) || userItem.includes(programItem)) {
                    matches++;
                    break;
                }
            }
        }
        
        return matches / userItems.length;
    }

    getDetailedProgramInfo(school, program) {
        if (this.programData[school]?.[program]) {
            return {
                ...this.programData[school][program],
                school,
                program
            };
        }
        return null;
    }

    getProgramsByInterest(interest) {
        const matchingPrograms = [];
        
        for (const school in this.programData) {
            for (const program in this.programData[school]) {
                const programInfo = this.programData[school][program];
                if (programInfo.interests.some(i => 
                    i.toLowerCase().includes(interest.toLowerCase())
                )) {
                    matchingPrograms.push({
                        school,
                        program,
                        programInfo
                    });
                }
            }
        }
        
        return matchingPrograms;
    }

    getAllInterests() {
        const interests = new Set();
        
        for (const school in this.programData) {
            for (const program in this.programData[school]) {
                const programInfo = this.programData[school][program];
                programInfo.interests.forEach(interest => interests.add(interest));
            }
        }
        
        return Array.from(interests);
    }

    getAllCareers() {
        const careers = new Set();
        
        for (const school in this.programData) {
            for (const program in this.programData[school]) {
                const programInfo = this.programData[school][program];
                programInfo.careers.forEach(career => careers.add(career));
            }
        }
        
        return Array.from(careers);
    }
}
module.exports = { ProgramSimulator, programData };
