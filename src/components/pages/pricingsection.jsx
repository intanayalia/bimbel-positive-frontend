import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../../api'; 

// ==========================================
// 1. SUB-COMPONENTS
// ==========================================

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
                ? 'bg-brand-dark text-white shadow-2xl scale-105 z-10 border border-transparent' 
                : 'bg-white text-gray-800 shadow-lg border border-gray-200 hover:shadow-xl'
            }
        `}>
            {isFeatured && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-brand-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    Paling Laris
                </div>
            )}

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
                <Link to="/pricing" className={`block w-full py-3.5 px-6 rounded-xl text-center font-bold text-lg transition-colors duration-300 ${isFeatured ? 'bg-white text-brand-dark hover:bg-gray-100' : 'bg-transparent border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white'}`}>
                    Pilih Paket
                </Link>
            </div>
        </div>
    );
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function PricingSection() {
    
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await api.get('/packages');
                setPackages(response.data);
            } catch (error) {
                console.error("Gagal mengambil data paket:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    // Helper: Generate fitur berdasarkan nama paket
    const getFeatures = (pkgName) => {
        const name = (pkgName || "").toLowerCase();
        
        if (name.includes('privat')) {
            return ["1 on 1 dengan Mentor", "Jadwal Fleksibel", "Fokus Materi Khusus", "Konsultasi Kapan Saja", "Garansi Nilai"];
        } else if (name.includes('premium')) {
            return ["Maksimal 5 Siswa", "Akses Materi & Rekaman", "3x Pertemuan / Minggu", "Konsultasi Prioritas", "Analisis Nilai"];
        } else {
            return ["Maksimal 10 Siswa", "Akses Materi Lengkap", "2x Pertemuan / Minggu", "Konsultasi Harian"];
        }
    };

    // Helper: Format Rupiah
    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price || 0);
    };

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

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-brand-dark w-10 h-10" />
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 max-w-7xl mx-auto">
                        {packages.length > 0 ? (
                            packages.slice(0, 3).map((pkg, index) => {
                                
                                // === [PERBAIKAN UTAMA DI SINI] ===
                                // Menggunakan key yang sama dengan AllPricingPage.jsx
                                const safeName = pkg.nama_paket || "Paket Bimbel"; 
                                const safePrice = pkg.harga || 0;
                                const safeDuration = pkg.durasi || "Bulan";

                                // Cek Unggulan (Misal: Premium atau Diskon > 0)
                                const isFeatured = index === 1 || safeName.toLowerCase().includes('premium') || (pkg.diskon > 0);
                                
                                // Hitung harga diskon jika ada (Agar tampilan sesuai realita)
                                const finalPrice = pkg.diskon > 0 
                                    ? safePrice - (safePrice * (pkg.diskon / 100)) 
                                    : safePrice;

                                return (
                                    <div key={pkg.id} className="w-full lg:w-1/3 flex">
                                         <PricingCard
                                            title={safeName} 
                                            price={formatRupiah(finalPrice)}
                                            session={safeDuration} 
                                            features={getFeatures(safeName)}
                                            isFeatured={isFeatured}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center w-full py-10 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">Belum ada paket tersedia saat ini.</p>
                            </div>
                        )}

                        {packages.length > 3 && (
                            <Link 
                                to="/pricing" 
                                className="flex-shrink-0 w-14 h-14 bg-brand-dark rounded-full flex items-center justify-center hover:bg-brand-dark-accent transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 mt-4 lg:mt-auto lg:self-center lg:ml-4"
                                title="Lihat Semua Paket"
                            >
                                <ArrowRightIcon />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}