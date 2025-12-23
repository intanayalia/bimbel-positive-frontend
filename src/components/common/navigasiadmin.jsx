import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, Wallet, BookOpen, LogOut, Package } from 'lucide-react';

const NavigasiAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // FUNGSI LOGOUT
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.clear(); // Hapus token & user info
      navigate('/login');   // Arahkan ke login
    }
  };

  // DEFINISI MENU (Sesuaikan Path dengan App.jsx)
  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/admin/dashboard' // HARUS SAMA dengan App.jsx
    },
    { 
      name: 'Pengguna', 
      icon: <Users size={20} />, 
      path: '/admin/pengguna' 
    },
    { 
      name: 'Daftar Paket', 
      icon: <Package size={20} />, 
      path: '/admin/paket'     // HARUS SAMA dengan App.jsx
    },
    { 
      name: 'Absensi', 
      icon: <CalendarDays size={20} />, 
      path: '/admin/absensi' 
    },
    { 
      name: 'Pembayaran', 
      icon: <Wallet size={20} />, 
      path: '/admin/pembayaran' 
    },
  ];

  return (
    // CONTAINER UTAMA (Fixed Sidebar)
    <div className="fixed left-0 top-0 h-screen w-64 p-4 flex flex-col gap-6 z-50">
      
      {/* 1. LOGO / BRAND */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#67051a] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
          BP
        </div>
        <div>
          <h1 className="font-bold text-[#67051a] text-lg leading-tight">Admin Panel</h1>
          <p className="text-[10px] text-gray-500 font-medium tracking-wider">BIMBEL POSITIF</p>
        </div>
      </div>

      {/* 2. MENU NAVIGATION */}
      <div className="bg-[#67051a] rounded-2xl p-4 flex-1 shadow-xl flex flex-col justify-between overflow-y-auto">
        
        {/* LIST MENU UTAMA */}
        <nav className="flex flex-col gap-2 mt-2">
          {menuItems.map((item, index) => {
            // Cek apakah menu ini sedang aktif
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-white text-[#67051a] font-bold shadow-md transform scale-105' // Style AKTIF
                    : 'text-white/80 hover:bg-white/10 hover:text-white'                // Style TIDAK AKTIF
                  }
                `}
              >
                <div className={`${isActive ? 'text-[#67051a]' : 'text-white/80 group-hover:text-white'}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* TOMBOL LOGOUT (Di Bagian Bawah) */}
        <div className="pt-4 mt-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-100 hover:bg-red-900/50 hover:text-white rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default NavigasiAdmin;