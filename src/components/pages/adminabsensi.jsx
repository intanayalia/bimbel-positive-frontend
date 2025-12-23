import React, { useState, useEffect } from 'react';
import api from '../../api'; // Integrasi API di sini
import NavigasiAdmin from '../common/navigasiadmin';
import { Search, Bell, ChevronDown, MoreVertical, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const AdminAbsensi = () => {
  // --- STATE MANAGEMENT ---
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [activeClasses, setActiveClasses] = useState([]);
  const [teacherPresence, setTeacherPresence] = useState([]);
  const [studentPresence, setStudentPresence] = useState([]);
  const [stats, setStats] = useState({ teachers: '0/0', students: '0/0' });

  // --- API INTEGRATION ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // MENGGUNAKAN API.GET (Sesuai Backend Laravel)
      const [resClasses, resTeachers, resStudents] = await Promise.all([
        api.get('/admin/absensi/classes'),
        api.get('/admin/absensi/teachers'),
        api.get('/admin/absensi/students')
      ]);

      const dataClasses = resClasses.data;
      const dataTeachers = resTeachers.data;
      const dataStudents = resStudents.data;

      setActiveClasses(dataClasses);
      setTeacherPresence(dataTeachers);
      setStudentPresence(dataStudents);

      // Hitung Statistik
      const teacherPresent = dataTeachers.filter(t => t.status === 'Hadir').length;
      const studentPresent = dataStudents.filter(s => s.status === 'Hadir').length;

      setStats({
        teachers: `${teacherPresent}/${dataTeachers.length}`,
        students: `${studentPresent}/${dataStudents.length}`
      });

    } catch (error) {
      console.error("Gagal mengambil data absensi:", error);
      // Fallback agar UI tidak error
      setActiveClasses([]);
      setTeacherPresence([]);
      setStudentPresence([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <NavigasiAdmin />
      
      <div className="flex-1 ml-64 p-8">
        
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-40 mb-8 bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-700">Absensi & Kehadiran</h1>
                <p className="text-xs text-gray-400 mt-1">Pantau kehadiran guru dan siswa secara realtime</p>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Cari data..." className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#67051a] w-64 transition-all"/>
                </div>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><Bell size={20} className="text-gray-600" /></button>
                
                <div className="relative">
                    <div className="flex items-center gap-3 border-l pl-6 border-gray-200 cursor-pointer select-none" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                        <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold text-gray-800">Nama Admin</p>
                            <p className="text-xs text-gray-500">Admin Utama</p>
                        </div>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>
        </header>

        {isLoading ? (
             <div className="flex justify-center items-center h-[60vh] text-[#67051a]"><Loader2 className="animate-spin" size={40} /></div>
        ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* --- SECTION 1: STATS & ACTIVE CLASSES --- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Stats Card: Guru */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Kehadiran Guru</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.teachers}</h3>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Hari Ini</span>
                        <p className="text-[10px] text-gray-400">Total Guru Terdaftar</p>
                    </div>
                </div>

                {/* Stats Card: Siswa */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Kehadiran Siswa</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.students}</h3>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Hari Ini</span>
                        <p className="text-[10px] text-gray-400">Total Siswa Terdaftar</p>
                    </div>
                </div>

                {/* Active Classes List (Span 2 Cols) */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-gray-800">Kelas Sedang Berlangsung</h3>
                         <button className="text-xs text-[#67051a] font-semibold hover:underline">Lihat Semua</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activeClasses.length > 0 ? (
                            activeClasses.map((item, idx) => <ClassCard key={idx} data={item} />)
                        ) : (
                            <p className="text-xs text-gray-400 col-span-2 text-center py-4">Tidak ada kelas aktif saat ini.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: ATTENDANCE TABLES (TABS) --- */}
            <AttendanceSection teachers={teacherPresence} students={studentPresence} />

        </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENT: CLASS CARD (Merah Abstrak - Original) ---
const ClassCard = ({ data }) => (
  <div className="border border-gray-100 rounded-xl p-3 flex gap-4 hover:shadow-md transition-shadow items-center bg-white relative group">
    {/* Abstrak Background Merah */}
    <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-red-900 via-[#67051a] to-red-600 shrink-0 relative overflow-hidden shadow-sm">
         <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white opacity-10 rounded-full blur-xl"></div>
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
    </div>

    <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-gray-800 text-xs mb-1 truncate pr-2">{data.name}</h4>
            <button className="text-gray-300 hover:text-gray-600">
                <MoreVertical size={14} />
            </button>
        </div>
        <div className="text-[10px] text-gray-500 space-y-0.5">
            <p className="truncate">Mentor: <span className="font-medium text-gray-700">{data.mentor}</span></p>
            <p>Jadwal: {data.time}</p>
        </div>
    </div>
  </div>
);

// --- COMPONENT: ATTENDANCE TABS & TABLES (Original) ---
const AttendanceSection = ({ teachers, students }) => {
    const [activeTab, setActiveTab] = useState('siswa'); // 'guru' or 'siswa'

    // Pagination States (Visual Only for Demo)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    const dataToDisplay = activeTab === 'guru' ? teachers : students;
    const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
    const paginatedData = dataToDisplay.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-100">
                <button 
                    onClick={() => { setActiveTab('siswa'); setCurrentPage(1); }}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'siswa' ? 'text-[#67051a]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Absensi Siswa
                    {activeTab === 'siswa' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#67051a]"></div>}
                </button>
                <button 
                    onClick={() => { setActiveTab('guru'); setCurrentPage(1); }}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'guru' ? 'text-[#67051a]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Absensi Guru
                    {activeTab === 'guru' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#67051a]"></div>}
                </button>
            </div>

            {/* Table Content */}
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="p-4 rounded-l-lg">Nama Lengkap</th>
                                <th className="p-4">{activeTab === 'guru' ? 'Role / Jabatan' : 'Kelas'}</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4">Waktu Check-In</th>
                                <th className="p-4 rounded-r-lg">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${activeTab === 'guru' ? 'bg-[#67051a]' : 'bg-gray-400'}`}>
                                                {item.name.charAt(0)}
                                            </div>
                                            {item.name}
                                        </td>
                                        <td className="p-4 text-gray-500">{activeTab === 'guru' ? item.role : item.className}</td>
                                        <td className="p-4 text-center">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="p-4 text-gray-600 font-mono text-xs">{item.time}</td>
                                        <td className="p-4 text-gray-500 text-xs">{item.date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400 text-sm">Belum ada data absensi untuk hari ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Simple Pagination */}
                {dataToDisplay.length > itemsPerPage && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400">Menampilkan {paginatedData.length} dari {dataToDisplay.length} data</span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={16} className="text-gray-600" />
                            </button>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight size={16} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper: Status Badge
const StatusBadge = ({ status }) => {
    let styles = "";
    switch(status) {
        case 'Hadir': styles = "bg-emerald-50 text-emerald-600 border-emerald-200"; break;
        case 'Izin': styles = "bg-yellow-50 text-yellow-600 border-yellow-200"; break;
        case 'Sakit': styles = "bg-blue-50 text-blue-600 border-blue-200"; break;
        case 'Alpha': styles = "bg-red-50 text-red-600 border-red-200"; break;
        default: styles = "bg-gray-50 text-gray-400 border-gray-200"; break;
    }

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${styles}`}>
            {status}
        </span>
    );
};

export default AdminAbsensi;