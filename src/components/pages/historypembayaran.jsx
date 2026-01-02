import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, CreditCard, ChevronRight, FileText, Plus, Loader2, AlertCircle } from 'lucide-react';
import NavigasiSiswa from '../common/navigasisiswa';
import api from '../../api';

const HistoryPembayaran = () => {
    const navigate = useNavigate();
    
    // ==========================================
    // 1. STATE MANAGEMENT
    // ==========================================
    const [loading, setLoading] = useState(true);
    const [historyData, setHistoryData] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');

    // ==========================================
    // 2. FETCH DATA DARI BACKEND
    // ==========================================
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                // Panggil API Laravel: GET /api/payment/history
                const response = await api.get('/payment/history');
                setHistoryData(response.data);
            } catch (error) {
                console.error("Gagal memuat riwayat:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // ==========================================
    // 3. FILTER LOGIC
    // ==========================================
    const filteredData = historyData.filter(item => {
        if (filterStatus === 'all') return true;
        return item.status === filterStatus;
    });

    // Helper: Warna Status Badge
    const getStatusColor = (status) => {
        switch(status) {
            case 'success': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'failed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    // Helper: Label Status Indonesia
    const getStatusLabel = (status) => {
        switch(status) {
            case 'success': return 'Berhasil';
            case 'pending': return 'Menunggu Bayar';
            case 'failed': return 'Gagal';
            default: return status;
        }
    };

    return (
        <div className="bg-[#F8F9FD] min-h-screen font-sans">
            <NavigasiSiswa />
            
            <div className="container mx-auto max-w-5xl pt-24 pb-20 px-4 md:px-6">
                
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-800">Riwayat Pembayaran</h1>
                        <p className="text-gray-500 text-sm mt-1">Pantau semua transaksi pembelian paket belajarmu.</p>
                    </div>
                    
                    {/* TOMBOL BELI PAKET BARU (Sudah Diperbaiki Link-nya) */}
                    <button 
                        onClick={() => navigate('/pricing')} 
                        className="bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-brand-dark-accent transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={18} /> Beli Paket Baru
                    </button>
                </div>

                {/* FILTER TABS */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {['all', 'success', 'pending', 'failed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-all ${
                                filterStatus === status 
                                ? 'bg-brand-dark text-white shadow-md' 
                                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {status === 'all' ? 'Semua Transaksi' : getStatusLabel(status)}
                        </button>
                    ))}
                </div>

                {/* LIST TRANSAKSI */}
                <div className="space-y-4">
                    {loading ? (
                        // LOADING STATE
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-brand-dark mb-4" size={40} />
                            <p className="text-gray-500 text-sm">Memuat data transaksi...</p>
                        </div>
                    ) : filteredData.length > 0 ? (
                        // DATA ADA
                        filteredData.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => navigate('/pembayaran/detail', { state: { transaction: item } })}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                            >
                                {/* Garis Indikator Kiri */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                    item.status === 'success' ? 'bg-emerald-500' : 
                                    item.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                                }`}></div>

                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pl-3">
                                    
                                    {/* Info Kiri */}
                                    <div className="flex items-center gap-4 w-full">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            item.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'
                                        }`}>
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg mb-1">
                                                {item.product_name || `Order #${item.order_id}`}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12}/> 
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                                <span>•</span>
                                                <span className="uppercase tracking-wider">{item.order_id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Kanan (Harga & Status) */}
                                    <div className="flex items-center justify-between w-full md:w-auto gap-6 mt-4 md:mt-0">
                                        <div className="text-right">
                                            <p className="text-lg font-extrabold text-brand-dark">
                                                Rp {parseInt(item.amount).toLocaleString('id-ID')}
                                            </p>
                                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(item.status)}`}>
                                                {getStatusLabel(item.status)}
                                            </span>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-brand-dark group-hover:translate-x-1 transition-transform"/>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // EMPTY STATE (KOSONG)
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CreditCard size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Transaksi</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-6">
                                Anda belum memiliki riwayat pembelian paket apapun. Yuk mulai berlangganan sekarang!
                            </p>
                            <button 
                                onClick={() => navigate('/pricing')}
                                className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark-accent transition-all shadow-lg"
                            >
                                Lihat Daftar Paket
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default HistoryPembayaran;