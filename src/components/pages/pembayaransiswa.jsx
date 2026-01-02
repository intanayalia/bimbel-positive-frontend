import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle } from 'lucide-react'; // Icon tambahan
import NavigasiSiswa from '../common/navigasisiswa'; 
import api from '../../api';

const PembayaranSiswa = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [selectedPackage, setSelectedPackage] = useState(null); // Ganti method jadi package
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); 

  // --- LOGIC TIMER (Visual) ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- INTEGRASI MIDTRANS SCRIPT ---
  useEffect(() => {
    // Pastikan Client Key sesuai .env Laravel Anda
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myClientKey = "Mid-client-7cQwmcDYgOx5MNEy"; // Ganti dengan Client Key Midtrans Anda

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myClientKey);
    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  // --- OPSI PAKET ---
  const packages = [
    { id: 'premium', name: 'Paket Tryout Premium', price: 50000, desc: 'Akses 50+ Tryout & Pembahasan' },
    { id: 'intensif', name: 'Paket Bimbingan Intensif', price: 350000, desc: 'Tryout + Video Materi + Konsultasi' }
  ];

  // --- HANDLER PEMBAYARAN (CONNECT TO BACKEND) ---
  const handlePayment = async () => {
    if (!selectedPackage) return alert("Silakan pilih paket belajar terlebih dahulu.");
    
    setLoading(true);
    try {
        // 1. Request Snap Token ke Backend Laravel
        const response = await api.post('/payment/create', {
            product_name: selectedPackage.name,
            amount: selectedPackage.price
        });

        const { snap_token } = response.data;

        // 2. Munculkan Popup Midtrans
        if (window.snap) {
            window.snap.pay(snap_token, {
                onSuccess: function(result) {
                    navigate('/pembayaran/status', { 
                        state: { 
                            status: 'success', 
                            transaction_id: result.order_id,
                            amount: selectedPackage.price,
                            method: result.payment_type
                        } 
                    });
                },
                onPending: function(result) {
                    navigate('/pembayaran/status', { 
                        state: { status: 'pending', transaction_id: result.order_id } 
                    });
                },
                onError: function(result) {
                    navigate('/pembayaran/status', { 
                        state: { status: 'error', transaction_id: result.order_id } 
                    });
                },
                onClose: function() {
                    alert('Anda menutup popup sebelum menyelesaikan pembayaran.');
                }
            });
        }
    } catch (error) {
        console.error("Payment Error:", error);
        alert("Gagal memproses pembayaran. Cek koneksi backend.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F9FD] min-h-screen font-sans pb-20">
      <NavigasiSiswa />

      <div className="container mx-auto px-6 pt-24 max-w-4xl">
        
        {/* Header Timer */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">Pilih Paket Belajar</h1>
            <p className="text-gray-500 text-sm mt-1">Investasi terbaik untuk masa depanmu.</p>
          </div>
          <div className="bg-red-50 text-[#74151e] px-4 py-2 rounded-lg font-mono font-bold text-lg border border-red-100">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          
          <p className="text-sm font-bold text-gray-800 mb-4">Pilihan Paket Tersedia</p>
          
          <div className="space-y-4">
            {packages.map((pkg) => (
                <label 
                    key={pkg.id}
                    className={`flex items-center justify-between p-5 border rounded-xl cursor-pointer transition-all ${
                        selectedPackage?.id === pkg.id 
                        ? 'border-[#74151e] ring-1 ring-[#74151e] bg-red-50/10' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <input 
                            type="radio" 
                            name="package" 
                            checked={selectedPackage?.id === pkg.id}
                            onChange={() => setSelectedPackage(pkg)}
                            className="w-5 h-5 text-[#74151e] focus:ring-[#74151e]"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800">{pkg.name}</span>
                                {pkg.id === 'intensif' && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">BEST SELLER</span>}
                            </div>
                            <p className="text-sm text-gray-500">{pkg.desc}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-lg font-extrabold text-[#74151e]">
                            Rp {pkg.price.toLocaleString('id-ID')}
                        </span>
                    </div>
                </label>
            ))}
          </div>

          {/* TOTAL & BUTTON */}
          <div className="mt-8 border-t border-gray-100 pt-6 flex justify-between items-center">
             <div>
                 <p className="text-sm text-gray-500">Total Pembayaran</p>
                 <p className="text-2xl font-extrabold text-gray-800">
                    Rp {selectedPackage ? selectedPackage.price.toLocaleString('id-ID') : '0'}
                 </p>
             </div>
             <button
               onClick={handlePayment}
               disabled={loading || !selectedPackage}
               className={`px-8 py-3 bg-[#74151e] text-white rounded-lg font-bold shadow-lg hover:bg-[#5a1017] transition-all transform hover:-translate-y-1 ${
                   (loading || !selectedPackage) ? 'opacity-50 cursor-not-allowed' : ''
               }`}
             >
               {loading ? 'Memproses...' : 'Bayar Sekarang'}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PembayaranSiswa;