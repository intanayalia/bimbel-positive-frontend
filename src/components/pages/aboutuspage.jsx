import React, { useState, useEffect } from 'react';
import Navigasi from '../common/navigasi';
import Footer from '../common/footer';

export default function AboutUsPage() {
    
    // 1. DATA DUMMY
    const [aboutData, setAboutData] = useState({
        title: "Membangun Generasi Cerdas Berkarakter",
        description: `Lembaga Pelatihan dan Kursus Bimbingan Belajar Positive merupakan lembaga pendidikan (Motivation, Learning and Training Centre) yang berdiri pada tanggal 20 Mei 2013. LKP Bimbingan Belajar Positive berfokus pada pendidikan non formal anak dari jenjang usia dini hingga menengah ke atas serta, pelatihan softskill yang mencetak generasi muda berprestasi, berkarakter, serta mempunyai kemampuan atau keahlian yang sedang berkembang saat ini. LKP Bimbingan Belajar Positive berkantor pusat di Desa Sokawera RT 01 RW 03 Kecamatan Padamara, Kabupaten Purbalingga. LKP Bimbingan Belajar Positive memiliki tim yang beranggotakan lebih dari 20 pengajar atau instruktur. Dalam pembelajaran, kami menggunakan metode fun learning, mudah dipahami, serta mengikuti kurikulum yang berlaku.`,
        stats: [
            { label: "Siswa Terbantu", value: "2.500+" },
            { label: "Tutor Terbaik", value: "50+" },
            { label: "Tahun Pengalaman", value: "9 th" },
            { label: "Lulus PTN", value: "98%" },
        ],
        image_url: "/assets/about-team.png"
    });

    // 2. BACKEND INTEGRATION
    /*
    useEffect(() => {
        api.get('/about-us')
            .then(res => setAboutData(res.data))
            .catch(err => console.error(err));
    }, []);
    */

    return (
        <div className="bg-white font-sans min-h-screen flex flex-col justify-between">
            <main className="py-24 mb-auto overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h4 className="text-brand-dark font-bold tracking-widest uppercase text-sm mb-3">Tentang Kami</h4>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-dark mb-6">
                            Bukan Sekadar <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-dark-accent">
                                Tempat Belajar Biasa
                            </span>
                        </h1>
                        <div className="w-24 h-2 bg-brand-icon-bg mx-auto rounded-full"></div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full lg:w-1/2 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-brand-beige-header rounded-full blur-3xl opacity-60 -z-10"></div>
                            <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img 
                                    src={aboutData.image_url} 
                                    alt="Tim Bimbel Positif" 
                                    className="w-full h-auto object-cover"
                                    onError={(e) => { e.target.src = "assets/aboutus.jpg"; }}
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 animate-float">
                                <p className="text-brand-dark font-extrabold text-4xl">#1</p>
                                <p className="text-gray-500 text-sm font-medium">Di Purbalingga</p>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                                {aboutData.title}
                            </h2>
                            <div className="text-lg text-gray-600 leading-relaxed space-y-4 mb-10 whitespace-pre-line text-justify">
                                {aboutData.description}
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {aboutData.stats.map((stat, index) => (
                                    <div key={index} className="bg-brand-light-bg p-4 rounded-2xl border border-brand-icon-bg hover:shadow-md transition-shadow">
                                        <p className="text-3xl font-extrabold text-brand-dark">{stat.value}</p>
                                        <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-brand-dark text-white p-10 rounded-[40px] shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                🚀 Visi Kami
                            </h3>
                            <p className="opacity-90 leading-relaxed text-justify">
                                Menjadi lembaga pendidikan non-formal terdepan yang mencetak generasi cerdas, kreatif, dan berakhlak mulia di Indonesia.
                            </p>
                        </div>
                        <div className="bg-white text-gray-800 border-2 border-brand-light-bg p-10 rounded-[40px] shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-bold mb-4 text-brand-dark flex items-center gap-3">
                                🎯 Misi Kami
                            </h3>
                            <ul className="space-y-2 list-disc list-inside opacity-80 text-justify">
                                <li>Menyediakan metode belajar yang inovatif.</li>
                                <li>Membangun lingkungan belajar yang positif.</li>
                                <li>Mengembangkan potensi minat dan bakat siswa.</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}