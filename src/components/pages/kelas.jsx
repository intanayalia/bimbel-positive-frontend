import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavigasiSiswa from '../common/navigasisiswa';
import api from '../../api';

// --- KOMPONEN DISKUSI (SUB-COMPONENT) ---
const DiscussionPanel = ({ materialId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    // Load Komentar
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(`/materials/${materialId}/comments`);
                setComments(res.data);
            } catch (err) {
                console.error("Gagal load komentar", err);
            }
        };
        fetchComments();
    }, [materialId]);

    // Kirim Komentar
    const handleSend = async () => {
        if (!newComment.trim()) return;
        setLoading(true);
        try {
            const res = await api.post(`/materials/${materialId}/comments`, { content: newComment });
            setComments([res.data, ...comments]); // Tambah ke atas list
            setNewComment("");
        } catch (err) {
            alert("Gagal mengirim komentar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 border-t border-gray-100 p-5 animate-in slide-in-from-top-2">
            <h4 className="text-sm font-bold text-gray-700 mb-4">Forum Diskusi Materi Ini</h4>

            {/* Input */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tulis pertanyaan atau diskusi..."
                    className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="px-4 py-2 bg-brand-dark text-white text-sm font-bold rounded-lg hover:bg-[#5a1017] transition-colors disabled:opacity-50"
                >
                    {loading ? '...' : 'Kirim'}
                </button>
            </div>

            {/* List Komentar */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {comments.length > 0 ? (
                    comments.map((c) => (
                        <div key={c.id} className="flex gap-3">
                            <div className="flex-shrink-0">
                                <img
                                    src={c.user.avatar ? `http://localhost:8000/storage/${c.user.avatar}` : `https://ui-avatars.com/api/?name=${c.user.name}&background=random`}
                                    alt={c.user.name}
                                    className="w-8 h-8 rounded-full border border-gray-200"
                                />
                            </div>
                            <div className="bg-white p-3 rounded-r-xl rounded-bl-xl shadow-sm border border-gray-200 text-sm w-full">
                                <div className="flex justify-between items-start">
                                    <p className="font-bold text-gray-800 text-xs mb-1">{c.user.name}</p>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(c.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-xs leading-relaxed">{c.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-gray-400 text-center italic">Belum ada diskusi. Jadilah yang pertama bertanya!</p>
                )}
            </div>
        </div>
    );
};

// --- KOMPONEN ITEM MATERI ---
const MaterialItem = ({ material, onToggleDiscussion, isDiscussionOpen }) => {
    let icon, label, btnColor;

    if (material.type === 'video') {
        icon = (
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
        );
        label = "Video";
        btnColor = "bg-blue-600 hover:bg-blue-700";
    } else {
        icon = (
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
        );
        label = "PDF";
        btnColor = "bg-red-600 hover:bg-red-700";
    }

    return (
        <div className="border border-gray-200 rounded-xl mb-4 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="p-4 flex items-center gap-4">
                {icon}
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                    <h5 className="font-bold text-sm text-gray-800">{material.title}</h5>
                </div>

                <div className="flex gap-2">
                    {/* Tombol Buka Materi */}
                    <button
                        onClick={() => window.open(material.content_url, '_blank')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors ${btnColor}`}
                    >
                        Buka
                    </button>

                    {/* Tombol Toggle Diskusi */}
                    <button
                        onClick={() => onToggleDiscussion(material.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${isDiscussionOpen
                                ? 'bg-gray-100 text-gray-700 border-gray-300'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.772-1.154m-4.044-2.434C3.208 16.33 3 16.036 3 15.659V9a2 2 0 012-2h6a2 2 0 012 2v3.659c0 .376-.208.67-.816.753l.016.008a2.98 2.98 0 00.957 2.213l-.957.973" /></svg>
                        {isDiscussionOpen ? 'Tutup' : 'Diskusi'}
                    </button>
                </div>
            </div>

            {/* Panel Diskusi (Muncul jika dibuka) */}
            {isDiscussionOpen && (
                <DiscussionPanel materialId={material.id} />
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function Kelas() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openWeekId, setOpenWeekId] = useState(null);

    // State untuk melacak materi mana yang panel diskusinya sedang terbuka
    // Format: ID Materi (misal: 5). Jika null berarti tidak ada yang dibuka.
    const [openDiscussionId, setOpenDiscussionId] = useState(null);

    const toggleWeek = (weekId) => {
        setOpenWeekId(prevId => (prevId === weekId ? null : weekId));
    };

    const toggleDiscussion = (materialId) => {
        setOpenDiscussionId(prev => (prev === materialId ? null : materialId));
    };

    useEffect(() => {
        const fetchDetailKelas = async () => {
            try {
                const response = await api.get(`/courses/${id}`);
                setCourse(response.data);
                if (response.data.weeks && response.data.weeks.length > 0) {
                    setOpenWeekId(response.data.weeks[0].id);
                }
                setLoading(false);
            } catch (error) {
                console.error("Gagal ambil detail kelas:", error);
                setLoading(false);
            }
        };
        fetchDetailKelas();
    }, [id]);

    const getImageUrl = (path) => {
        if (!path) return "/assets/course-math.jpg";
        return path.startsWith('http') ? path : `http://localhost:8000/storage/${path}`;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Memuat Kelas...</div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center">Kelas tidak ditemukan.</div>;

    return (
        <div className="bg-[#F8F9FD] min-h-screen font-sans">
            <NavigasiSiswa />

            <header className="relative pt-32 pb-40 bg-gray-900 overflow-hidden">
                <img src={getImageUrl(course.image)} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm transform scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FD] via-gray-900/70 to-gray-900/90"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-6">
                            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                            <span>/</span>
                            <span className="text-white font-bold">Detail Kelas</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">{course.title}</h1>
                        <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                            <div className="text-left">
                                <p className="text-sm text-gray-300 uppercase tracking-wide">Mentor</p>
                                <p className="text-lg font-bold text-white">{course.mentor}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 -mt-24 relative z-20 pb-24">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px]">
                        <div className="p-8 md:p-12 bg-gray-50/30">

                            <div className="mb-10 text-center max-w-2xl mx-auto">
                                <h3 className="font-bold text-xl text-gray-800 mb-2">Tentang Kelas Ini</h3>
                                <p className="text-gray-600 leading-relaxed">{course.description}</p>
                            </div>

                            <div className="space-y-6">
                                {course.weeks && course.weeks.length > 0 ? (
                                    course.weeks.map((week) => {
                                        const isOpen = openWeekId === week.id;
                                        return (
                                            <div key={week.id} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${isOpen ? 'border-brand-dark ring-1 ring-brand-dark/20' : 'border-gray-100 hover:border-gray-300'}`}>
                                                <div onClick={() => toggleWeek(week.id)} className="p-6 cursor-pointer flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-xs border uppercase tracking-wider ${isOpen ? 'bg-brand-dark text-white border-brand-dark' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                            {week.week_number}
                                                        </div>
                                                        <h3 className={`text-lg font-bold transition-colors ${isOpen ? 'text-brand-dark' : 'text-gray-800'}`}>{week.title}</h3>
                                                    </div>
                                                    <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>

                                                {isOpen && (
                                                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50/30">
                                                        <p className="text-sm text-gray-500 mb-4">{week.description}</p>
                                                        <div className="space-y-3">
                                                            {week.materials && week.materials.length > 0 ? (
                                                                week.materials.map((mat) => (
                                                                    <MaterialItem
                                                                        key={mat.id}
                                                                        material={mat}
                                                                        isDiscussionOpen={openDiscussionId === mat.id}
                                                                        onToggleDiscussion={toggleDiscussion}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <p className="text-sm text-gray-400 italic">Belum ada materi minggu ini.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-10 text-gray-500">Materi belum tersedia untuk kelas ini.</div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}