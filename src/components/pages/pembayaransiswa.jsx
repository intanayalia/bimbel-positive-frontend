import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigasiSiswa from '../common/navigasisiswa'; 

const PembayaranSiswa = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [selectedMethod, setSelectedMethod] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600); // 1 Jam hitung mundur

  // --- LOGIC TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  // --- HANDLER NAVIGASI KE DETAIL (BACKEND READY) ---
  const handlePayment = () => {
    if (!selectedMethod) return alert("Silakan pilih metode pembayaran terlebih dahulu.");
    
    // Di sini kita mengirim data ke halaman 'DetailPembayaran.jsx'
    // Data ini ceritanya didapat dari database/backend sebelumnya
    const transactionPayload = {
      method: selectedMethod,  // 'BNI', 'BRI', atau 'QRIS'
      amount: 250000,          // Harga (Bisa diambil dari props/state keranjang)
      orderId: "SNV1520"       // ID Transaksi Unik
    };

    // Arahkan ke halaman detail (Halaman yang akan menampilkan No Rek / Barcode)
    navigate('/pembayaran/detail', { state: transactionPayload });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-800">
      <NavigasiSiswa />

      <div className="max-w-4xl mx-auto px-4 py-10 pt-24">
        
        {/* CARD UTAMA */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-8 md:p-12">
          
          {/* HEADER: TOTAL & TIMER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-100 pb-8 gap-6">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Harga</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Rp 250.000</h1>
              <p className="text-gray-400 text-xs font-mono">ID Transaksi SNV1520</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm font-medium mb-1">Bayar dalam :</p>
              <div className="text-2xl font-bold text-blue-600 font-mono tracking-wider">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* PILIHAN METODE PEMBAYARAN */}
          <div className="mb-8">
            <h3 className="text-gray-500 text-sm font-medium mb-4">Metode Pembayaran</h3>

            {/* GROUP: TRANSFER BANK */}
            <div className="mb-6">
              <p className="text-sm font-bold text-gray-800 mb-3">Transfer Bank</p>
              <div className="space-y-3">
                
                {/* Opsi BNI */}
                <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all bg-white hover:bg-gray-50 ${
                    selectedMethod === 'BNI' ? 'border-[#74151e] ring-1 ring-[#74151e] bg-red-50/10' : 'border-gray-200'
                }`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="BNI" 
                    checked={selectedMethod === 'BNI'}
                    onChange={() => setSelectedMethod('BNI')}
                    className="w-5 h-5 text-[#74151e] focus:ring-[#74151e]"
                  />
                  {/* Logo dari Folder Public/assets */}
                  <img src="/assets/bnii.png" alt="BNI" className="h-8 object-contain" /> 
                </label>

                {/* Opsi BRI */}
                <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all bg-white hover:bg-gray-50 ${
                    selectedMethod === 'BRI' ? 'border-[#74151e] ring-1 ring-[#74151e] bg-red-50/10' : 'border-gray-200'
                }`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="BRI" 
                    checked={selectedMethod === 'BRI'}
                    onChange={() => setSelectedMethod('BRI')}
                    className="w-5 h-5 text-[#74151e] focus:ring-[#74151e]"
                  />
                  {/* Logo dari Folder Public/assets */}
                  <img src="/assets/bri.png" alt="BRI" className="h-8 object-contain" />
                </label>

              </div>
            </div>

            {/* GROUP: QRIS */}
            <div>
              <p className="text-sm font-bold text-gray-800 mb-3">Qris</p>
              <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all bg-white hover:bg-gray-50 ${
                  selectedMethod === 'QRIS' ? 'border-[#74151e] ring-1 ring-[#74151e] bg-red-50/10' : 'border-gray-200'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="QRIS" 
                  checked={selectedMethod === 'QRIS'}
                  onChange={() => setSelectedMethod('QRIS')}
                  className="w-5 h-5 text-[#74151e] focus:ring-[#74151e]"
                />
                {/* Logo dari Folder Public/assets */}
                <img src="/assets/qris.png" alt="QRIS" className="h-8 object-contain" />
              </label>
            </div>

          </div>

          {/* TOMBOL KONFIRMASI */}
          <div className="flex justify-end pt-4">
             <button
               onClick={handlePayment}
               className="w-full sm:w-auto px-8 py-3 bg-[#74151e] text-white rounded-lg font-bold shadow-md hover:bg-[#5a1017] transition-all"
             >
               Konfirmasi Metode
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PembayaranSiswa;