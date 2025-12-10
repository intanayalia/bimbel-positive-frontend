import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavigasiSiswa from '../common/navigasisiswa';
import api from '../../api'; // <-- PENTING: Import konfigurasi API kita

// --- SUB-COMPONENTS (Tampilan UI) ---

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
        <div className="relative w-full aspect-video md:aspect-[16/6] rounded-2xl overflow-hidden shadow-lg mb-10 group">
            {slides.map((slide, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={slide} alt={`Info ${index + 1}`} className="w-full h-full object-cover" />
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

const ClassCard = ({ id, title, mentor, schedule, image }) => {
    const navigate = useNavigate(); 
    const handleMasukKelas = () => {
        navigate(`/kelas/${id}`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
            <div className="h-40 bg-gray-200 relative overflow-hidden">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=No+Image"; }} // Fallback image
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-brand-dark shadow-sm">
                    Aktif
                </div>
            </div>
            <div className="p-5">
                <h4 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{title}</h4>
                <p className="text-sm text-gray-500 mb-4">Mentor: <span className="font-medium text-gray-700">{mentor}</span></p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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

const MiniCalendar = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); 
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-gray-800">November 2025</h4>
                <div className="flex gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded-md"><svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
                    <button className="p-1 hover:bg-gray-100 rounded-md"><svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
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

const ScheduleItem = ({ id, time, subject, mentor, type, isActive, onPresensiClick, presensiStatus }) => {
    return (
        <div className={`flex gap-4 mb-4 group relative pb-6 pl-4 ml-2 border-l-2 ${isActive ? 'border-brand-dark' : 'border-gray-200'}`}>
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isActive ? 'bg-brand-dark w-4 h-4 -left-[9px]' : 'bg-gray-300 w-3 h-3 -left-[7px]'}`}></div>
            
            <div className="w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <p className={`text-xs font-bold mb-0.5 ${isActive ? 'text-brand-dark' : 'text-gray-400'}`}>{time}</p>
                        <h5 className={`font-bold text-sm ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>{subject}</h5>
                        <p className={`text-xs ${isActive ? 'text-gray-500' : 'text-gray-400'} mb-2`}>{mentor} • {type}</p>
                    </div>
                </div>

                {isActive && (
                    <div className="mt-2">
                        {presensiStatus === 'pending' ? (
                            <button 
                                onClick={() => onPresensiClick(id)}
                                className="hover:opacity-90 transition-opacity transform active:scale-95 focus:outline-none"
                            >
                                <img 
                                    src="/assets/btn-presensi.png" 
                                    alt="Isi Presensi" 
                                    className="h-8 w-auto object-contain" 
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentNode.innerHTML = '<span class="px-3 py-1 bg-brand-dark text-white text-xs font-bold rounded-md hover:bg-brand-dark-accent cursor-pointer shadow-sm">Isi Presensi</span>';
                                    }}
                                />
                            </button>
                        ) : presensiStatus === 'success' ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Hadir
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400 italic">Sedang memproses...</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ScheduleCard = ({ schedules, onPresensiClick }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Jadwal Hari Ini</h4>
        
        {schedules.map(sch => (
            <ScheduleItem 
                key={sch.id}
                {...sch}
                onPresensiClick={onPresensiClick}
            />
        ))}
        
        {schedules.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">Tidak ada jadwal hari ini.</p>
        )}
    </div>
);


// --- MAIN COMPONENT ---

export default function DashboardSiswa() {
    
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState([]); // Data kelas dari Database
    const [loading, setLoading] = useState(true); // Loading state
    
    // State Jadwal (Sementara masih data dummy/simulasi)
    const [schedules, setSchedules] = useState([
        { 
            id: 101, 
            time: "14:00 - 15:30", 
            subject: "Matematika Wajib", 
            mentor: "Kak Bimo", 
            type: "Zoom Meeting", 
            isActive: true, 
            presensiStatus: "pending" 
        },
        { 
            id: 102, 
            time: "16:00 - 17:30", 
            subject: "Bahasa Inggris", 
            mentor: "Ms. Sarah", 
            type: "Offline", 
            isActive: false, 
            presensiStatus: "pending" 
        }
    ]);

    // --- INTEGRASI BACKEND ---
    
    // Function untuk mengambil data kelas dari Laravel
    const fetchCourses = async (query = "") => {
        setLoading(true);
        try {
            // URL endpoint: /courses atau /courses?q=xxx
            const endpoint = query ? `/courses?q=${query}` : '/courses';
            
            // Call API
            const response = await api.get(endpoint);
            
            // Set data ke state
            setCourses(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data kelas:", error);
            setLoading(false);
        }
    };

    // --- LOGIC SEARCHING (DEBOUNCE) ---
    // Efek ini akan berjalan setiap kali `searchQuery` berubah
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCourses(searchQuery);
        }, 800); // Tunggu 800ms setelah user berhenti mengetik

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);


    // Handler input search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Logic Presensi (Masih Simulasi Frontend)
    const handlePresensi = async (scheduleId) => {
        setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, presensiStatus: 'loading' } : s));

        setTimeout(() => {
            setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, presensiStatus: 'success' } : s));
            alert("Presensi Berhasil Tercatat!");
        }, 1500);
    };

    return (
        <div className="bg-[#F8F9FD] min-h-screen font-sans pb-20">
            <NavigasiSiswa />

            <main className="container mx-auto px-6 pt-24">
                
                <InfoSlider />

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        <div className="mb-8">
                            <h2 className="text-2xl font-extrabold text-gray-800">Kelas yang Tersedia</h2>
                            <p className="text-gray-500 mt-1">Lanjutkan belajarmu dan raih prestasimu!</p>
                        </div>

                        <div className="relative mb-8">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Cari kelas yang kamu inginkan (Contoh: Matematika)..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/20 outline-none transition-all"
                            />
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-dark border-r-transparent"></div>
                                <p className="mt-4 text-gray-500">Memuat data kelas...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courses.map(course => (
                                    <ClassCard 
                                        key={course.id} 
                                        id={course.id} 
                                        title={course.title}
                                        mentor={course.mentor}
                                        schedule={course.schedule}
                                        image={course.image}
                                    />
                                ))}
                            </div>
                        )}
                        
                        {courses.length === 0 && !loading && (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <p className="text-xl font-bold text-gray-800">Kelas tidak ditemukan 😔</p>
                                <p className="text-gray-500 mt-2">Coba kata kunci pencarian yang lain.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="lg:w-1/3">
                        <MiniCalendar />
                        <ScheduleCard 
                            schedules={schedules} 
                            onPresensiClick={handlePresensi}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}