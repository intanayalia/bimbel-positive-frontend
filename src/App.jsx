import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import DashboardGuru from './components/pages/dashboardguru';
import KelasGuru from './components/pages/kelasguru' ;
import TryoutGuru from './components/pages/tryoutguru';
import IsiTryoutGuru from './components/pages/isitryoutguru';
import RekapGuru from './components/pages/rekapguru';
import PembayaranSiswa from './components/pages/pembayaransiswa';
import DetailPembayaran from './components/pages/detailpembayaran';
import HasilPembayaran from './components/pages/hasilpembayaran';
import HistoryPembayaran from './components/pages/historypembayaran';
import DashboardAdmin from './components/pages/dashboardadmin';
import AdminPengguna from './components/pages/adminpengguna';
import AdminAbsensi from './components/pages/adminabsensi';
import AdminPembayaran from './components/pages/adminpembayaran';
import AdminPaket from './components/pages/adminpaket';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tutor" element={<AllTutorsPage />} />
        <Route path="/pricing" element={<AllPricingPage />} />
        <Route path="/tentangkami" element={<AboutUsPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<DashboardSiswa />} />
        <Route path="/kelas/:id" element={<Kelas />} />
        <Route path="/tryout" element={<Tryout />} />
        <Route path="/isi-tryout/:id" element={<IsiTryout />} />
        <Route path="/hasil-tryout" element={<HasilTryout />} />
        <Route path="/pembahasan-tryout/:id" element={<PembahasanTryout />} />
        <Route path="/rekap" element={<Rekap />} />
        <Route path="/profilesiswa" element={<ProfileSiswa />} />
        <Route path="/dashboard-guru" element={<DashboardGuru />} />
        <Route path="/kelas-guru/:id" element={<KelasGuru />} />
        <Route path="/tryout-guru" element={<TryoutGuru />} />
        <Route path="/tryout-guru/:id" element={<IsiTryoutGuru />} />
        <Route path="/rekap-guru" element={<RekapGuru />} />
        <Route path="/pembayaransiswa" element={<PembayaranSiswa />} />
        <Route path="/pembayaran/detail" element={<DetailPembayaran />} />
        <Route path="/hasilpembayaran" element={<HasilPembayaran />} />
        <Route path="/historypembayaran" element={<HistoryPembayaran />} /> 
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/pengguna" element={<AdminPengguna />} />
        <Route path="/admin/absensi" element={<AdminAbsensi />} />
        <Route path="/admin/pembayaran" element={<AdminPembayaran />} />
        <Route path="/admin/paket" element={<AdminPaket />} />

        <Route path="*" element={<h1 className="text-center p-20 text-2xl font-bold text-brand-dark">404 | Halaman Tidak Ditemukan</h1>} />
      </Routes>
    </Router>
  );
}

export default App;