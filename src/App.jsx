import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// =========================================
// 1. IMPORT SEMUA HALAMAN
// =========================================

// --- AUTH & PUBLIC ---
// Pastikan path-nya sesuai dengan folder Anda (misal: ./components/pages/...)
import Home from './components/pages/home';
import LoginPage from './components/pages/login';
import RegisterPage from './components/pages/register';
import AllPricingPage from './components/pages/allpricingpage';

// --- SISWA ---
import DashboardSiswa from './components/pages/dashboardsiswa';
import TryoutSiswa from './components/pages/tryout';
import IsiTryout from './components/pages/isitryout';
import HasilTryout from './components/pages/hasiltryout';
import HistoryPembayaran from './components/pages/historypembayaran';
import DetailPembayaran from './components/pages/detailpembayaran';
import PembahasanTryout from './components/pages/pembahasantryout';
import Rekap from './components/pages/rekap';
import Kelas from './components/pages/kelas';

// --- GURU ---
import DashboardGuru from './components/pages/dashboardguru';
import TryoutGuru from './components/pages/tryoutguru';
import IsiTryoutGuru from './components/pages/isitryoutguru'; // <--- (PENTING) Halaman Input Soal Guru
import RekapGuru from './components/pages/rekapguru';
import KelasGuru from './components/pages/kelasguru';

// --- ADMIN ---
import DashboardAdmin from './components/pages/dashboardadmin';
import AdminPaket from './components/pages/adminpaket';
import AdminPembayaran from './components/pages/adminpembayaran';
import AdminPengguna from './components/pages/adminpengguna';
import AdminAbsensi from './components/pages/adminabsensi';

// (Opsional) PrivateRoute untuk proteksi halaman butuh login
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  // Jika token tidak ada, tendang ke login
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* =========================================
            A. PUBLIC ROUTES
           ========================================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pricing" element={<AllPricingPage />} />

        {/* =========================================
            B. ROUTE SISWA
           ========================================= */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardSiswa /></PrivateRoute>} />

        <Route path="/tryout" element={<PrivateRoute><TryoutSiswa /></PrivateRoute>} />
        <Route path="/isi-tryout/:id" element={<PrivateRoute><IsiTryout /></PrivateRoute>} />
        <Route path="/hasil-tryout" element={<PrivateRoute><HasilTryout /></PrivateRoute>} />
        <Route path="/courses/:id" element={<PrivateRoute><Kelas /></PrivateRoute>} />

        <Route path="/pembayaran/history" element={<PrivateRoute><HistoryPembayaran /></PrivateRoute>} />
        <Route path="/pembayaran/detail" element={<PrivateRoute><DetailPembayaran /></PrivateRoute>} />
        {/* Halaman Pembahasan */}
        <Route path="/pembahasan-tryout/:id" element={<PrivateRoute><PembahasanTryout /></PrivateRoute>} />
        <Route path="/rekap" element={<PrivateRoute><Rekap /></PrivateRoute>} />
        <Route path="/historypembayaran" element={<PrivateRoute><HistoryPembayaran /></PrivateRoute>} />


        {/* =========================================
            C. ROUTE GURU
           ========================================= */}
        <Route path="/dashboard-guru" element={<PrivateRoute><DashboardGuru /></PrivateRoute>} />

        {/* Halaman List Tryout */}
        <Route path="/tryout-guru" element={<PrivateRoute><TryoutGuru /></PrivateRoute>} />
        <Route path="/rekap-guru" element={<PrivateRoute><RekapGuru /></PrivateRoute>} />
        <Route path="/kelas-guru/:id" element={<PrivateRoute><KelasGuru /></PrivateRoute>} />

        {/* ✅ (FIX 404) ROUTE INPUT SOAL GURU */}
        {/* URL ini dipanggil saat Anda klik tombol "Kelola Soal" */}
        <Route
          path="/teacher/tryouts/:id/questions"
          element={<PrivateRoute><IsiTryoutGuru /></PrivateRoute>}
        />


        {/* =========================================
            D. ROUTE ADMIN
           ========================================= */}
        <Route path="/admin/dashboard" element={<PrivateRoute><DashboardAdmin /></PrivateRoute>} />
        <Route path="/admin/paket" element={<PrivateRoute><AdminPaket /></PrivateRoute>} />
        <Route path="/admin/pembayaran" element={<PrivateRoute><AdminPembayaran /></PrivateRoute>} />
        <Route path="/admin/pengguna" element={<PrivateRoute><AdminPengguna /></PrivateRoute>} />
        <Route path="/admin/absensi" element={<PrivateRoute><AdminAbsensi /></PrivateRoute>} />


        {/* =========================================
            E. FALLBACK (Jika halaman tidak ditemukan)
           ========================================= */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold text-red-800 mb-2">404</h1>
            <p className="text-gray-600">Halaman yang Anda cari tidak ditemukan.</p>
            <a href="/" className="mt-4 text-blue-600 hover:underline">Kembali ke Beranda</a>
          </div>
        } />

      </Routes>
    </Router>
  );
}

export default App;