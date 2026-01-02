import React, { useState, useEffect } from 'react';
import NavigasiAdmin from '../common/navigasiadmin'; 
import api from '../../api'; 
import { Users, BookOpen, Calendar, TrendingUp, Loader2, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('Admin');

  // State Statistik (Card Atas)
  const [stats, setStats] = useState({
    totalPengajar: 0,
    totalSiswa: 0,
    totalPaket: 0,
    absenHariIni: 0
  });
  
  // State Data Tabel (Bawah)
  const [newestTeachers, setNewestTeachers] = useState([]);
  const [newestStudents, setNewestStudents] = useState([]);

  // ==========================================
  // 2. FETCH DATA DARI API
  // ==========================================
  useEffect(() => {
    fetchDashboardData();
    
    // Ambil nama admin dari localStorage (jika ada)
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    if (userInfo && userInfo.name) {
        setUserName(userInfo.name);
    }
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Panggil Endpoint: /admin/stats
      const response = await api.get('/admin/stats');
      const { stats, newest_teachers, newest_students } = response.data;

      // Masukkan data backend ke state frontend
      setStats({
        totalPengajar: stats.total_teachers,
        totalSiswa: stats.total_students,
        totalPaket: stats.total_packages,
        absenHariIni: stats.attendance_today
      });

      setNewestTeachers(newest_teachers);
      setNewestStudents(newest_students);

    } catch (error) {
      console.error("Gagal memuat dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FD] font-sans overflow-hidden">
      
      {/* Sidebar Navigasi */}
      <NavigasiAdmin />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col h-screen relative ml-64 overflow-y-auto">
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-[#67051a]">Dashboard Overview</h1>
            <p className="text-sm text-gray-500">Selamat datang kembali, {userName}!</p>
          </div>
          <div className="w-10 h-10 bg-[#67051a] rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {userName.charAt(0)}
          </div>
        </header>

        {/* Isi Dashboard */}
        <div className="p-8">
          
          {isLoading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-[#67051a] mb-4" size={40} />
              <p className="text-gray-500">Sedang memuat statistik...</p>
            </div>
          ) : (
            <>
              {/* 1. KARTU STATISTIK (4 Kotak Atas) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                  title="Total Pengajar" 
                  value={stats.totalPengajar} 
                  icon={<Users size={24} />} 
                  color="bg-blue-500"
                />
                <StatCard 
                  title="Total Siswa" 
                  value={stats.totalSiswa} 
                  icon={<User size={24} />} 
                  color="bg-emerald-500"
                />
                <StatCard 
                  title="Paket Aktif" 
                  value={stats.totalPaket} 
                  icon={<BookOpen size={24} />} 
                  color="bg-purple-500"
                />
                <StatCard 
                  title="Absensi Hari Ini" 
                  value={stats.absenHariIni} 
                  icon={<Calendar size={24} />} 
                  color="bg-orange-500"
                />
              </div>

              {/* 2. TABEL AKTIVITAS TERBARU (2 Kolom Bawah) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tabel Guru Terbaru */}
                <ActivityTable 
                    title="Pengajar Terbaru" 
                    data={newestTeachers} 
                    type="guru"
                    linkTo="/admin/pengguna"
                />

                {/* Tabel Siswa Terbaru */}
                <ActivityTable 
                    title="Siswa Terbaru" 
                    data={newestStudents} 
                    type="siswa"
                    linkTo="/admin/pengguna"
                />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENTS (Agar kode rapi)
// ==========================================

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between h-32">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">{title}</h3>
        <p className="text-3xl font-extrabold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-xl text-white shadow-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const ActivityTable = ({ title, data, type, linkTo }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
      <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
        {type === 'guru' ? <Users size={18} className="text-blue-500"/> : <User size={18} className="text-emerald-500"/>}
        {title}
      </h3>
      <a href={linkTo} className="text-xs font-bold text-[#67051a] flex items-center gap-1 hover:underline">
        Lihat Semua <ArrowRight size={12}/>
      </a>
    </div>
    <div className="p-0">
        <table className="w-full">
            <tbody className="text-sm">
                {data.length > 0 ? (
                    data.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                            <td className="py-4 px-6 font-medium text-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${type === 'guru' ? 'bg-blue-400' : 'bg-emerald-400'}`}>
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-400">{item.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-6 text-right text-gray-400 text-xs">
                                {new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="2" className="py-8 text-center text-gray-400 text-sm">
                            Belum ada data terbaru.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
  </div>
);

export default DashboardAdmin;