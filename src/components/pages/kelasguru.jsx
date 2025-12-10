import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavigasiGuru from '../common/navigasiguru';
import api from '../../api'; // Import API Configuration

// --- 1. MODAL TAMBAH TOPIK (Minggu Baru) ---
const TopicModal = ({ isOpen, onClose, onSubmit }) => {
    const [weekNum, setWeekNum] = useState("");
    const [topicTitle, setTopicTitle] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!weekNum || !topicTitle) return alert("Mohon isi semua field!");
        onSubmit({ week: weekNum, title: topicTitle });
        setWeekNum("");
        setTopicTitle("");
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-transform">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-red-900 font-bold text-lg">Buat Topik Baru</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-900 transition-colors">&times;</button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Minggu ke</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-900" placeholder="Contoh: 1" value={weekNum} onChange={(e) => setWeekNum(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Judul Topik</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-900" placeholder="Judul topik..." value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} />
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end">
                    <button onClick={handleSubmit} className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-2.5 rounded-lg shadow-md transition-all text-sm">Simpan Topik</button>
                </div>
            </div>
        </div>
    );
};

// --- 2. MODAL UPLOAD MATERI (POPUP UPLOAD FILE) ---
const MaterialModal = ({ isOpen, onClose, onSubmit, type, weekId }) => {
    const [title, setTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false); // State loading upload
    const fileInputRef = useRef(null);

    // Reset state saat modal dibuka/tutup
    useEffect(() => {
        if (isOpen) {
            setTitle("");
            setSelectedFile(null);
            setIsUploading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!title) return alert("Judul materi harus diisi!");
        if (!selectedFile) return alert("Silakan pilih file terlebih dahulu!");
        
        setIsUploading(true);
        // Kirim data ke parent component (Logic upload ada di parent)
        await onSubmit({ weekId, title, type, file: selectedFile });
        setIsUploading(false);
    };

    const labelType = type === 'video' ? 'Video Pembelajaran' : 'Dokumen PDF';
    const acceptedFiles = type === 'video' ? 'video/*' : '.pdf';

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-transform">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
                        Upload {labelType}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-900 transition-colors">&times;</button>
                </div>
                
                <div className="p-6 space-y-4">
                    {/* Input Judul */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Judul Materi</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-900 transition-all" 
                            placeholder={`Contoh: ${type === 'video' ? 'Video Penjelasan...' : 'Modul Bab 1...'}`}
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            disabled={isUploading}
                        />
                    </div>

                    {/* Area Upload File */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Pilih File</label>
                        
                        <div 
                            onClick={() => !isUploading && fileInputRef.current.click()}
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 
                            ${selectedFile ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50 hover:border-red-400'}
                            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept={acceptedFiles}
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                            
                            {selectedFile ? (
                                <div className="text-red-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <p className="font-bold text-sm truncate">{selectedFile.name}</p>
                                    <p className="text-xs text-red-600 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div className="text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    <p className="font-medium text-sm text-gray-600">Klik untuk upload file</p>
                                    <p className="text-xs mt-1">Format: {type === 'video' ? '.MP4, .MKV' : '.PDF'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end">
                    <button 
                        onClick={handleSubmit} 
                        disabled={isUploading}
                        className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-2.5 rounded-lg shadow-md transition-all text-sm flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Mengupload...</span>
                            </>
                        ) : (
                            <span>Simpan & Upload</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MATERIAL ITEM GURU ---
const MaterialItemGuru = ({ material }) => {
    const isVideo = material.type === 'video';
    
    const icon = isVideo ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    );

    const iconBg = isVideo ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600';
    const labelType = isVideo ? 'VIDEO PEMBELAJARAN' : 'DOKUMEN PDF';

    return (
        <div className="border border-gray-200 rounded-xl mb-4 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2">
            <div className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg}`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{labelType}</p>
                    <h5 className="font-bold text-sm text-gray-800 line-clamp-1">{material.title}</h5>
                    {/* Tampilkan URL jika ada utk debug visual */}
                    {material.content_url && <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[200px]">Tersimpan di Server</p>}
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => material.content_url && window.open(material.content_url, '_blank')}
                        className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Lihat
                    </button>
                    {/* Tombol Hapus (Visual Saja, belum ada handler di prompt) */}
                    <button className="px-3 py-2 rounded-lg text-xs font-bold border border-red-100 text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT GURU ---
export default function KelasGuru() {
    const { id } = useParams();
    const [openWeekId, setOpenWeekId] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State Data Real
    const [courseInfo, setCourseInfo] = useState({ 
        title: "", 
        image: "/assets/class-default.jpg" // Default placeholder
    });
    const [weeks, setWeeks] = useState([]); // List Mingguan dari DB

    // Modal State
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [materialModal, setMaterialModal] = useState({ isOpen: false, weekId: null, type: 'pdf' });

    // --- FETCH DATA DARI API ---
    const fetchCourseData = async () => {
        try {
            setLoading(true);
            // Menggunakan endpoint /courses/{id} untuk mengambil detail kelas + mingguan + materi
            const response = await api.get(`/courses/${id}`);
            const data = response.data;

            setCourseInfo({
                title: data.title,
                image: data.image || "https://images.unsplash.com/photo-1513258496098-dad7f8795d53?q=80&w=2070" // Fallback jika image null
            });
            setWeeks(data.weeks || []); // Pastikan weeks tidak null
            
            // Buka minggu pertama secara otomatis jika ada
            if (data.weeks && data.weeks.length > 0 && !openWeekId) {
                setOpenWeekId(data.weeks[0].id);
            }
            
            setLoading(false);
        } catch (error) {
            console.error("Gagal memuat data kelas:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const toggleWeek = (weekId) => setOpenWeekId(prev => (prev === weekId ? null : weekId));

    // Handle Open Upload Modal
    const handleOpenUpload = (weekId, type) => {
        setMaterialModal({ isOpen: true, weekId, type });
    };

    // --- INTEGRASI: TAMBAH TOPIK (POST API) ---
    const handleAddTopic = async ({ week, title }) => {
        try {
            // Endpoint untuk menambah minggu ke kelas tertentu
            await api.post(`/teacher/courses/${id}/weeks`, {
                week_number: week,
                title: title
            });
            
            alert("Topik berhasil ditambahkan!");
            setIsTopicModalOpen(false);
            fetchCourseData(); // Refresh data agar muncul
        } catch (error) {
            console.error(error);
            alert("Gagal menambahkan topik. Cek koneksi.");
        }
    };

    // --- INTEGRASI: UPLOAD MATERI (POST API MULTIPART) ---
    const handleAddMaterial = async ({ weekId, title, type, file }) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type); // 'pdf' atau 'video'
        
        // PENTING: Backend mengharapkan field 'file' untuk upload
        if (file) {
            formData.append('file', file);
        }

        try {
            // Endpoint upload materi ke minggu tertentu
            await api.post(`/teacher/weeks/${weekId}/materials`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert(`Berhasil mengupload: ${file.name}`);
            setMaterialModal({ ...materialModal, isOpen: false });
            fetchCourseData(); // Refresh data agar materi muncul
        } catch (error) {
            console.error(error);
            alert("Gagal mengupload materi. Pastikan file max 10MB.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat Kelas...</div>;

    return (
        <div className="bg-[#F8F9FD] min-h-screen font-sans">
            <NavigasiGuru />

            {/* Header */}
            <header className="relative pt-32 pb-40 bg-gray-900 overflow-hidden shadow-xl">
                <img 
                    src={courseInfo.image} 
                    alt={courseInfo.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[2px] transform scale-105 transition-transform duration-1000" 
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1513258496098-dad7f8795d53?q=80&w=2070"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FD] via-gray-900/60 to-gray-900/80"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-6">
                        <Link to="/dashboard-guru" className="hover:text-white transition-colors">Dashboard</Link> / <span className="text-white font-bold">Manajemen Kelas</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight">{courseInfo.title}</h1>
                    <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-lg">
                        <p className="text-white font-medium tracking-wide">Mode Pengajar</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-6 -mt-24 relative z-20 pb-24">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px]">
                        <div className="p-8 md:p-12 bg-gray-50/30">
                            
                            <div className="flex justify-end mb-6">
                                <button 
                                    onClick={() => setIsTopicModalOpen(true)}
                                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:text-white hover:bg-red-900 hover:border-red-900 px-5 py-2 rounded-lg font-bold text-sm shadow-sm transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    Buat Topik
                                </button>
                            </div>

                            <div className="space-y-6">
                                {weeks.length > 0 ? (
                                    weeks.map((week) => {
                                        const isOpen = openWeekId === week.id;
                                        const activeColorText = 'text-red-900'; 
                                        const activeBorder = 'border-red-900 ring-1 ring-red-900/10';
                                        const activeBadge = 'bg-red-900 text-white';

                                        return (
                                            <div key={week.id} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${isOpen ? activeBorder : 'border-gray-100 hover:border-gray-300'}`}>
                                                <div onClick={() => toggleWeek(week.id)} className="p-6 cursor-pointer flex items-center justify-between gap-4 hover:bg-gray-50/50">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`px-4 py-2 rounded-lg font-bold text-xs border uppercase ${isOpen ? activeBadge : 'bg-gray-100 text-gray-500'}`}>
                                                            {week.week_number}
                                                        </div>
                                                        <h3 className={`text-lg font-bold ${isOpen ? activeColorText : 'text-gray-800'}`}>{week.title}</h3>
                                                    </div>
                                                    <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-red-900' : 'rotate-0 text-gray-400'}`}>
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>

                                                {isOpen && (
                                                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50/30">
                                                        <div className="flex gap-3 mb-4 mt-2">
                                                            <button 
                                                                onClick={() => handleOpenUpload(week.id, 'video')}
                                                                className="flex-1 border border-dashed border-gray-300 bg-white text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <span>+</span> Video
                                                            </button>
                                                            <button 
                                                                onClick={() => handleOpenUpload(week.id, 'pdf')}
                                                                className="flex-1 border border-dashed border-gray-300 bg-white text-gray-400 hover:border-red-500 hover:text-red-500 hover:bg-red-50 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <span>+</span> PDF
                                                            </button>
                                                        </div>

                                                        <div className="space-y-3">
                                                            {week.materials && week.materials.length > 0 ? (
                                                                week.materials.map(mat => (
                                                                    <MaterialItemGuru key={mat.id} material={mat} />
                                                                ))
                                                            ) : (
                                                                <p className="text-sm text-gray-400 italic text-center py-2">Belum ada materi.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-xl"><p className="text-gray-400 font-medium">Belum ada topik pembelajaran.</p></div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <TopicModal isOpen={isTopicModalOpen} onClose={() => setIsTopicModalOpen(false)} onSubmit={handleAddTopic} />
            <MaterialModal isOpen={materialModal.isOpen} weekId={materialModal.weekId} type={materialModal.type} onClose={() => setMaterialModal({ ...materialModal, isOpen: false })} onSubmit={handleAddMaterial} />
        </div>
    );
}