import React from 'react';

const FeatureCard = ({ iconSvgCode, title, description, translateYClass }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 ${translateYClass} transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:z-10 cursor-default`}>
        <div className="w-16 h-16 bg-brand-icon-bg rounded-full mb-5 flex items-center justify-center">
            <div className="w-8 h-8 text-brand-dark">
                {iconSvgCode}
            </div>
        </div>
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
    </div>
);

export default function FeaturesSection() {
    const icons = {
        book: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
        ),
        clock: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        refresh: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M21.5 2v6h-6" />
                <path d="M2.5 22v-6h6" />
                <path d="M2 11.5a10 10 0 0 1 18-3l1.5-3" />
                <path d="M22 12.5a10 10 0 0 1-18 3l-1.5 3" />
            </svg>
        ),
        users: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
        checklist: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <polyline points="9 15 12 18 15 12" />
            </svg>
        )
    };

    const features = [
        { 
            title: "Materi Lengkap & Mudah Dipahami", 
            description: "Belajar jadi lebih mudah dengan penjelasan yang jelas dan ringkas.", 
            translate: "lg:-translate-y-6",
            iconSvgCode: icons.book
        },
        { 
            title: "Akses Materi Kapan Pun, Di Mana Pun", 
            description: "Nikmati kebebasan belajar sesuai jadwal dan tempatmu.", 
            translate: "lg:translate-y-6",
            iconSvgCode: icons.clock
        },
        { 
            title: "Belajar dengan Kurikulum Terupdate", 
            description: "Materi dirancang sesuai kurikulum terbaru sesuai standar pendidikan.", 
            translate: "lg:translate-y-16",
            iconSvgCode: icons.refresh
        },
        { 
            title: "Diskusi bersama Pengajar Berpengalaman", 
            description: "Dapatkan arahan langsung dari tutor yang siap bantu kamu dalam belajar.", 
            translate: "lg:translate-y-6",
            iconSvgCode: icons.users
        },
        { 
            title: "Latihan Soal dan Evaluasi Rutin", 
            description: "Uji pemahamanmu lewat latihan interaktif dan evaluasi berkala.", 
            translate: "lg:-translate-y-6",
            iconSvgCode: icons.checklist
        },
    ];

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">
                        Apa yang Kamu Dapatkan?
                    </h2>
                    <p className="text-lg text-gray-600">
                        Ikuti kelas online interaktif yang bisa diikuti kapan saja, di mana saja. Sesuai dengan ritme belajarmu.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:pb-16">
                    {features.map((feature, index) => (
                        <FeatureCard 
                            key={index} 
                            title={feature.title} 
                            description={feature.description} 
                            translateYClass={feature.translate}
                            iconSvgCode={feature.iconSvgCode}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}