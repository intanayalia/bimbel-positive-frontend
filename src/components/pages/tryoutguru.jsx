import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, 
    Trash2, 
    Search, 
    BookOpen, 
    Clock, 
    Edit, 
    FileText,
    X // Icon Close untuk modal
} from 'lucide-react';
import NavigasiGuru from '../common/navigasiguru';
import api from '../../api'; 

const TryoutGuru = () => {
  const navigate = useNavigate();
  
  // =========================================
  // 1. STATE MANAGEMENT
  // =========================================
  const [loading, setLoading] = useState(true);
  const [tryouts, setTryouts] = useState([]); 
  const [courses, setCourses] = useState([]); // State Baru: Menampung Mapel dari DB
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal Create
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
      title: '',
      subject: '',
      duration: 60, 
      status: 'active'
  });

  // =========================================
  // 2. FETCH DATA (TRYOUTS & COURSES)
  // =========================================
  const fetchData = async () => {
    try {
        setLoading(true);
        
        // A. Ambil Data Tryout
        const resTryouts = await api.get('/teacher/tryouts');
        setTryouts(resTryouts.data);

        // B. Ambil Data Kelas (Sebagai Mata Pelajaran)
        const resCourses = await api.get('/courses');
        setCourses(resCourses.data);

    } catch (error) {
        console.error("Gagal memuat data:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================
  // 3. HANDLER ACTIONS
  // =========================================
  
  const handleCreate = async () => {
    if (!formData.title || !formData.subject) {
        alert("Judul dan Mata Pelajaran wajib diisi!");
        return;
    }

    try {
        await api.post('/teacher/tryouts', formData);
        
        // Reset Form & Tutup Modal
        setFormData({ title: '', subject: '', duration: 60, status: 'active' });
        setShowModal(false);
        
        // Refresh Data
        fetchData(); 
        alert("Tryout berhasil dibuat!");
    } catch (error) {
        console.error(error);
        alert("Gagal membuat tryout.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus Tryout ini?")) return;

    try {
        await api.delete(`/teacher/tryouts/${id}`);
        setTryouts(prev => prev.filter(t => t.id !== id));
    } catch (error) {
        console.error(error);
        alert("Gagal menghapus tryout.");
    }
  };

  const handleManageQuestions = (tryoutItem) => {
    // Arahkan ke halaman input soal (Sesuaikan route Anda)
    navigate(`/teacher/tryouts/${tryoutItem.id}/questions`);
  };

  // Filter Pencarian
  const filteredTryouts = tryouts.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <NavigasiGuru />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-red-900">Manajemen Tryout</h1>
            <p className="text-gray-500 mt-1">Buat, edit, dan kelola soal ujian untuk siswa.</p>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-red-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus size={20} />
            Buat Tryout Baru
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center gap-3">
            <Search className="text-gray-400" />
            <input 
                type="text" 
                placeholder="Cari tryout berdasarkan judul atau mapel..." 
                className="w-full outline-none text-gray-600 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {/* LOADING STATE */}
        {loading ? (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-900 mx-auto mb-4"></div>
                <p className="text-gray-500 animate-pulse">Mengambil data dari database...</p>
            </div>
        ) : (
            <>
                {/* EMPTY STATE */}
                {filteredTryouts.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="text-red-900" size={32} />
                        </div>
                        <p className="text-gray-400 font-bold text-lg">Belum ada Tryout ditemukan.</p>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="text-red-900 font-bold hover:underline mt-2"
                        >
                            + Tambah Data
                        </button>
                    </div>
                )}

                {/* TRYOUT GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTryouts.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            
                            {/* Card Header */}
                            <div className="p-6 pb-4 relative">
                                <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                    item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {item.status}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-900 transition-colors">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                    <BookOpen size={16} />
                                    <span>{item.subject}</span>
                                </div>
                            </div>

                            {/* Card Info */}
                            <div className="px-6 py-3 bg-gray-50 border-y border-gray-100 flex justify-between text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-red-900"/>
                                    <span>{item.duration} Menit</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText size={16} className="text-red-900"/>
                                    <span>{item.total_questions || 0} Soal</span>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="p-4 flex gap-3">
                                <button 
                                    onClick={() => handleManageQuestions(item)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-50 hover:text-red-900 hover:border-red-900 transition-all text-sm"
                                >
                                    <Edit size={16} /> Kelola Soal
                                </button>
                                <button 
                                    onClick={() => handleDelete(item.id)}
                                    className="px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-transparent hover:border-red-200"
                                    title="Hapus Tryout"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
      </main>

      {/* ================= MODAL CREATE TRYOUT ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-100 transition-transform">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-900 text-white">
              <h3 className="font-bold text-lg">Buat Tryout Baru</h3>
              <button onClick={() => setShowModal(false)} className="hover:text-gray-200">
                 <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Judul Tryout</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Contoh: Tryout Akbar SNBT 2024" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-900 focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mata Pelajaran (Dari Database)</label>
                <div className="relative">
                    <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-900 focus:outline-none bg-white appearance-none"
                    >
                        <option value="" disabled>-- Pilih Mapel --</option>
                        
                        {/* BAGIAN DINAMIS: MAPPING DARI DATABASE */}
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <option key={course.id} value={course.title}>
                                    {course.title}
                                </option>
                            ))
                        ) : (
                            <option disabled>Memuat daftar kelas...</option>
                        )}
                        
                    </select>
                    {/* Icon Panah Kecil (Opsional agar lebih cantik) */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">*Pilihan diambil dari daftar Kelas yang aktif.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Durasi (Menit)</label>
                <div className="relative">
                    <Clock size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="number" 
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-900 focus:outline-none" 
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-full hover:bg-gray-100">
                        <input 
                            type="radio" 
                            name="status" 
                            value="active"
                            checked={formData.status === 'active'}
                            onChange={() => setFormData({...formData, status: 'active'})}
                            className="text-red-900 focus:ring-red-900"
                        />
                        <span className="text-sm font-medium">Aktif (Tampil)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-full hover:bg-gray-100">
                        <input 
                            type="radio" 
                            name="status" 
                            value="upcoming"
                            checked={formData.status === 'upcoming'}
                            onChange={() => setFormData({...formData, status: 'upcoming'})}
                            className="text-red-900 focus:ring-red-900"
                        />
                        <span className="text-sm font-medium">Draft (Sembunyi)</span>
                    </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleCreate} 
                className="px-6 py-2.5 bg-red-900 text-white font-bold rounded-lg hover:bg-red-800 shadow-md transition-all"
              >
                Simpan Tryout
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default TryoutGuru;