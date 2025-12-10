import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const navigate = useNavigate();

    // 1. STATE MANAGEMENT
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); 
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // 2. HANDLER INPUT
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setMessage(''); // Clear message on new input
        setErrorMsg(''); // Clear error on new input
    };

    // 3. HANDLER SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrorMsg("Alamat email tidak boleh kosong.");
            return;
        }

        setLoading(true);

        // --- SIMULASI BACKEND: Mengirim tautan reset password ---
        setTimeout(() => {
            setLoading(false);
            // Asumsi proses pengiriman email sukses
            setMessage(`Tautan reset kata sandi telah dikirim ke ${email}. Cek kotak masuk Anda (dan folder spam).`);
            console.log(`Email reset password dikirim ke: ${email}`);
            
            // Opsional: Setelah beberapa detik, alihkan kembali ke halaman login
            // setTimeout(() => navigate('/login'), 5000);

        }, 2000);

        /* KODE REAL BACKEND (Contoh)
        try {
            // Asumsi ada endpoint untuk meminta reset password
            const response = await api.post('/auth/forgot-password', { email });
            setLoading(false);
            setMessage(response.data.message || "Tautan reset kata sandi telah dikirim. Cek email Anda.");
        } catch (error) {
            setLoading(false);
            setErrorMsg(error.response?.data?.message || "Gagal mengirim permintaan reset. Pastikan email Anda terdaftar.");
        }
        */
    };

    return (
        <div className="font-sans bg-white h-screen w-full overflow-hidden flex items-center justify-center">
            
            <div className="flex h-full w-full relative">
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white p-1.5 rounded-full shadow-xl flex space-x-1 border border-gray-100">
                    <Link to="/login" className="px-6 py-2 rounded-full text-sm font-bold bg-brand-dark text-white shadow-md transition-colors">
                        Masuk
                    </Link>
                    <Link to="/register" className="px-6 py-2 rounded-full text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors">
                        Daftar
                    </Link>
                </div>
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 z-10 bg-white h-full overflow-y-auto">
                    <div className="w-full max-w-md mt-16 lg:mt-0"> 
                        <Link to="/" className="flex justify-center mb-8">
                            <div className="w-16 h-16 bg-brand-light-bg rounded-full p-2 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                        </Link>
                        <div className="text-left mb-8">
                            <h2 className="text-3xl font-extrabold text-brand-dark mb-2">Lupa Kata Sandi?</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Masukkan email terdaftar Anda. Tautan reset kata sandi akan dikirim ke email Anda.
                            </p>
                        </div>
                        {(message || errorMsg) && (
                            <div className={`px-4 py-3 rounded-xl text-sm mb-6 border ${message ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'} text-center animate-fade-in`}>
                                {message || errorMsg}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="block w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-dark/50 focus:border-brand-dark outline-none transition-all placeholder-gray-400"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="Masukkan Email Anda"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || message}
                                className={`w-full bg-brand-primary text-white py-3.5 rounded-xl font-bold text-base transition-all transform hover:-translate-y-0.5 shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-dark-accent bg-brand-dark'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Mengirim Tautan...
                                    </span>
                                ) : "Kirim Email Reset"}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-gray-600">
                            Atau, kembali ke halaman 
                            <Link to="/login" className="font-bold text-brand-dark hover:underline ml-1">
                                Masuk
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-brand-dark">
                    <img 
                        src="/assets/loginregister.jpeg"
                        alt="Ilustrasi Kantor Modern" 
                        className="absolute inset-0 w-full h-full object-cover opacity-90" 
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent"></div>

                    <div className="absolute bottom-16 left-12 right-12 text-white">
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl">
                            <p className="text-xl font-medium italic mb-6 leading-relaxed">
                                "Langkah pertama menuju pemecahan masalah adalah mengakui bahwa Anda punya masalah. Mari kita perbaiki sandi Anda."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-dark font-bold">BP</div>
                                <div>
                                    <p className="font-bold uppercase tracking-widest text-sm">Tim Bimbel Positif</p>
                                    <p className="text-xs opacity-75">Dukungan Teknis</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}