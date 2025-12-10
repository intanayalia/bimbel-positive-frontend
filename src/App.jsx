import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- IMPORT COMPONENTS COMMON ---
// (Pastikan path import sesuai dengan struktur folder Anda)

// --- IMPORT HALAMAN UMUM & SISWA ---
import Home from './components/pages/home'; 
import Register from './components/pages/register';
import Login from './components/pages/login';
import AllTutorsPage from './components/pages/alltutorspage';
import ForgotPassword from './components/pages/forgotpassword';
import AllPricingPage from './components/pages/allpricingpage';
import AboutUsPage from './components/pages/aboutuspage';
import DashboardSiswa from './components/pages/dashboardsiswa';
import Kelas from './components/pages/kelas';
import Tryout from './components/pages/tryout';
import IsiTryout from './components/pages/isitryout';
import HasilTryout from './components/pages/hasiltryout';
import PembahasanTryout from './components/pages/pembahasantryout';
import Rekap from './components/pages/rekap';
import ProfileSiswa from './components/pages/profilesiswa';
import PembayaranSiswa from './components/pages/pembayaransiswa'; // Jika sudah ada
import DetailPembayaran from './components/pages/detailpembayaran'; // Jika sudah ada
import HistoryPembayaran from './components/pages/historypembayaran'; // Jika sudah ada

// --- IMPORT HALAMAN GURU (YANG SEBELUMNYA KURANG) ---
import DashboardGuru from './components/pages/dashboardguru';
import TryoutGuru from './components/pages/tryoutguru';
import IsiTryoutGuru from './components/pages/isitryoutguru';
import KelasGuru from './components/pages/kelasguru';
import RekapGuru from './components/pages/rekapguru';
import ProfileGuru from './components/pages/profileguru';

function App() {
  return (
    <Router>
      <Routes>
        {/* =========================================
            RUTE PUBLIK (Bisa diakses siapa saja)
           ========================================= */}
        <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tutor" element={<AllTutorsPage />} />
        <Route path="/pricing" element={<AllPricingPage />} />
        <Route path="/tentangkami" element={<AboutUsPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* =========================================
            RUTE SISWA
           ========================================= */}
        <Route path="/dashboard" element={<DashboardSiswa />} />
        <Route path="/kelas/:id" element={<Kelas />} />
        
        {/* Fitur Tryout Siswa */}
        <Route path="/tryout" element={<Tryout />} />
        <Route path="/isi-tryout/:id" element={<IsiTryout />} />
        <Route path="/hasil-tryout" element={<HasilTryout />} />
        <Route path="/pembahasan-tryout/:id" element={<PembahasanTryout />} />
        
        {/* Profil & Rekap Siswa */}
        <Route path="/rekap" element={<Rekap />} />
        <Route path="/profilesiswa" element={<ProfileSiswa />} />

        {/* Pembayaran Siswa */}
        <Route path="/pembayaran" element={<PembayaranSiswa />} />
        <Route path="/detail-pembayaran" element={<DetailPembayaran />} />
        <Route path="/history-pembayaran" element={<HistoryPembayaran />} />

        {/* =========================================
            RUTE GURU (TAMBAHAN BARU)
           ========================================= */}
        <Route path="/dashboard-guru" element={<DashboardGuru />} />
        <Route path="/tryout-guru" element={<TryoutGuru />} />
        <Route path="/isi-tryout-guru" element={<IsiTryoutGuru />} />
        <Route path="/kelas-guru/:id" element={<KelasGuru />} />
        <Route path="/rekap-guru" element={<RekapGuru />} />
        <Route path="/profileguru" element={<ProfileGuru />} />

        {/* =========================================
            RUTE 404 (Halaman Tidak Ditemukan)
           ========================================= */}
        <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <h1 className="text-6xl font-bold text-brand-dark mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Halaman yang Anda cari tidak ditemukan.</p>
                <a href="/" className="px-6 py-3 bg-red-900 text-white rounded-lg font-bold hover:bg-red-800 transition">
                    Kembali ke Beranda
                </a>
            </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;