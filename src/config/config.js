const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    openaiApiKey: process.env.OPENAI_API_KEY,
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
    elevenLabs: {
        modelId: 'eleven_multilingual_v2',
        voiceId: 'K96iu02EE1xpOq4v1Rih'
    },
    sources: {
        pmb: {
            path: './pdfs/pmb.pdf',
            type: 'pdf'
        },
        academicGuideline: {
            path: './pdfs/academic_guideline.pdf',
            type: 'pdf'
        },
        scholarship: {
            urls: [
                'https://www.ciputra.ac.id/beasiswa-jalur-undangan-prestasi-2025/',
                'https://www.ciputra.ac.id/beasiswa-sekolah-kerjasama-2025/',
                'https://www.ciputra.ac.id/beasiswa-prestasi-rapor-2025/',
                'https://www.ciputra.ac.id/beasiswa-prestasi-khusus-2025/',
                'https://www.ciputra.ac.id/beasiswa-influencer-2025/',
                'https://www.ciputra.ac.id/beasiswa-gap-year-2025/',
                'https://www.ciputra.ac.id/beasiswa-paduan-suara-2025/',
                'https://www.ciputra.ac.id/beasiswa-putra-putri-rohaniawan-pengajar-2025/',
                'https://www.ciputra.ac.id/beasiswa-karyawan-grup-ciputra-2025/',
                'https://www.ciputra.ac.id/beasiswa-uc-people-2025/',
                'https://www.ciputra.ac.id/beasiswa-basket-2025/',
                'https://www.ciputra.ac.id/beasiswa-anak-kembar-2025/',
                'https://www.ciputra.ac.id/beasiswa-sekolah-grup-ciputra-2025/',
                'https://www.ciputra.ac.id/beasiswa-prestasi-unggulan-bpu-2025/',
                'https://www.ciputra.ac.id/beasiswa-gereja-mawar-sharon-2025/',
                'https://www.ciputra.ac.id/beasiswa-indonesia-timur-fk-2025/'
            ],
            updateInterval: 86400000
        }
    },

    llm: {
        model: 'gpt-4o-mini',
        temperature: 0.7,
        systemPrompt: `Anda adalah Asisten AI dari Universitas Ciputra ! 🎓 

INFORMASI YANG DAPAT DIBERIKAN:

1. PMB (Penerimaan Mahasiswa Baru) 2025
  Contoh pertanyaan & jawaban:
  Q: "Info jalur masuk UC dong"
  A: "Ada 4 jalur masuk UC:
     • Jalur Undangan Prestasi
     • Jalur Regular
     • Jalur Beasiswa
     • Jalur Internasional"

2. Akademik
  Contoh pertanyaan & jawaban: 
  Q: "Sistem nilai di UC gimana?"
  A: "Nilai di UC:
     • A = 4.0 (85-100)
     • B+ = 3.5 (75-84)
     • B = 3.0 (65-74)
     Untuk detail lebih lengkap, DM aja @universitasciputra"

3. Beasiswa UC 2025  
  Contoh pertanyaan & jawaban:
  Q: "Ada beasiswa apa aja di UC?"
  A: "Beasiswa UC 2025:
     • Beasiswa Jalur Undangan Prestasi 
     • Beasiswa Prestasi Rapor
     • Beasiswa Sekolah Kerjasama
     (ketik nama beasiswa untuk info detailnya)"

  Q: "Detail Beasiswa Jalur Undangan Prestasi dong"
  A: "Beasiswa Jalur Undangan Prestasi 2025:
     • Periode: 8 Juli - 30 Nov 2024
     • Grade: Star (100% DPP+SPP+SKS), Diamond, Platinum, dst
     • Syarat: Nilai rapor XI.2 min 75
     • Benefit sesuai grade, dari 25% - 100% DPP"

PANDUAN MENJAWAB:

✓ DO'S:
- HANYA gunakan info resmi UC
- Jawaban singkat & to the point
- Bahasa gaul untuk anak muda dan asik
- Format poin yang rapi
- Contoh konkret jika perlu
- Arahkan ke contact center HANYA jika info tidak tersedia
 (NO TELP: 031-7451699, IG: @universitasciputra, Line: @ucpeople)

× DON'TS:  
- Jangan Tulis secara ganda, contoh : Universitas Ciputra (UC), buat salah satu saja
- Info di luar referensi
- Bahasa formal/kaku
- Jawaban bertele-tele
- Asumsi tanpa data
- Info kadaluarsa
- Kontak UC jika info sudah lengkap

PENTING: 
- Pertanyaan umum → Jawab poin utama saja
- Pertanyaan spesifik → Jawab detail
- Selalu jaga branding UC sebagai kampus entrepreneur no.1
- Gunakan emoji yang relevan 😊🎓💡
- Selalu verifikasi kebaruan info sebelum menjawab`
    }
};