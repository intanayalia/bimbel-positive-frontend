import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import api from '../../api'; // <-- 1. UNCOMMENT INI NANTI

// --- ICONS ---
const CheckIcon = ({ isDarkBg }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 flex-shrink-0 ${isDarkBg ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

export const PricingCard = ({ title, price, session, features, isFeatured }) => {
    return (
        <div className={`
            relative flex flex-col justify-between p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 w-full md:w-auto h-full
            ${isFeatured 
                ? 'bg-brand-dark text-white shadow-2xl scale-105 z-10' 
                : 'bg-white text-gray-800 shadow-lg border border-gray-200 hover:shadow-xl'
            }
        `}>
            <div>
                <h3 className={`text-2xl font-extrabold mb-4 ${isFeatured ? 'text-white' : 'text-brand-dark'}`}>
                    {title}
                </h3>
                <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-extrabold tracking-tight">{price}</span>
                    <span className={`ml-2 text-lg font-medium ${isFeatured ? 'text-gray-200' : 'text-gray-500'}`}>/{session}</span>
                </div>
                <hr className={`mb-6 border-opacity-20 ${isFeatured ? 'border-white' : 'border-gray-200'}`} />
                <ul className="space-y-4 text-left">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <div className="flex-shrink-0"><CheckIcon isDarkBg={isFeatured} /></div>
                            <p className={`ml-3 text-base font-medium ${isFeatured ? 'text-gray-100' : 'text-gray-600'}`}>{feature}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-8">
                <Link to="/daftar-paket" className={`block w-full py-3.5 px-6 rounded-xl text-center font-bold text-lg transition-colors duration-300 ${isFeatured ? 'bg-white text-brand-dark hover:bg-gray-100' : 'bg-transparent border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white'}`}>
                    Pilih Paket
                </Link>
            </div>
        </div>
    );
};

export default function PricingSection() {
    
    // DATA DUMMY (Untuk Tampilan Awal)
    const initialPackages = [
        {
            id: 1, title: "Kelas Reguler", price: "Rp 150rb", session: "sesi", is_featured: false,
            features: ["Maksimal 10 Siswa", "Akses Materi Lengkap", "2x Pertemuan / Minggu", "Konsultasi PR Harian"]
        },
        {
            id: 2, title: "Kelas Premium", price: "Rp 250rb", session: "sesi", is_featured: true,
            features: ["Maksimal 5 Siswa", "Akses Materi & Rekaman", "3x Pertemuan / Minggu", "Konsultasi PR Prioritas", "Tryout & Analisis Nilai"]
        },
        {
            id: 3, title: "Kelas Privat", price: "Rp 350rb", session: "sesi", is_featured: false,
            features: ["1 on 1 dengan Mentor", "Jadwal Fleksibel", "Fokus Materi Khusus", "Konsultasi PR Kapan Saja", "Garansi Peningkatan Nilai"]
        }
    ];

    const [packages, setPackages] = useState(initialPackages);

    // 2. AREA BACKEND (Tinggal Uncomment)
    /*
    useEffect(() => {
        // API: Ambil 3 paket unggulan saja
        api.get('/packages?featured=true&limit=3')
            .then(res => setPackages(res.data))
            .catch(err => console.error(err));
    }, []);
    */

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">
                        Pilih Paket Sesuai Kebutuhanmu
                    </h2>
                    <p className="text-lg text-gray-600">
                        Kami menyediakan berbagai pilihan kelas yang bisa disesuaikan dengan gaya belajar dan budget kamu.
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-7xl mx-auto">
                    {packages.map((pkg, index) => (
                        <div key={pkg.id || index} className="w-full lg:w-auto lg:flex-1 h-full">
                             <PricingCard
                                title={pkg.title}
                                price={pkg.price}
                                session={pkg.session}
                                features={pkg.features}
                                isFeatured={pkg.is_featured} // Pastikan backend pakai nama field ini
                            />
                        </div>
                    ))}
                    <Link 
                        to="/pricing" 
                        className="flex-shrink-0 w-14 h-14 bg-brand-dark rounded-full flex items-center justify-center hover:bg-brand-dark-accent transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 mt-4 lg:mt-0 lg:ml-4"
                        title="Lihat Semua Paket"
                    >
                        <ArrowRightIcon />
                    </Link>
                </div>
            </div>
        </section>
    );
}