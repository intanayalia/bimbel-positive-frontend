import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X, Clock, ArrowRight } from 'lucide-react';
import NavigasiSiswa from '../common/navigasisiswa';

const HasilPembayaran = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil data dari state navigasi (dikirim dari pembayaransiswa.jsx)
  const [dataTransaksi, setDataTransaksi] = useState(null);

  useEffect(() => {
    if (location.state) {
      setDataTransaksi(location.state);
    } else {
        // Jika user akses langsung URL ini tanpa transaksi, redirect ke history
        navigate('/pembayaran/history');
    }
  }, [location, navigate]);

  if (!dataTransaksi) return null;

  // Tentukan Icon & Warna berdasarkan status
  const getStatusUI = () => {
      switch(dataTransaksi.status) {
          case 'success': return { icon: <Check size={40} />, color: 'bg-green-500', title: 'Pembayaran Berhasil!', desc: 'Paket Anda sudah aktif.' };
          case 'pending': return { icon: <Clock size={40} />, color: 'bg-orange-500', title: 'Menunggu Pembayaran', desc: 'Silakan selesaikan pembayaran Anda.' };
          default: return { icon: <X size={40} />, color: 'bg-red-500', title: 'Pembayaran Gagal', desc: 'Terjadi kesalahan saat memproses.' };
      }
  };

  const ui = getStatusUI();

  return (
    <div className="bg-[#F8F9FD] min-h-screen font-sans">
      <NavigasiSiswa />
      
      <div className="container mx-auto px-6 pt-32 flex justify-center">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
          
          {/* HEADER WARNA */}
          <div className={`${ui.color} p-8 text-center text-white`}>
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                {ui.icon}
            </div>
            <h2 className="text-2xl font-bold">{ui.title}</h2>
            <p className="opacity-90 text-sm mt-1">{ui.desc}</p>
          </div>

          {/* DETAIL TRANSAKSI */}
          <div className="p-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-500 text-sm">ID Transaksi</span>
                <span className="font-mono font-bold text-gray-700 text-sm">{dataTransaksi.transaction_id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-500 text-sm">Tanggal</span>
                <span className="font-bold text-gray-700 text-sm">
                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              {dataTransaksi.amount && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-gray-800">Total Bayar</span>
                    <span className="font-extrabold text-[#74151e] text-xl">
                        Rp {dataTransaksi.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
              )}
            </div>

            <div className="mt-8 space-y-3">
                <button 
                    onClick={() => navigate('/pembayaran/history')} 
                    className="w-full bg-[#74151e] text-white py-3 rounded-xl font-bold hover:bg-[#5a1017] transition-all shadow-lg flex justify-center items-center gap-2"
                >
                    Lihat Riwayat <ArrowRight size={18}/>
                </button>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                    Ke Dashboard
                </button>
            </div>
          </div>

          {/* Footer Dekoratif */}
          <div className="h-2 bg-gradient-to-r from-orange-400 to-red-600"></div>
        </div>
      </div>
    </div>
  );
};

export default HasilPembayaran;