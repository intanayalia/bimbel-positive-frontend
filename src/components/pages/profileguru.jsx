import React, { useState, useEffect, useRef } from 'react';
import { Camera, Save, User, Mail, Phone, Lock } from 'lucide-react';
import NavigasiGuru from '../common/navigasiguru';
import api from '../../api';

export default function ProfileGuru() {
    // 1. STATE
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: null,      // File fisik
        avatarUrl: ''      // URL Preview
    });

    const fileInputRef = useRef(null);

    // 2. FETCH DATA USER
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/user');
                const user = response.data;

                // Logic URL Avatar
                let avatarDisplay = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                if (user.avatar) {
                    avatarDisplay = user.avatar.startsWith('http') 
                        ? user.avatar 
                        : `http://127.0.0.1:8000/storage/${user.avatar}`;
                }

                setFormData({
                    name: user.name,
                    email: user.email,
                    phone: user.phone || '',
                    avatarUrl: avatarDisplay,
                    avatar: null
                });
                setLoading(false);
            } catch (error) {
                console.error("Gagal load profile:", error);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // 3. HANDLER UPDATE
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('email', formData.email);
        dataToSend.append('phone', formData.phone);
        
        // Hanya kirim avatar jika user mengupload baru
        if (formData.avatar) {
            dataToSend.append('avatar', formData.avatar);
        }

        try {
            const response = await api.post('/profile/update', dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update LocalStorage agar nama di navbar berubah
            const updatedUser = response.data.user;
            localStorage.setItem('user_info', JSON.stringify(updatedUser));

            setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Gagal memperbarui profil.' });
        } finally {
            setSaving(false);
        }
    };

    // Handler Ganti Foto
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                avatar: file,
                avatarUrl: URL.createObjectURL(file) // Preview lokal
            });
        }
    };

    if (loading) return <div className="text-center py-20">Memuat profil...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
            <NavigasiGuru />

            <main className="pt-28 px-4 max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-red-900">Profil Pengajar</h1>
                    <p className="text-gray-500">Kelola informasi akun dan preferensi Anda.</p>
                </div>

                {/* Notifikasi */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl text-center font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSave} className="p-8">
                        
                        {/* FOTO PROFIL */}
                        <div className="flex flex-col items-center mb-10">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                                    <img 
                                        src={formData.avatarUrl} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-0 right-0 bg-red-900 text-white p-2.5 rounded-full shadow-lg hover:bg-red-800 transition-transform hover:scale-110"
                                    title="Ganti Foto"
                                >
                                    <Camera size={18} />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-3">Klik ikon kamera untuk mengganti foto.</p>
                        </div>

                        {/* FORM INPUTS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Nama */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <User size={16}/> Nama Lengkap
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-900 focus:outline-none transition-all"
                                />
                            </div>

                            {/* Email (Read Only disarankan agar tidak error validasi unique) */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Mail size={16}/> Email
                                </label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                    readOnly
                                    title="Email tidak dapat diubah sembarangan."
                                />
                            </div>

                            {/* Telepon */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Phone size={16}/> Nomor Telepon
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-900 focus:outline-none transition-all"
                                />
                            </div>

                            {/* Password (Placeholder) */}
                            <div className="space-y-2 opacity-50">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Lock size={16}/> Password
                                </label>
                                <input 
                                    type="password" 
                                    value="********"
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* TOMBOL SAVE */}
                        <div className="mt-10 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-red-900 text-white font-bold rounded-xl hover:bg-red-800 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    "Menyimpan..." 
                                ) : (
                                    <>
                                        <Save size={18} /> Simpan Perubahan
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}