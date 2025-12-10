import React, { useState, useEffect } from 'react';
import Navigasi from '../common/navigasi';
import Footer from '../common/footer';
// import api from '../../api'; // <-- 1. UNCOMMENT SAAT KONEK LARAVEL

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const CheckIcon = ({ isDarkBg }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 flex-shrink-0 ${isDarkBg ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> {/* UPDATE: Stroke lebih tipis (2) */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const PackageCard = ({ title, price, session, features, isFeatured }) => {
    return (
        <div className={`
            relative flex flex-col justify-between p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 h-full
            ${isFeatured 
                ? 'bg-brand-dark text-white shadow-2xl scale-105 z-10' 
                : 'bg-white text-gray-800 shadow-lg border border-gray-200 hover:shadow-xl'
            }
        `}>
            <div>
                <h3 className={`text-2xl font-bold mb-4 ${isFeatured ? 'text-white' : 'text-brand-dark'}`}>
                    {title}
                </h3>
                <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold tracking-tight">
                        {price}
                    </span>
                    <span className={`ml-2 text-lg font-medium ${isFeatured ? 'text-gray-200' : 'text-gray-500'}`}>
                        /{session}
                    </span>
                </div>

                <hr className={`mb-6 border-opacity-20 ${isFeatured ? 'border-white' : 'border-gray-200'}`} />
                <ul className="space-y-4 text-left">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <div className="flex-shrink-0">
                                <CheckIcon isDarkBg={isFeatured} />
                            </div>
                            <p className={`ml-3 text-base font-normal ${isFeatured ? 'text-gray-100' : 'text-gray-600'}`}>
                                {feature}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8">
                <a href="/daftar" className={`
                    block w-full py-3.5 px-6 rounded-xl text-center font-bold text-lg transition-colors duration-300
                    ${isFeatured
                        ? 'bg-white text-brand-dark hover:bg-gray-100' 
                        : 'bg-transparent border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white' 
                    }
                `}>
                    Pilih Paket
                </a>
            </div>
        </div>
    );
};

export default function AllPackagesPage() {
    
    // 1. DATA DUMMY
    const dummyPackages = [
        { id: 1, title: "Kelas Reguler SD", price: "Rp 100rb", session: "bulan", is_featured: false, level: "SD", grade: "5", features: ["Matematika & IPA", "2x Seminggu", "Tutor Ramah Anak"] },
        { id: 2, title: "Kelas Premium SMP", price: "Rp 250rb", session: "bulan", is_featured: true, level: "SMP", grade: "9", features: ["Fokus UNBK", "3x Seminggu", "Konsultasi PR", "Tryout Mingguan"] },
        { id: 3, title: "Intensif UTBK SMA", price: "Rp 500rb", session: "bulan", is_featured: false, level: "SMA", grade: "12", features: ["Drilling Soal", "Tryout Mingguan", "Bedah Kampus Impian"] },
        { id: 4, title: "Paket Tematik SD", price: "Rp 150rb", session: "bulan", is_featured: false, level: "SD", grade: "3", features: ["Calistung Lancar", "Metode Fun Learning"] },
        { id: 5, title: "Privat Fisika SMA", price: "Rp 350rb", session: "sesi", is_featured: false, level: "SMA", grade: "11", features: ["1 on 1 Mentor", "Bedah Rumus Fisika", "Jadwal Fleksibel"] },
        { id: 6, title: "Persiapan Ujian SMP", price: "Rp 200rb", session: "bulan", is_featured: false, level: "SMP", grade: "8", features: ["Latihan Soal Harian", "Video Pembahasan"] }
    ];

    // State Management
    const [packages, setPackages] = useState(dummyPackages);
    const [loading, setLoading] = useState(false);

    // Filter State
    const [filterLevel, setFilterLevel] = useState(""); // SD, SMP, SMA
    const [filterGrade, setFilterGrade] = useState(""); // 1-12
    const [searchKeyword, setSearchKeyword] = useState("");

    // LOGIC: Generate Kelas Berdasarkan Tingkat
    const getGradeOptions = () => {
        if (filterLevel === "SD") return ["1", "2", "3", "4", "5", "6"];
        if (filterLevel === "SMP") return ["7", "8", "9"];
        if (filterLevel === "SMA") return ["10", "11", "12"];
        return [];
    };

    // LOGIC: Reset Kelas saat Tingkat Berubah
    const handleLevelChange = (e) => {
        setFilterLevel(e.target.value);
        setFilterGrade(""); // Reset kelas agar valid
    };

    // --- FUNGSI CARI (BACKEND READY) ---
    const fetchFilteredPackages = () => {
        setLoading(true);
        console.log("Fetching API with:", { level: filterLevel, grade: filterGrade, q: searchKeyword });

        // A. SIMULASI FRONTEND
        setTimeout(() => {
            const filtered = dummyPackages.filter(pkg => {
                const matchLevel = filterLevel ? pkg.level === filterLevel : true;
                const matchGrade = filterGrade ? pkg.grade === filterGrade : true;
                const matchSearch = searchKeyword ? pkg.title.toLowerCase().includes(searchKeyword.toLowerCase()) : true;
                return matchLevel && matchGrade && matchSearch;
            });
            setPackages(filtered);
            setLoading(false);
        }, 600);

        // B. KODE REAL UNTUK BACKEND
        /*
        const params = new URLSearchParams();
        if (filterLevel) params.append('level', filterLevel);
        if (filterGrade) params.append('grade', filterGrade);
        if (searchKeyword) params.append('q', searchKeyword);

        api.get(`/packages?${params.toString()}`)
            .then(res => {
                setPackages(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Error:", err);
                setLoading(false);
            });
        */
    };

    return (
        <div className="bg-brand-light-bg font-sans min-h-screen flex flex-col justify-between">
            <Navigasi />

            <main className="py-24 mb-auto">
                <div className="container mx-auto px-6">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4">
                            Cari Paket Belajar
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Gunakan filter di bawah untuk menemukan paket yang paling sesuai dengan jenjangmu.
                        </p>
                    </div>
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-12 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                            <div className="w-full sm:w-48">
                                <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">Jenjang</label>
                                <select 
                                    value={filterLevel}
                                    onChange={handleLevelChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/20 outline-none transition-all cursor-pointer font-medium text-gray-700 appearance-none"
                                >
                                    <option value="">Semua Jenjang</option>
                                    <option value="SD">SD</option>
                                    <option value="SMP">SMP</option>
                                    <option value="SMA">SMA</option>
                                </select>
                            </div>
                            <div className="w-full sm:w-48">
                                <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">Kelas</label>
                                <select 
                                    value={filterGrade}
                                    onChange={(e) => setFilterGrade(e.target.value)}
                                    disabled={!filterLevel}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium appearance-none ${
                                        !filterLevel 
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                        : 'bg-gray-50 text-gray-700 border-gray-300 focus:bg-white focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/20 cursor-pointer'
                                    }`}
                                >
                                    <option value="">Semua Kelas</option>
                                    {getGradeOptions().map((grade) => (
                                        <option key={grade} value={grade}>Kelas {grade}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex w-full xl:w-auto gap-2 items-end">
                            <div className="relative flex-grow xl:w-80">
                                <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">Kata Kunci</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <SearchIcon />
                                    </div>
                                    <input 
                                        type="text"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && fetchFilteredPackages()} 
                                        placeholder="Cari mapel (cth: Matematika)..."
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={fetchFilteredPackages}
                                className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark-accent transition-all shadow-md hover:shadow-lg flex-shrink-0 h-[50px] mt-auto flex items-center gap-2"
                            >
                                Cari
                            </button>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-dark border-r-transparent"></div>
                            <p className="mt-4 text-gray-500">Mencari paket terbaik...</p>
                        </div>
                    ) : packages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                            {packages.map((pkg) => (
                                <PackageCard
                                    key={pkg.id}
                                    title={pkg.title}
                                    price={pkg.price}
                                    session={pkg.session}
                                    features={pkg.features}
                                    isFeatured={pkg.is_featured}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                            <p className="text-xl font-bold text-gray-800">Paket tidak ditemukan 😔</p>
                            <p className="text-gray-500 mt-2">Coba ganti filter tingkat atau kata kunci pencarianmu.</p>
                            <button 
                                onClick={() => { setFilterLevel(""); setFilterGrade(""); setSearchKeyword(""); fetchFilteredPackages(); }}
                                className="mt-4 text-brand-dark font-bold hover:underline"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}