import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import NavigasiSiswa from '../common/navigasisiswa';

const HasilPembayaran = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. STATE & DATA MANAGEMENT (Backend Ready) ---
  const [dataTransaksi, setDataTransaksi] = useState(null);

  useEffect(() => {
    // Cek apakah ada data yang dikirim dari halaman sebelumnya (DetailPembayaran)
    const stateData = location.state;

    if (stateData) {
      // SKENARIO 1: DATA ASLI DARI PROSES SEBELUMNYA
      // Data ini dikirim setelah sukses bayar di halaman detail
      setDataTransaksi(stateData);
    } else {
      // SKENARIO 2: DATA DUMMY (Untuk keperluan Design Preview / Testing)
      // Jika user langsung buka halaman ini tanpa bayar, kita tampilkan dummy
      const dummyData = {
        total_amount: 250000,
        transaction_id: "SNV1520",
        payment_method: "Transfer Bank",
        transaction_date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }), // Contoh: 25 Desember 2025
        status: "success"
      };
      setDataTransaksi(dummyData);
    }
  }, [location.state]);

  // Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  if (!dataTransaksi) return null; // Prevent render error saat init

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-800">
      <NavigasiSiswa />

      <div className="max-w-md mx-auto px-4 py-10 pt-28 flex flex-col items-center">
        
        {/* --- CARD STRUK (RECEIPT STYLE) --- */}
        <div className="w-full drop-shadow-xl filter">
          
          {/* 1. HEADER MERAH BERGELOMBANG */}
          <div className="relative bg-[#74151e] pt-8 pb-8 rounded-t-xl">
             {/* Dekorasi Gelombang Bawah Header (Gigi Tiket) */}
             <div className="absolute -bottom-3 left-0 w-full flex justify-between px-2 overflow-hidden">
                {/* Kita buat deretan lingkaran putih untuk efek 'sobekan' */}
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-white rounded-full -mb-4"></div>
                ))}
             </div>
          </div>

          {/* 2. BODY STRUK (PUTIH) */}
          <div className="bg-white px-8 pt-10 pb-10 relative">
            
            {/* Icon Sukses */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-green-100 shadow-sm">
                <Check size={40} className="text-white stroke-[3]" />
              </div>
            </div>

            {/* Judul & Pesan */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Transaksi Berhasil !</h2>
              <p className="text-gray-400 text-xs">Transaksi anda telah kami proses</p>
            </div>

            {/* Garis Pemisah */}
            <div className="border-t border-gray-100 mb-8"></div>

            {/* Total Harga */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900">
                {formatRupiah(dataTransaksi.total_amount)}
              </h1>
            </div>

            {/* Detail Informasi */}
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">Tanggal</span>
                <span className="text-gray-500 font-medium">{dataTransaksi.transaction_date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">ID Transaksi</span>
                <span className="text-gray-500 font-medium">{dataTransaksi.transaction_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">Metode Pembayaran</span>
                <span className="text-gray-500 font-medium">{dataTransaksi.payment_method}</span>
              </div>
            </div>

            {/* Garis Penutup Bawah */}
            <div className="border-t border-gray-100 mt-8"></div>

          </div>

          {/* 3. FOOTER BERGELOMBANG (BAWAH) */}
          <div className="relative bg-white pb-4 rounded-b-xl">
            {/* Dekorasi Gelombang Bawah Struk (Gigi Tiket Bolong) */}
            <div className="absolute -bottom-3 left-0 w-full flex justify-between px-2 overflow-hidden h-4">
                {/* Lingkaran warna background halaman (#F5F5F5) untuk efek kertas putus */}
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-[#F5F5F5] rounded-full -mt-3"></div>
                ))}
            </div>
          </div>

        </div>

        {/* --- TOMBOL SELESAI --- */}
        <button 
          onClick={() => navigate('/dashboard-siswa')} 
          className="mt-12 bg-[#74151e] text-white px-12 py-3 rounded-lg font-bold shadow-lg hover:bg-[#5a1017] transition-all transform hover:scale-105"
        >
          Selesai
        </button>

      </div>
    </div>
  );
};

export default HasilPembayaran;