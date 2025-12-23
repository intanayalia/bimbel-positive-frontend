import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api'; // <-- 1. Import API

export default function NavigasiSiswa() {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // 2. State untuk menyimpan data user
    const [user, setUser] = useState({
        name: "Memuat...", // Teks sementara loading
        avatar: null
    });

    // 3. Ambil data user saat komponen dimuat
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/user');
                setUser(response.data);
            } catch (error) {
                console.error("Gagal mengambil data user:", error);
                // Jika token expired/invalid, opsional: paksa logout
                if (error.response && error.response.status === 401) {
                    handleLogout();
                }
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/logout'); // Logout di server Laravel
        } catch (error) {
            console.log("Logout error (abaikan jika token sudah expired)");
        }
        
        localStorage.removeItem('auth_token'); // Hapus token di browser
        localStorage.removeItem('user_info');  // Hapus info user
        navigate('/login');
    };

    // Helper untuk Avatar (Gunakan default jika null)
    // Ingat: Di database kita simpan string path, tapi di frontend kita butuh URL lengkap atau placeholder
    const getAvatarUrl = () => {
        if (user.avatar) {
            // Jika avatar berupa URL lengkap (misal dari Google login nanti)
            if (user.avatar.startsWith('http')) return user.avatar;
            // Jika path lokal dari Laravel (storage link)
            return `http://localhost:8000/storage/${user.avatar}`; 
        }
        // Default avatar jika kosong
        return "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || 'User') + "&background=random";
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-brand-dark shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="flex-shrink-0">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-sm"> 
                            <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </Link>
                    <nav className="hidden md:flex space-x-6 text-sm font-bold text-white/90">
                        <Link to="/dashboard" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-white pb-0.5">
                            Dashboard
                        </Link>
                        <Link to="/tryout" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-white pb-0.5">
                            Tryout
                        </Link>
                        <Link to="/rekap" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-white pb-0.5">
                            Rekap
                        </Link>
                        <Link to="/historypembayaran" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-white pb-0.5">
                            Pembayaran
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <button className="relative text-white/80 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-brand-dark"></span>
                    </button>
                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 focus:outline-none"
                        >
                            <span className="text-sm font-bold text-white hidden lg:block max-w-[150px] truncate">
                                {user.name}
                            </span>
                            <img 
                                src={getAvatarUrl()} 
                                alt="Avatar" 
                                className="w-9 h-9 rounded-full border-2 border-white object-cover bg-white" 
                            />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2 animate-fade-in-up text-gray-800 border border-gray-100 z-50">
                                <Link to="/profilesiswa" className="block px-4 py-2 text-sm hover:bg-gray-50">Informasi Profil</Link>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold">Keluar</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}