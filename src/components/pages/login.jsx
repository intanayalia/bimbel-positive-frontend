import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api'; // Pastikan path ini sesuai dengan letak file api.js Anda

export default function Login() {
    const navigate = useNavigate();

    // 1. STATE MANAGEMENT
    const [loginData, setLoginData] = useState({
        email: '',    
        password: ''
    });
    
    const [loading, setLoading] = useState(false); 
    const [errorMsg, setErrorMsg] = useState(''); 

    // 2. HANDLER INPUT
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        setErrorMsg('');
    };

    // 3. HANDLER SUBMIT (LOGIKA UTAMA)
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            // A. Kirim data ke Backend Laravel
            const response = await api.post('/login', {
                email: loginData.email, 
                password: loginData.password
            });

            // B. Ambil token dan data user dari response
            const { access_token, user } = response.data;

            // C. Simpan Token & Info User ke Local Storage
            // Ini PENTING agar Navbar bisa menampilkan nama asli user & token tersimpan
            localStorage.setItem('auth_token', access_token);
            localStorage.setItem('user_info', JSON.stringify(user)); 

            // D. Logika Redirect Berdasarkan Role (INI YANG DIPERBAIKI)
            // Pastikan string role ('admin', 'guru', 'student') sama persis dengan di Database
            if (user.role === 'admin') {
                navigate('/admin/dashboard'); 
            } else if (user.role === 'guru') {
                navigate('/dashboard-guru');
            } else if (user.role === 'student') {
                navigate('/dashboard');
            } else {
                // Fallback jika role tidak dikenali
                navigate('/dashboard-siswa');
            }

        } catch (error) {
            console.error("Login Error:", error);
            setLoading(false);

            // Menampilkan pesan error yang sesuai
            if (error.response && error.response.status === 401) {
                setErrorMsg("Email atau password salah.");
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrorMsg(error.response.data.message);
            } else {
                setErrorMsg("Terjadi kesalahan koneksi. Silakan coba lagi.");
            }
        }
    };

    return (
        <div className="font-sans bg-white h-screen w-full overflow-hidden flex items-center justify-center">
            
            <div className="flex h-full w-full relative">
                
                {/* Switcher Login/Register (Pojok Atas) */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white p-1.5 rounded-full shadow-xl flex space-x-1 border border-gray-100">
                    <span className="px-6 py-2 rounded-full text-sm font-bold bg-brand-dark text-white shadow-md cursor-default">
                        Masuk
                    </span>
                    <Link to="/register" className="px-6 py-2 rounded-full text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors">
                        Daftar
                    </Link>
                </div>

                {/* BAGIAN KIRI (GAMBAR) */}
                <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-brand-dark">
                    <img 
                        src="/assets/loginregister.jpeg" 
                        alt="Suasana Belajar Bimbel Positif" 
                        className="absolute inset-0 w-full h-full object-cover opacity-90" 
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent"></div>
                    <div className="absolute bottom-16 left-12 right-12 text-white">
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl">
                            <p className="text-xl font-medium italic mb-6 leading-relaxed">
                                "Investasi terbaik adalah investasi leher ke atas. Belajar hari ini untuk memimpin masa depan."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-dark font-bold">BP</div>
                                <div>
                                    <p className="font-bold uppercase tracking-widest text-sm">Bimbel Positif Team</p>
                                    <p className="text-xs opacity-75">Motivasi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BAGIAN KANAN (FORM) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 z-10 bg-white h-full overflow-y-auto">
                    
                    <div className="w-full max-w-md mt-16 lg:mt-0">
                        
                        {/* Logo */}
                        <Link to="/" className="flex justify-center mb-8">
                            <div className="w-16 h-16 bg-brand-light-bg rounded-full p-2 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                        </Link>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-brand-dark mb-2">Selamat Datang Kembali!</h2>
                            <p className="text-sm text-gray-500">Silakan masuk untuk melanjutkan pembelajaran.</p>
                        </div>

                        {/* Error Message Alert */}
                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-200 text-center animate-pulse">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            
                            {/* Input Email */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        className="block w-full pl-11 pr-4 py-3.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-dark/50 focus:border-brand-dark outline-none transition-all placeholder-gray-400"
                                        value={loginData.email}
                                        onChange={handleChange}
                                        placeholder="contoh@email.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Input Password */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Password</label>
                                    <Link to="/forgot-password" className="text-xs font-semibold text-brand-dark hover:underline">
                                        Lupa Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        className="block w-full pl-11 pr-4 py-3.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-dark/50 focus:border-brand-dark outline-none transition-all placeholder-gray-400"
                                        value={loginData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Tombol Login */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-brand-dark text-white py-3.5 rounded-xl font-bold text-base hover:bg-brand-dark-accent transition-all transform hover:-translate-y-1 shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Memproses...
                                    </span>
                                ) : "Masuk Sekarang"}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-gray-600">
                            Belum punya akun? 
                            <Link to="/register" className="font-bold text-brand-dark hover:underline ml-1">
                                Daftar Gratis
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}