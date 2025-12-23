import React, { useState, useEffect } from 'react';
import NavigasiAdmin from '../common/navigasiadmin'; 
import api from '../../api'; 
import { Search, Bell, ChevronDown, ChevronRight, Users, BookOpen, Calendar, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  // STATE MANAGEMENT
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('Admin');

  // State Data Statistik
  const [stats, setStats] = useState({
    totalPengajar: 0,
    totalSiswa: 0,
    totalPaket: 0,
    absenHariIni: "0"
  });
  
  const [newestTeachers, setNewestTeachers] = useState([]);
  const [newestStudents, setNewestStudents] = useState([]);

  useEffect(() => {
    console.log("--- MEMULAI FETCH DATA DASHBOARD ---"); // CEK CONSOLE
    fetchDashboardData();
    
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    if (userInfo && userInfo.name) {
        setUserName(userInfo.name);
    }
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // DEBUG: Cek apakah token ada
      const token = localStorage.getItem('auth_token');
      console.log("Token saat ini:", token ? "ADA" : "TIDAK ADA");

      // 1. Ambil Statistik
      console.log("Mengambil stats...");
      const statsRes = await api.get('/admin/stats');
      console.log("Respon Stats:", statsRes.data); // LIHAT ISI DATA DI SINI

      // 2. Ambil User
      const teachersRes = await api.get('/admin/users?role=guru');
      const studentsRes = await api.get('/admin/users?role=student');

      setStats({
        totalPengajar: statsRes.data.total_teachers || 0,
        totalSiswa: statsRes.data.total_students || 0,
        totalPaket: statsRes.data.total_packages || 0,
        absenHariIni: "0"
      });

      setNewestTeachers(teachersRes.data.slice(0, 5));
      setNewestStudents(studentsRes.data.slice(0, 5));

    } catch (error) {
      console.error("ERROR DASHBOARD:", error); // LIHAT ERROR DI SINI
      if (error.response) {
          console.log("Status Error:", error.response.status);
          console.log("Pesan Error:", error.response.data);
          
          if (error.response.status === 401) {
              alert("Sesi habis, silakan login ulang.");
              navigate('/login');
          }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
      localStorage.clear();
      navigate('/login');
  };

  return (
    <div className="flex bg-[#F5F7FA] min-h-screen font-sans text-gray-800">
      <NavigasiAdmin />

      <div className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            {/* SAYA UBAH JUDUL INI AGAR KELIHATAN BEDANYA */}
            <h1 className="text-3xl font-bold text-gray-900">Dashboard (Realtime DB)</h1>
            <p className="text-gray-500 mt-1 text-sm">Selamat Datang, <span className="font-bold text-[#67051a]">{userName}</span></p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white rounded-full shadow-sm border border-gray-100"
              >
                <div className="w-9 h-9 bg-[#67051a] rounded-full flex items-center justify-center text-white font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-1 z-50">
                   <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                     <LogOut size={16} /> Keluar
                   </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {isLoading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-[#67051a] mb-4" size={50} />
                <p>Memuat data...</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Pengajar" value={stats.totalPengajar} icon={<Users size={24} />} color="bg-blue-500" />
                    <StatCard title="Total Siswa" value={stats.totalSiswa} icon={<Users size={24} />} color="bg-green-500" />
                    <StatCard title="Paket Aktif" value={stats.totalPaket} icon={<BookOpen size={24} />} color="bg-orange-500" />
                    <StatCard title="Absensi" value={stats.absenHariIni} icon={<Calendar size={24} />} color="bg-[#67051a]" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ActivityTable title="Pengajar Terbaru" data={newestTeachers} type="guru" linkTo="/admin/pengguna" />
                    <ActivityTable title="Siswa Terbaru" data={newestStudents} type="siswa" linkTo="/admin/pengguna" />
                </div>
            </>
        )}
      </div>
    </div>
  );
};

// Sub-components sederhana
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl text-white shadow-lg ${color}`}>{icon}</div>
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

const ActivityTable = ({ title, data, type, linkTo }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
      <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
      <a href={linkTo} className="text-xs font-bold text-[#67051a]">Lihat Semua</a>
    </div>
    <div className="p-2">
        <table className="w-full">
            <tbody className="text-sm">
                {data.length > 0 ? (
                    data.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{item.name}</td>
                            <td className="py-3 px-4 text-right text-gray-500">{item.email}</td>
                        </tr>
                    ))
                ) : (
                    <tr><td className="py-8 text-center text-gray-400">Belum ada data.</td></tr>
                )}
            </tbody>
        </table>
    </div>
  </div>
);

export default DashboardAdmin;