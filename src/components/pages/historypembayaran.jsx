import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, CreditCard, ChevronRight, Download } from 'lucide-react';
import NavigasiSiswa from '../common/navigasisiswa';
import api from '../../api';

const HistoryPembayaran = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [historyData, setHistoryData] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');

    // --- FETCH DATA (BACKEND READY) ---
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                // PANGGIL API BACKEND
                // const response = await api.get('/payment/history');
                // setHistoryData(response.data.data);
                
                // --- SIMULASI DUMMY DATA ---
                // (Hapus blok setTimeout ini jika backend sudah ready)
                setTimeout(() => {
                    const dummyData = [
                        {
                            id: "TRX-SNV1525",
                            date: "2024-05-20T10:30:00",
                            title: "Pembayaran Tryout Akbar SNBT",
                            amount: 250000,
                            method: "BNI Virtual Account",
                            status: "success" // success, pending, failed
                        },
                        {
                            id: "TRX-SNV1524",
                            date: "2024-04-15T14:20:00",
                            title: "Paket Intensif UTBK - Bulan 1",
                            amount: 500000,
                            method: "QRIS",
                            status: "success"
                        },
                        {
                            id: "TRX-SNV1523",
                            date: "2024-04-10T09:00:00",
                            title: "Tryout Mandiri Sesi 1",
                            amount: 150000,
                            method: "BRI Virtual Account",
                            status: "pending"
                        },
                        {
                            id: "TRX-SNV1520",
                            date: "2024-03-01T08:00:00",
                            title: "Pendaftaran Member Baru",
                            amount: 100000,
                            method: "QRIS",
                            status: "failed"
                        }
                    ];
                    setHistoryData(dummyData);
                    setLoading(false);
                }, 800);

            } catch (error) {
                console.error("Error fetching history:", error);
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Helper Format Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    // Helper Format Tanggal
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Helper Status Badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'success':
                return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">Berhasil</span>;
            case 'pending':
                return <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200">Menunggu</span>;
            case 'failed':
                return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">Gagal</span>;
            default:
                return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">Unknown</span>;
        }
    };

    // Filter Data Logic
    const filteredData = filterStatus === 'all' 
        ? historyData 
        : historyData.filter(item => item.status === filterStatus);

    return (
        <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-800">
            <NavigasiSiswa />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
                
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#74151e]">Riwayat Pembayaran</h1>
                        <p className="text-gray-500 text-sm mt-1">Pantau semua transaksi bimbel kamu di sini.</p>
                    </div>

                    {/* Button Buat Pembayaran Baru */}
                    <button 
                        onClick={() => navigate('/pembayaran')} // Pastikan route ini mengarah ke halaman pilih paket/bayar
                        className="bg-[#74151e] text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:bg-[#5a1017] transition-all flex items-center gap-2"
                    >
                        <CreditCard size={18} />
                        Bayar Tagihan Baru
                    </button>
                </div>

                {/* FILTER & SEARCH BAR */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    
                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {['all', 'success', 'pending', 'failed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-all ${
                                    filterStatus === status 
                                    ? 'bg-red-50 text-[#74151e] border border-red-200' 
                                    : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                                }`}
                            >
                                {status === 'all' ? 'Semua' : status}
                            </button>
                        ))}
                    </div>

                    {/* Search (Visual Only for now) */}
                    <div className="relative w-full md:w-64">
                        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Cari ID Transaksi..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#74151e]"
                        />
                    </div>
                </div>

                {/* LIST TRANSAKSI */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Memuat riwayat...</div>
                    ) : filteredData.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                            <p className="text-gray-500 font-medium">Belum ada riwayat transaksi.</p>
                        </div>
                    ) : (
                        filteredData.map((item) => (
                            <div 
                                key={item.id} 
                                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
                            >
                                {/* Kiri: Info Utama */}
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${
                                        item.status === 'success' ? 'bg-green-50 text-green-600' : 
                                        item.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="font-mono text-xs text-gray-400 font-bold tracking-wide">#{item.id}</span>
                                            {getStatusBadge(item.status)}
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1"><Calendar size={14}/> {formatDate(item.date)}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>{item.method}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Kanan: Harga & Aksi */}
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 gap-4">
                                    <span className="text-xl font-bold text-[#74151e]">
                                        {formatRupiah(item.amount)}
                                    </span>
                                    
                                    <div className="flex gap-2">
                                        {/* Jika Pending, munculkan tombol Bayar */}
                                        {item.status === 'pending' && (
                                            <button 
                                                onClick={() => navigate('/pembayaran/detail', { 
                                                    state: { method: item.method.includes('QRIS') ? 'QRIS' : 'BNI', amount: item.amount, orderId: item.id } 
                                                })}
                                                className="px-4 py-1.5 bg-[#74151e] text-white text-xs font-bold rounded-md hover:bg-[#5a1017] transition-colors"
                                            >
                                                Lanjut Bayar
                                            </button>
                                        )}
                                        
                                        {/* Tombol Invoice (Hanya visual dummy) */}
                                        {item.status === 'success' && (
                                            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-bold rounded-md hover:bg-gray-50">
                                                <Download size={14}/> Invoice
                                            </button>
                                        )}

                                        <button className="text-gray-400 hover:text-[#74151e]">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default HistoryPembayaran;