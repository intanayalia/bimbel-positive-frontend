import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import NavigasiSiswa from '../common/navigasisiswa';
import api from '../../api'; // Import konfigurasi API

const ProfileSiswa = () => {
  // =========================================
  // 1. STATE MANAGEMENT
  // =========================================
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); 
  const [message, setMessage] = useState(''); // Untuk notifikasi sukses/gagal
  
  // State Data User (Username sudah DIHAPUS)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null,      // File fisik (Binary)
    avatarUrl: ''      // URL Preview
  });

  const fileInputRef = useRef(null);

  // =========================================
  // 2. FETCH DATA PROFILE (REAL API)
  // =========================================
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user');
      const user = response.data;

      // Logic Penentuan URL Avatar
      let avatarDisplay = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=random";
      
      if (user.avatar) {
         avatarDisplay = user.avatar.startsWith('http') 
            ? user.avatar 
            : `http://localhost:8000/storage/${user.avatar}`;
      }

      setFormData({
        name: user.name || '',
        // Username tidak diambil lagi
        email: user.email || '',
        phone: user.phone || '',
        avatar: null, 
        avatarUrl: avatarDisplay
      });
      setLoading(false);
    } catch (error) {
      console.error("Gagal load profile", error);
      setMessage("Gagal memuat data profil. Cek koneksi Anda.");
      setLoading(false);
    }
  };

  // =========================================
  // 3. HANDLERS
  // =========================================
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 2MB.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({ 
        ...prev, 
        avatar: file,        
        avatarUrl: objectUrl 
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
        const dataToSend = new FormData();
        
        // Append data teks
        dataToSend.append('name', formData.name);
        dataToSend.append('email', formData.email);
        
        // Append phone hanya jika ada isinya
        if (formData.phone) dataToSend.append('phone', formData.phone);
        
        // Username tidak dikirim lagi

        // Append avatar hanya jika user memilih file baru
        if (formData.avatar && formData.avatar instanceof File) {
            dataToSend.append('avatar', formData.avatar);
        }

        // Kirim Request ke Backend
        await api.post('/profile/update', dataToSend);

        setMessage('Profil berhasil diperbarui!');
        setIsEditing(false);
        setLoading(false);

        // Reload halaman otomatis agar Foto Profil di Navbar ikut terupdate
        setTimeout(() => window.location.reload(), 1500); 

    } catch (error) {
        setLoading(false);
        console.error("Update error:", error);

        if (error.response && error.response.status === 422) {
            const errors = error.response.data.errors;
            if (errors) {
                const firstField = Object.keys(errors)[0];
                const firstErrorMessage = errors[firstField][0];
                setMessage(`Gagal: ${firstErrorMessage}`);
            } else {
                setMessage('Data tidak valid. Mohon periksa inputan Anda.');
            }
        } else {
            setMessage('Gagal memperbarui profil. Terjadi kesalahan pada server.');
        }
    }
  };

  if (loading && !formData.name) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Memuat Data Profil...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-800">
      <NavigasiSiswa />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-24">
    
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Profil</h1>

        {/* Notifikasi */}
        {message && (
            <div className={`p-4 mb-4 rounded-lg text-sm font-bold border ${message.includes('Gagal') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                {message}
            </div>
        )}

        {/* Header Profil (Foto & Info Singkat) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className={`relative group ${isEditing ? 'cursor-pointer' : ''}`} onClick={handleImageClick}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md relative bg-gray-100">
                <img 
                  src={formData.avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                 {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24} />
                    </div>
                 )}
              </div>
              
              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-brand-dark p-1.5 rounded-full text-white shadow-sm border-2 border-white">
                  <Camera size={14} />
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={!isEditing}
              />
            </div>

            <div className="text-center md:text-left space-y-1">
              <h2 className="text-xl font-bold text-gray-800">{formData.name}</h2>
              <p className="text-sm text-gray-500 font-medium">{formData.phone || '-'}</p>
              <p className="text-sm text-gray-400">{formData.email}</p>
              {isEditing && <p className="text-xs text-blue-600 animate-pulse mt-1">Klik foto untuk mengganti avatar.</p>}
            </div>
          </div>

          <div>
            {!isEditing && (
              <button 
                onClick={handleEditClick}
                className="px-6 py-2 rounded-md border border-[#74151e] text-[#74151e] font-semibold text-sm hover:bg-red-50 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Form Input Detail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Informasi Pribadi</h3>

          <div className="space-y-6">
            
            {/* INPUT NAMA LENGKAP */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 ml-1">Nama Lengkap</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border ${isEditing ? 'border-gray-400 bg-white' : 'border-gray-200 bg-gray-50 text-gray-500'} focus:outline-none focus:border-[#74151e] transition-colors`}
                />
              </div>
            </div>

            {/* INPUT USERNAME SUDAH DIHAPUS */}

            {/* INPUT EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing} 
                  className={`w-full px-4 py-3 rounded-lg border bg-gray-100 text-gray-400 cursor-not-allowed`}
                />
                {isEditing && <p className="text-[10px] text-gray-400 mt-1 ml-1">*Email tidak dapat diubah.</p>}
              </div>
            </div>

            {/* INPUT NO TELEPON */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 ml-1">Nomor Telepon</label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border ${isEditing ? 'border-gray-400 bg-white' : 'border-gray-200 bg-gray-50 text-gray-500'} focus:outline-none focus:border-[#74151e] transition-colors`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        {isEditing && (
          <div className="flex justify-end gap-3">
             <button 
              onClick={() => { setIsEditing(false); fetchProfile(); setMessage(''); }} 
              disabled={loading}
              className="px-6 py-3 rounded-md border border-gray-300 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-3 rounded-md bg-[#74151e] text-white font-bold text-sm hover:bg-[#5a1017] transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileSiswa;