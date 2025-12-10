import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigasiSiswa from '../common/navigasisiswa';

// Pastikan file gambar ini ada di folder public/assets/
// Gunakan path string langsung karena file ada di public
const LOGO_BNI = "/assets/bnii.png";
const LOGO_BRI = "/assets/bri.png";
const LOGO_QRIS = "/assets/qris.png";

const DetailPembayaran = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Menerima data dari halaman sebelumnya
  const { method, amount, orderId } = location.state || {};

  // --- STATE DATA (BACKEND READY) ---
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // State untuk menampung data transaksi dari "Backend"
  const [transactionData, setTransactionData] = useState({
    total_amount: 0,
    order_id: '',
    payment_type: '', // 'bank_transfer' atau 'qris'
    bank_name: '',
    va_number: '',
    qr_url: '', // URL gambar QR Code
    expiry_time: 0 // dalam detik
  });

  // --- SIMULASI FETCH DATA BACKEND ---
  useEffect(() => {
    // Jika tidak ada metode yang dipilih, kembalikan ke halaman pilih
    if (!method) {
      navigate('/pembayaran');
      return;
    }

    const fetchPaymentDetails = async () => {
      setLoading(true);
      
      // >>> DI SINI NANTI ANDA PANGGIL API BACKEND <<<
      // const res = await api.post('/payment/charge', { method, amount });
      
      // SIMULASI RESPONSE BACKEND (DUMMY DATA)
      // Kita set timeout biar kerasa kayak loading server
      setTimeout(() => {
        const dummyResponse = {
          total_amount: amount || 250000,
          order_id: orderId || "SNV1520",
          payment_type: method === 'QRIS' ? 'qris' : 'bank_transfer',
          bank_name: method,
          // Data Dummy VA (Sesuai Gambar 1)
          va_number: "8806 082 727 109 225 3", 
          // Data Dummy QR Code (URL Random QR untuk contoh)
          qr_url: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ContohPembayaranBackend",
          expiry_time: 3562 // Detik sisa (contoh 59 menit 22 detik)
        };

        setTransactionData(dummyResponse);
        setTimeLeft(dummyResponse.expiry_time);
        setLoading(false);
      }, 1000);
    };

    fetchPaymentDetails();
  }, [method, amount, orderId, navigate]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (!timeLeft) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  // --- COPY TO CLIPBOARD ---
  const handleCopyVA = () => {
    navigator.clipboard.writeText(transactionData.va_number.replace(/\s/g, ''));
    alert("Nomor Virtual Account disalin!");
  };

  // --- RENDER LOGO ---
  const getLogo = (bankName) => {
    if (bankName === 'BNI') return LOGO_BNI;
    if (bankName === 'BRI') return LOGO_BRI;
    if (bankName === 'QRIS') return LOGO_QRIS;
    return null;
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-gray-500">Memproses Pembayaran...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-800">
      <NavigasiSiswa />

      <div className="max-w-3xl mx-auto px-4 py-10 pt-24">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-8 md:p-10 min-h-[500px] flex flex-col justify-between">
          
          {/* HEADER (Sama untuk semua metode) */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Harga</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Rp {transactionData.total_amount.toLocaleString('id-ID')}
              </h1>
              <p className="text-gray-400 text-sm">
                {transactionData.payment_type === 'qris' ? 'ID Transaksi' : 'Order ID'} {transactionData.order_id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm font-medium mb-1">Bayar dalam :</p>
              <div className="text-xl md:text-2xl font-bold text-blue-600 font-mono">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* KONTEN DINAMIS BERDASARKAN METODE */}
          <div className="flex-1 flex flex-col justify-center">
            
            {/* --- CASE 1: BANK TRANSFER (BNI/BRI) --- */}
            {transactionData.payment_type === 'bank_transfer' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <img src={getLogo(transactionData.bank_name)} alt={transactionData.bank_name} className="h-6 object-contain" />
                  <span className="font-bold text-gray-700">Bank {transactionData.bank_name}</span>
                </div>

                <div className="border-t border-b border-gray-100 py-6 mb-6">
                  <p className="text-sm text-gray-500 mb-2">No Rekening / Virtual Account</p>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#74151e] tracking-wide">
                      {transactionData.va_number}
                    </h2>
                    <button 
                      onClick={handleCopyVA}
                      className="text-[#74151e] font-bold text-sm hover:underline"
                    >
                      Salin
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-gray-500 mb-8">
                  <p>Prose verifikasi akan dilakukan kurang dari 10 menit setelah dilakukan pembayaran</p>
                  <p>Bayar pesanan ke Virtual Akun diatas sebelum membuat pesanan lain dengan nomor yang sama</p>
                  <p>Bayar pesanan ke Virtual Akun diatas sebelum waktu habis</p>
                </div>

                <button 
                  onClick={() => navigate('/dashboard-siswa')}
                  className="w-full bg-[#74151e] text-white py-3 rounded-lg font-bold shadow hover:bg-[#5a1017] transition-all"
                >
                  Oke
                </button>
              </div>
            )}

            {/* --- CASE 2: QRIS --- */}
            {transactionData.payment_type === 'qris' && (
              <div className="flex flex-col items-center animate-in fade-in duration-500">
                
                {/* QR Code Container */}
                <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm mb-4">
                  {/* Ini Barcode dari Backend */}
                  <img 
                    src={transactionData.qr_url} 
                    alt="QR Code Pembayaran" 
                    className="w-48 h-48 md:w-56 md:h-56 object-contain"
                  />
                </div>

                <div className="flex items-center gap-2 mb-8 opacity-70">
                  <span className="text-sm text-gray-500">Powered by</span>
                  <img src={LOGO_QRIS} alt="QRIS" className="h-5" />
                </div>

                <button 
                  onClick={() => navigate('/dashboard-siswa')}
                  className="w-full bg-[#74151e] text-white py-3 rounded-lg font-bold shadow hover:bg-[#5a1017] transition-all"
                >
                  Saya Sudah Bayar
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPembayaran;