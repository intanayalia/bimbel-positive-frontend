import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// --- IMPORT COMPONENT ---
import Navigasi from '../common/navigasi';         // Navbar untuk Tamu (Belum Login)
import NavigasiSiswa from '../common/navigasisiswa'; // Navbar untuk Siswa (Sudah Login)
import Footer from '../common/footer';
import api from '../../api';

// ==========================================
// 1. HELPER: FORMAT RUPIAH
// ==========================================
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
};

// ==========================================
// 2. SUB-COMPONENT: KARTU PAKET
// ==========================================
const PackageCard = ({ id, title, price, duration, description, category, discount, onSelect }) => {
    // Hitung Harga Diskon
    const finalPrice = discount > 0 ? price - (price * (discount / 100)) : price;

    return (
        <div className={`relative flex flex-col h-full p-8 bg-white border-2 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${category === 'UTBK' ? 'border-brand-dark ring-4 ring-brand-dark/5' : 'border-gray-100'}`}>
            
            {/* Badge Diskon & Kategori */}
            <div className="absolute top-4 right-4 flex gap-2">
                {discount > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        Hemat {discount}%
                    </span>
                )}
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {category}
                </span>
            </div>

            {/* Header Paket */}
            <div className="mb-6 mt-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <div className="flex flex-col">
                    {discount > 0 && (
                        <span className="text-sm text-gray-400 line-through font-medium">
                            {formatRupiah(price)}
                        </span>
                    )}
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-brand-dark">
                            {formatRupiah(finalPrice)}
                        </span>
                        <span className="text-gray-500 font-medium">/ {duration} Hari</span>
                    </div>
                </div>
            </div>

            {/* Deskripsi */}
            <div className="flex-grow border-t border-gray-100 pt-6 mb-8">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {description || "Paket belajar intensif dengan materi lengkap dan latihan soal terupdate."}
                </p>
                
                {/* List Fitur Dummy (Bisa disesuaikan nanti) */}
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Akses Materi Video & PDF Lengkap</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Akses Tryout Ujian Berkala</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Grup Diskusi dengan Mentor</span>
                    </li>
                </ul>
            </div>

            {/* Tombol Aksi */}
            <button 
                onClick={() => onSelect(id)}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex justify-center items-center ${
                    category === 'UTBK' 
                    ? 'bg-brand-dark text-white hover:bg-brand-dark-accent' 
                    : 'bg-white border-2 border-brand-dark text-brand-dark hover:bg-gray-50'
                }`}
            >
                Pilih Paket Ini
            </button>
        </div>
    );
};

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================
export default function AllPricingPage() {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('SEMUA');
    
    // State untuk cek Login
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // --- A. CEK LOGIN & FETCH DATA ---
    useEffect(() => {
        // 1. Cek Token di LocalStorage
        const token = localStorage.getItem('auth_token');
        setIsLoggedIn(!!token); // Ubah jadi boolean (true jika ada token)

        // 2. Ambil Data Paket
        const fetchPackages = async () => {
            try {
                // Endpoint Public (Pastikan di api.php route ini tidak kena middleware auth)
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

    // --- B. LOGIKA PEMBELIAN ---
    const handleBuyPackage = async (packageId) => {
        // 1. Jika Belum Login -> Arahkan ke Login
        if (!isLoggedIn) {
            alert("Silakan login atau daftar terlebih dahulu untuk membeli paket.");
            navigate('/login');
            return;
        }

        // 2. Konfirmasi Pembelian
        const selectedPkg = packages.find(p => p.id === packageId);
        if(!window.confirm(`Beli paket "${selectedPkg.nama_paket}" sekarang?`)) {
            return;
        }

        // 3. Proses Transaksi
        try {
            // Hitung harga final
            const finalPrice = selectedPkg.diskon > 0 
                ? selectedPkg.harga - (selectedPkg.harga * (selectedPkg.diskon / 100)) 
                : selectedPkg.harga;

            const res = await api.post('/payment/charge', {
                product_name: selectedPkg.nama_paket,
                amount: finalPrice,
                package_id: selectedPkg.id
            });

            // Redirect ke Detail Pembayaran
            navigate('/pembayaran/detail', { 
                state: { transaction: res.data.transaction } 
            });

        } catch (error) {
            console.error("Transaksi Gagal:", error);
            alert("Gagal memproses pembelian. Silakan coba lagi.");
        }
    };

    // --- C. LOGIKA FILTER ---
    const filteredPackages = filterCategory === 'SEMUA' 
        ? packages 
        : packages.filter(pkg => pkg.kategori === filterCategory);

    return (
        <div className="bg-brand-light-bg font-sans min-h-screen flex flex-col">
            
            {/* NAVIGASI DINAMIS:
                Jika user Login -> Tampilkan NavigasiSiswa (Ada Avatar & Nama)
                Jika user Tamu  -> Tampilkan Navigasi Biasa (Tombol Masuk/Daftar)
            */}
            {isLoggedIn ? <NavigasiSiswa /> : <Navigasi />}
            
            <main className="flex-grow pt-28 pb-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <span className="text-brand-dark font-bold tracking-wider uppercase text-sm mb-2 block">Harga & Paket</span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                            Investasi Terbaik untuk Masa Depanmu
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Pilih paket belajar yang sesuai dengan kebutuhan dan target impianmu. Transparan, hemat, dan berkualitas.
                        </p>
                    </div>

                    {/* Filter Kategori */}
                    <div className="flex justify-center gap-3 mb-12 flex-wrap">
                        {['SEMUA', 'SD', 'SMP', 'SMA', 'UTBK'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${
                                    filterCategory === cat 
                                    ? 'bg-brand-dark text-white shadow-lg' 
                                    : 'bg-white text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Content: Loading vs Data */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-brand-dark mb-4" size={40} />
                            <p className="text-gray-500">Menyiapkan paket terbaik untukmu...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                            {filteredPackages.length > 0 ? (
                                filteredPackages.map((pkg) => (
                                    <PackageCard
                                        key={pkg.id}
                                        id={pkg.id}
                                        // Mapping Data Database ke Props Component
                                        title={pkg.nama_paket}      
                                        price={pkg.harga}           
                                        duration={pkg.durasi}       
                                        description={pkg.deskripsi} 
                                        category={pkg.kategori}     
                                        discount={pkg.diskon}       
                                        onSelect={handleBuyPackage}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
                                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900">Paket Tidak Ditemukan</h3>
                                    <p className="text-gray-500">Belum ada paket untuk kategori {filterCategory} saat ini.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
}