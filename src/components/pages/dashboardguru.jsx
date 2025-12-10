import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { BookOpen, Clock, Calendar, MoreVertical, Plus, User } from 'lucide-react'; 
import NavigasiGuru from '../common/navigasiguru';
import api from '../../api';

// ==========================================
// SUB-COMPONENT: KARTU KELAS GURU
// ==========================================
const ClassCardGuru = ({ id, title, mentor, schedule, image }) => {
    const navigate = useNavigate();

    return (
        <div 
            // PENTING: Arahkan ke rute khusus Guru
            onClick={() => navigate(`/kelas-guru/${id}`)} 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full"
        >
            {/* Bagian Gambar */}
            <div className="h-48 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                
                {/* Image Handling dengan Fallback */}
                <img 
                    src={image || "/assets/class-default.jpg"} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1577896334696-9f1d29f95f9d?auto=format&fit=crop&q=80&w=1000"; 
                    }}
                />
                
                <span className="absolute bottom-3 left-4 text-white text-xs font-bold bg-red-900 px-3 py-1 rounded-full z-20 shadow-md">
                    Mode Pengajar
                </span>
            </div>

            {/* Bagian Konten */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-red-900 transition-colors">
                    {title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <User size={16} className="text-red-900"/>
                    <span className="font-medium">{mentor}</span>
                </div>

                {/* Footer Kartu */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Clock size={14}/>
                        <span>{schedule || "Jadwal Fleksibel"}</span>
                    </div>
                    <span className="text-xs text-red-900 font-bold hover:underline">
                        Kelola Materi &rarr;
                    </span>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// MAIN COMPONENT: DASHBOARD GURU
// ==========================================
export default function DashboardGuru() {
    const navigate = useNavigate();
    
    // State Data
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ name: 'Pengajar' });

    useEffect(() => {
        // 1. Ambil Data User dari LocalStorage untuk sapaan
        const storedUser = localStorage.getItem('user_info');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Gagal parse user info", e);
            }
        }

        // 2. Ambil Data Kelas dari API
        const fetchCourses = async () => {
            try {
                // Menggunakan endpoint public courses (atau buat endpoint khusus /teacher/courses di backend jika butuh filter spesifik)
                const response = await api.get('/courses'); 
                setCourses(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Gagal memuat data kelas:", error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
            {/* Navigasi Atas */}
            <NavigasiGuru />

            {/* Konten Utama */}
            <main className="pt-28 px-6 md:px-12 max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 animate-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                            Dashboard Pengajar <span className="text-red-900">.</span>
                        </h1>
                        <p className="text-gray-500 mt-3 text-lg max-w-2xl">
                            Halo, <span className="font-bold text-gray-800">{user.name}</span>! 
                            Silakan pilih kelas untuk mengunggah materi atau kelola ujian siswa.
                        </p>
                    </div>
                    
                    {/* Tombol Aksi Cepat */}
                    <div className="flex gap-3">
                        <button 
                            onClick={() => navigate('/tryout-guru')}
                            className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:border-red-900 hover:text-red-900 transition-all shadow-sm flex items-center gap-2"
                        >
                            <BookOpen size={18}/> Kelola Tryout
                        </button>
                    </div>
                </div>

                {/* Section Daftar Kelas */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-8 bg-red-900 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Kelas & Mata Pelajaran
                        </h2>
                    </div>

                    {loading ? (
                        // Loading State (Skeleton)
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="bg-white h-80 rounded-2xl shadow-sm animate-pulse border border-gray-100"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.length > 0 ? (
                                courses.map(course => (
                                    <ClassCardGuru 
                                        key={course.id} 
                                        id={course.id} 
                                        title={course.title}
                                        mentor={course.mentor}
                                        schedule={course.schedule}
                                        image={course.image}
                                    />
                                ))
                            ) : (
                                // Empty State
                                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                                    <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen size={32} className="text-red-900"/>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Belum ada kelas tersedia.</h3>
                                    <p className="text-gray-500 mt-2">Hubungi admin untuk penugasan kelas.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
} 