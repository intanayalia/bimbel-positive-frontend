import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Calendar, Package, ShieldCheck } from 'lucide-react';
import NavigasiSiswa from '../common/navigasisiswa';
import useMidtrans from '../hooks/useMidtrans'; // Import Hook yang baru dibuat

const DetailPembayaran = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [trx, setTrx] = useState(null);

  // 1. Panggil Hook untuk memuat script Midtrans secara otomatis
  const isSnapReady = useMidtrans(); 

  // 2. Ambil data transaksi dari state navigasi
  useEffect(() => {
    if (location.state?.transaction) {
        setTrx(location.state.transaction);
    } else {
        // Jika halaman diakses langsung tanpa data, kembalikan ke history
        navigate('/pembayaran/history');
    }
  }, [location, navigate]);

  if (!trx) return null;

  // 3. Helper: Warna Status
  const getStatusColor = (status) => {
    switch(status) {
        case 'success': return 'bg-emerald-500';
        case 'pending': return 'bg-orange-500';
        case 'failed': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
        case 'success': return 'Pembayaran Berhasil';
        case 'pending': return 'Menunggu Pembayaran';
        case 'failed': return 'Pembayaran Gagal';
        default: return status;
    }
  };

  // 4. Fungsi Eksekusi Pembayaran (Midtrans Snap)
  const handlePayRetry = () => {
      // Pastikan Script sudah siap, Window.snap ada, dan Token tersedia
      if (isSnapReady && window.snap && trx.snap_token) {
          window.snap.pay(trx.snap_token, {
              onSuccess: (result) => {
                  console.log("Sukses:", result);
                  navigate('/historypembayaran', { state: trx });
              },
              onPending: (result) => {
                  console.log("Pending:", result);
                  alert("Menunggu pembayaran diselesaikan...");
                  navigate('/pembayaran/history');
              },
              onError: (result) => {
                  console.log("Error:", result);
                  alert("Pembayaran gagal atau dibatalkan.");
              },
              onClose: () => {
                  console.log("Popup ditutup tanpa bayar");
              }
          });
      } else {
          if (!isSnapReady) {
            alert("Sistem pembayaran sedang memuat, harap tunggu sebentar...");
          } else if (!trx.snap_token) {
            alert("Token pembayaran tidak ditemukan. Silakan buat pesanan baru.");
          }
      }
  };

  return (
    <div className="bg-[#F8F9FD] min-h-screen font-sans pb-20">
      <NavigasiSiswa />
      
      <div className="container mx-auto max-w-xl pt-28 px-4">
        
        {/* Tombol Kembali */}
        <button 
            onClick={() => navigate('/pembayaran/history')} 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 font-medium transition-colors"
        >
            <ArrowLeft size={20} /> Kembali ke Riwayat
        </button>

        {/* Card Detail Transaksi */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            
            {/* Header Status */}
            <div className={`p-6 text-center text-white ${getStatusColor(trx.status)}`}>
                <h2 className="text-2xl font-bold mb-1">
                    {getStatusLabel(trx.status)}
                </h2>
                <p className="opacity-90 text-sm font-mono">Order ID: {trx.order_id}</p>
            </div>

            <div className="p-8">
                {/* Info Produk */}
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Package size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Paket Belajar</p>
                        <h3 className="text-xl font-bold text-gray-800 leading-tight">
                            {trx.product_name || trx.package?.nama_paket || "Nama Paket Tidak Tersedia"}
                        </h3>
                    </div>
                </div>

                <div className="border-b-2 border-dashed border-gray-100 mb-8"></div>

                {/* Rincian Harga & Waktu */}
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 flex items-center gap-2">
                            <Calendar size={16}/> Tanggal Order
                        </span>
                        <span className="font-semibold text-gray-700">
                            {new Date(trx.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <span className="text-gray-800 font-bold text-lg">Total Tagihan</span>
                        <span className="text-[#74151e] font-extrabold text-2xl">
                            Rp {parseInt(trx.amount).toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                {/* Tombol Bayar (Hanya Muncul Jika Pending) */}
                {trx.status === 'pending' ? (
                    <button 
                        onClick={handlePayRetry}
                        disabled={!isSnapReady} // Disable tombol sampai script siap
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-3 active:scale-95 ${
                            isSnapReady 
                            ? 'bg-[#74151e] text-white hover:bg-[#5a1017]' 
                            : 'bg-gray-300 text-gray-500 cursor-wait'
                        }`}
                    >
                        <CreditCard size={20}/> 
                        {isSnapReady ? 'Bayar Sekarang' : 'Memuat Sistem...'}
                    </button>
                ) : (
                    <button 
                        disabled
                        className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold cursor-not-allowed border border-gray-200 flex justify-center items-center gap-2"
                    >
                        <ShieldCheck size={20}/> Transaksi Selesai
                    </button>
                )}

                <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
                    <ShieldCheck size={12}/> Pembayaran aman via Midtrans Gateway
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPembayaran;