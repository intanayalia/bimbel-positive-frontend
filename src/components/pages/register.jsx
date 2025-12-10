import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api'; // Import API config

export default function Register() {
    const navigate = useNavigate();

    // 1. STATE MANAGEMENT
    const [formData, setFormData] = useState({
        namaLengkap: '',  // Pengganti Username sebagai input nama
        email: '',
        nomorTelepon: '',
        password: '',
        confirmPassword: '' 
    });
    
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    // State untuk OTP (Simulasi Frontend)
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']); 
    
    const [loading, setLoading] = useState(false); 
    const [errorMsg, setErrorMsg] = useState('');

    // 2. HANDLER INPUT
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrorMsg('');
    };

    // 3. HANDLER SUBMIT
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (!termsAccepted) {
            alert("Harap setujui Syarat dan Ketentuan.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("Konfirmasi password tidak cocok!");
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            // Mengirim data ke Laravel
            // Key object ini harus sesuai dengan validasi di AuthController.php
            await api.post('/register', {
                namaLengkap: formData.namaLengkap,
                email: formData.email,
                nomorTelepon: formData.nomorTelepon,
                password: formData.password
            });
            
            setLoading(false);
            // Jika sukses, buka modal OTP (Simulasi verifikasi)
            setIsOtpModalOpen(true); 

        } catch (error) {
            setLoading(false);
            console.error("Register Error:", error);
            
            // Menangkap pesan error dari Laravel (Validation 422)
            if (error.response && error.response.data && error.response.data.errors) {
                // Ambil error pertama yang muncul
                const firstErrorKey = Object.keys(error.response.data.errors)[0];
                const firstErrorMessage = error.response.data.errors[firstErrorKey][0];
                setErrorMsg(firstErrorMessage);
            } else {
                setErrorMsg("Gagal mendaftar. Silakan coba lagi.");
            }
        }
    };

    // 4. HANDLER OTP (SIMULASI)
    const handleOtpChange = (e, index) => {
        const { value } = e.target;
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 3) {
            document.getElementById(`otp${index + 2}`).focus();
        } else if (value && index === 3) {
            document.getElementById('submitOtp').focus();
        }
    };

    const handleOtpVerification = async () => {
        const fullOtp = otp.join('');
        if (fullOtp.length !== 4) {
            alert('Harap isi semua 4 digit kode OTP.');
            return;
        }
        setLoading(true);
        
        // Simulasi verifikasi OTP sukses
        setTimeout(() => {
            setLoading(false);
            alert(`Registrasi Berhasil! Silakan Login.`);
            navigate('/login'); 
        }, 1500);
    };

    const otpInputs = otp.map((digit, index) => (
        <input
            key={index}
            id={`otp${index + 1}`}
            type="text"
            inputMode="numeric"
            maxLength="1"
            className="w-12 h-12 text-center text-xl border border-gray-300 rounded-xl focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/20 transition outline-none font-bold text-brand-dark"
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => {
                if (e.key === 'Backspace' && !digit && index > 0) {
                    document.getElementById(`otp${index}`).focus();
                }
            }}
            required
            disabled={loading}
        />
    ));

    return (
        <div className="font-sans bg-white h-screen w-full overflow-hidden flex items-center justify-center">
            
            <div className="flex h-full w-full relative">
                
                {/* Switcher Login/Register */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white p-1.5 rounded-full shadow-xl flex space-x-1 border border-gray-100">
                    <Link to="/login" className="px-6 py-2 rounded-full text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors">
                        Masuk
                    </Link>
                    <span className="px-6 py-2 rounded-full text-sm font-bold bg-brand-dark text-white shadow-md cursor-default">
                        Daftar
                    </span>
                </div>

                {/* Bagian Kiri (Gambar) */}
                <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-brand-dark">
                    <img 
                        src="/assets/loginregister.jpeg" 
                        alt="Ilustrasi Semangat Belajar" 
                        className="absolute inset-0 w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent"></div>
                    <div className="absolute bottom-16 left-12 right-12 text-white">
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl">
                            <p className="text-xl font-medium italic mb-6 leading-relaxed">
                                "Pendidikan bukan persiapan untuk hidup. Pendidikan adalah hidup itu sendiri."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-dark font-bold">BP</div>
                                <div>
                                    <p className="font-bold uppercase tracking-widest text-sm">John Dewey</p>
                                    <p className="text-xs opacity-75">Filsuf Pendidikan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bagian Kanan (Form) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 z-10 bg-white h-full overflow-y-auto">
                    
                    <div className="w-full max-w-md mt-16 lg:mt-0"> 
                        
                        <Link to="/" className="flex justify-center mb-8">
                            <div className="w-16 h-16 bg-brand-light-bg rounded-full p-2 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                        </Link>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-brand-dark mb-2">Buat Akun Baru</h2>
                            <p className="text-sm text-gray-500">Bergabunglah dengan komunitas pembelajar terbaik.</p>
                        </div>

                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-200 text-center animate-pulse">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleRegisterSubmit} className="space-y-5">
                            
                            {/* INPUT 1: NAMA LENGKAP (Pengganti Username) */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="namaLengkap"
                                    className="block w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-dark/50 focus:border-brand-dark outline-none transition-all placeholder-gray-400"
                                    value={formData.namaLengkap}
                                    onChange={handleFormChange}
                                    placeholder="Nama Lengkap"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* INPUT 2: EMAIL */}
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
                                    className="block w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-dark/50 focus:border-brand-dark outline-none transition-all placeholder-gray-400"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    placeholder="Alamat Email"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* INPUT 3: NOMOR TELEPON */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                </div>
                                <input
                                    type="tel"
                                    name="nomorTelepon"
                                    className="block w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-dark/50 focus:border-brand-dark outline-none transition-all placeholder-gray-400"
                                    value={formData.nomorTelepon}
                                    onChange={handleFormChange}
                                    placeholder="Nomor WhatsApp (Cth: 08123...)"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* INPUT 4 & 5: PASSWORD */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        className="block w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-dark/50 focus:border-brand-dark outline-none transition-all placeholder-gray-400"
                                        value={formData.password}
                                        onChange={handleFormChange}
                                        placeholder="Password"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="block w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-dark/50 focus:border-brand-dark outline-none transition-all placeholder-gray-400"
                                        value={formData.confirmPassword}
                                        onChange={handleFormChange}
                                        placeholder="Ulangi Password"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* CHECKBOX TERMS */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="w-4 h-4 text-brand-dark border-gray-300 rounded focus:ring-brand-dark cursor-pointer accent-brand-dark"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="ml-3 text-xs leading-normal text-gray-500">
                                    <label htmlFor="terms" className="cursor-pointer select-none">
                                        Saya menyetujui <span className="font-bold text-brand-dark hover:underline">Syarat & Ketentuan</span> serta <span className="font-bold text-brand-dark hover:underline">Kebijakan Privasi</span>.
                                    </label>
                                </div>
                            </div>

                            {/* TOMBOL SUBMIT */}
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
                                ) : "Daftar Sekarang"}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-gray-600">
                            Sudah punya akun? 
                            <Link to="/login" className="font-bold text-brand-dark hover:underline ml-1">
                                Masuk di sini
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

            {/* MODAL OTP (SIMULASI) */}
            {isOtpModalOpen && (
                <div id="otpModal" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm relative animate-fade-in-up border border-gray-100">
                        <button
                            onClick={() => setIsOtpModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-brand-light-bg rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark">Verifikasi Email</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Kode OTP telah dikirim ke <br/><strong>{formData.email}</strong>
                            </p>
                        </div>

                        <div className="flex justify-center space-x-3 mb-8">
                            {otpInputs} 
                        </div>
                        
                        <button
                            id="submitOtp"
                            onClick={handleOtpVerification}
                            disabled={loading}
                            className={`w-full bg-brand-dark text-white py-3 rounded-xl font-bold hover:bg-brand-dark-accent transition-all shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
                        </button>
                        
                        <p className="text-center text-xs text-gray-500 mt-6">
                            Belum menerima kode? <button className="text-brand-dark font-bold hover:underline" disabled={loading}>Kirim Ulang</button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}