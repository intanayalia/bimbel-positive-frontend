import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Clock } from 'lucide-react';
import NavigasiSiswa from '../common/navigasisiswa';
import api from '../../api';

// ==========================================
// 1. SUB-COMPONENTS (UI WIDGETS)
// ==========================================

// --- SLIDER INFO ---
const InfoSlider = () => {
    const slides = [
        "/assets/info-slide-1.jpg", 
        "/assets/info-slide-2.jpg", 
        "/assets/info-slide-3.jpg"  
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="relative w-full aspect-video md:aspect-[16/6] rounded-2xl overflow-hidden shadow-lg mb-8 group bg-gray-200">
            {slides.map((slide, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img 
                        src={slide} 
                        alt={`Info ${index + 1}`} 
                        className="w-full h-full object-cover" 
                        onError={(e) => e.target.style.display='none'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
            ))}
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

// --- KARTU KELAS ---
const ClassCard = ({ id, title, mentor, schedule, image }) => {
    const navigate = useNavigate(); 
    const handleMasukKelas = () => {
        // Arahkan ke halaman detail kelas (pastikan route ini ada)
        navigate(`/courses/${id}`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group h-full flex flex-col">
            <div className="h-40 bg-gray-200 relative overflow-hidden">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=Kelas+Bimbel"; }} 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-brand-dark shadow-sm">
                    Aktif
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h4 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{title}</h4>
                <p className="text-sm text-gray-500 mb-4">Mentor: <span className="font-medium text-gray-700">{mentor}</span></p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg mt-auto">
                    <Clock size={14} className="text-brand-dark"/>
                    <span>{schedule}</span>
                </div>

                <button 
                    onClick={handleMasukKelas}
                    className="w-full py-2.5 bg-brand-dark text-white text-sm font-bold rounded-xl hover:bg-brand-dark-accent transition-colors"
                >
                    Masuk Kelas
                </button>
            </div>
        </div>
    );
};

// --- KALENDER MINI ---
const MiniCalendar = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); 
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const monthName = today.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-gray-800 capitalize">{monthName}</h4>
                <div className="flex gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded-md text-gray-400">{'<'}</button>
                    <button className="p-1 hover:bg-gray-100 rounded-md text-gray-400">{'>'}</button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {['M','S','S','R','K','J','S'].map((d,i) => (
                    <div key={i} className="text-gray-400 text-xs font-bold mb-2">{d}</div>
                ))}
                {days.map(day => (
                    <div 
                        key={day} 
                        className={`
                            h-8 w-8 flex items-center justify-center rounded-full text-xs cursor-pointer transition-colors
                            ${day === currentDay ? 'bg-brand-dark text-white font-bold shadow-md' : 'text-gray-600 hover:bg-gray-100'}
                        `}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- LIST JADWAL ---
const ScheduleCard = ({ schedules, onPresensiClick }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Jadwal Hari Ini</h4>
        
        {schedules.length > 0 ? (
            schedules.map(sch => (
                <div key={sch.id} className={`flex gap-4 mb-4 group relative pb-6 pl-4 ml-2 border-l-2 ${sch.isActive ? 'border-brand-dark' : 'border-gray-200'}`}>
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${sch.isActive ? 'bg-brand-dark w-4 h-4 -left-[9px]' : 'bg-gray-300 w-3 h-3 -left-[7px]'}`}></div>
                    
                    <div className="w-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`text-xs font-bold mb-0.5 ${sch.isActive ? 'text-brand-dark' : 'text-gray-400'}`}>{sch.time}</p>
                                <h5 className={`font-bold text-sm ${sch.isActive ? 'text-gray-800' : 'text-gray-600'}`}>{sch.subject}</h5>
                                <p className={`text-xs ${sch.isActive ? 'text-gray-500' : 'text-gray-400'} mb-2`}>{sch.mentor} • {sch.type}</p>
                            </div>
                        </div>

                        {sch.isActive && (
                            <div className="mt-2">
                                {sch.presensiStatus === 'pending' ? (
                                    <button 
                                        onClick={() => onPresensiClick(sch.id)}
                                        className="px-3 py-1.5 bg-brand-dark text-white text-xs font-bold rounded-lg hover:bg-brand-dark-accent transition-colors shadow-sm"
                                    >
                                        Isi Presensi
                                    </button>
                                ) : sch.presensiStatus === 'success' ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                                        Hadir
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400 italic">Memproses...</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center py-6">
                <p className="text-gray-400 text-sm">Tidak ada jadwal kelas hari ini.</p>
                <p className="text-gray-300 text-xs mt-1">Selamat beristirahat!</p>
            </div>
        )}
    </div>
);


// ==========================================
// 2. MAIN COMPONENT: DASHBOARD SISWA
// ==========================================

export default function DashboardSiswa() {
    const navigate = useNavigate();
    
    // --- STATE ---
    const [user, setUser] = useState({ name: 'Siswa' });
    const [searchQuery, setSearchQuery] = useState("");
    
    // Data Kelas (Courses)
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    // Data Jadwal (Schedules) - Dinamis dari DB
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedule, setLoadingSchedule] = useState(true);

    // --- INITIAL DATA FETCH ---
    useEffect(() => {
        // 1. Load User Info
        const storedUser = localStorage.getItem('user_info');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user info");
            }
        }

        // 2. Load Data
        fetchCourses();
        fetchTodaySchedule();
    }, []);

    // --- API CALLS ---

    // A. Ambil Semua Kelas
    const fetchCourses = async (query = "") => {
        setLoadingCourses(true);
        try {
            const endpoint = query ? `/courses?q=${query}` : '/courses';
            const response = await api.get(endpoint);
            setCourses(response.data);
        } catch (error) {
            console.error("Gagal mengambil data kelas:", error);
        } finally {
            setLoadingCourses(false);
        }
    };

    // B. Ambil Jadwal Hari Ini
    const fetchTodaySchedule = async () => {
        setLoadingSchedule(true);
        try {
            // Memanggil endpoint baru yang kita buat di CourseController
            const response = await api.get('/schedules/today');
            setSchedules(response.data);
        } catch (error) {
            console.error("Gagal ambil jadwal:", error);
        } finally {
            setLoadingSchedule(false);
        }
    };

    // --- EVENT HANDLERS ---

    // Debounce Search (Agar tidak spam API saat mengetik)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCourses(searchQuery);
        }, 800); 
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Handle Klik Tombol Presensi
    const handlePresensi = async (scheduleId) => {
        // Set status loading lokal di UI
        setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, presensiStatus: 'loading' } : s));
        
        try {
            // (Opsional) Panggil API Presensi di sini jika sudah ada
            // await api.post('/absensi', { course_id: scheduleId });
            
            // Simulasi sukses setelah 1 detik
            setTimeout(() => {
                setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, presensiStatus: 'success' } : s));
                alert("Presensi Berhasil Tercatat!");
            }, 1000);
        } catch (error) {
            console.error("Gagal presensi:", error);
            alert("Gagal melakukan presensi.");
            setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, presensiStatus: 'pending' } : s));
        }
    };

    return (
        <div className="bg-[#F8F9FD] min-h-screen font-sans pb-20">
            <NavigasiSiswa />

            <main className="container mx-auto px-6 pt-24">
                
                {/* HEADER (TANPA TOMBOL PEMBAYARAN) */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800">
                            Halo, <span className="text-brand-dark">{user.name}</span>! 👋
                        </h1>
                        <p className="text-gray-500 mt-1">Siap untuk belajar apa hari ini?</p>
                    </div>
                </div>

                {/* SLIDER INFO */}
                <InfoSlider />

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* --- KOLOM KIRI: DAFTAR KELAS --- */}
                    <div className="lg:w-2/3">
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-xl font-extrabold text-gray-800">Kelas Saya</h2>
                            {/* Search Bar */}
                            <div className="relative w-full max-w-xs">
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari kelas..."
                                    className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:border-brand-dark focus:outline-none shadow-sm"
                                />
                            </div>
                        </div>

                        {loadingCourses ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-dark border-r-transparent"></div>
                                <p className="mt-4 text-gray-500">Memuat data kelas...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courses.length > 0 ? (
                                    courses.map(course => (
                                        <ClassCard 
                                            key={course.id} 
                                            id={course.id} 
                                            title={course.title}
                                            mentor={course.mentor}
                                            schedule={course.schedule}
                                            image={course.image}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-10 bg-white rounded-2xl border border-gray-100">
                                        <p className="text-lg font-bold text-gray-800">Kelas tidak ditemukan</p>
                                        <p className="text-gray-500 text-sm">Cobalah kata kunci lain.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* --- KOLOM KANAN: WIDGETS --- */}
                    <div className="lg:w-1/3">
                        {/* 1. Kalender */}
                        <MiniCalendar />
                        
                        {/* 2. Jadwal Hari Ini (Dinamis) */}
                        {loadingSchedule ? (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                                <p className="text-gray-400 text-sm animate-pulse">Memuat jadwal...</p>
                            </div>
                        ) : (
                            <ScheduleCard 
                                schedules={schedules} 
                                onPresensiClick={handlePresensi}
                            />
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}