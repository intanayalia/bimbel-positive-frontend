import React, { useState, useEffect } from 'react';
import { Search, Clock, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import NavigasiSiswa from '../common/navigasisiswa';
import api from '../../api';

const Tryout = () => {
  const navigate = useNavigate(); 
  const [tryouts, setTryouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTryouts = async () => {
      try {
        const response = await api.get('/tryouts');
        // Filter hanya tampilkan yang statusnya 'active' untuk siswa
        const activeTryouts = response.data.filter(t => t.status === 'active');
        setTryouts(activeTryouts);
        setLoading(false);
      } catch (error) {
        console.error("Gagal ambil tryout:", error);
        setLoading(false);
      }
    };
    fetchTryouts();
  }, []);

  const filteredTryouts = tryouts.filter((item) => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.subject.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleKerjakanSoal = (id) => {
    if(window.confirm("Mulai kerjakan tryout sekarang? Waktu akan berjalan.")){
        navigate(`/isi-tryout/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      <NavigasiSiswa />
      <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-red-900">Daftar Tryout</h1>
            <p className="text-gray-500">Pilih tryout yang tersedia dan kerjakan untuk mengasah kemampuanmu.</p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari tryout..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-red-900"
            />
          </div>
        </div>

        {/* List Tryout */}
        {loading ? (
           <div className="text-center py-20"><p className="animate-pulse text-gray-500">Memuat Data Tryout...</p></div>
        ) : filteredTryouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTryouts.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-red-50 text-red-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{item.subject}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2">{item.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-3"><Clock size={18} className="text-gray-400" /><span className="font-semibold w-16">Durasi</span>: {item.duration} Menit</div>
                    <div className="flex items-center gap-3"><FileText size={18} className="text-gray-400" /><span className="font-semibold w-16">Soal</span>: {item.total_questions} Butir</div>
                  </div>
                </div>
                <button onClick={() => handleKerjakanSoal(item.id)} className="w-full py-3 rounded-xl bg-red-900 text-white font-bold hover:bg-red-800 transition-all shadow-lg">Kerjakan Sekarang</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-600">Belum ada Tryout Aktif.</h3>
            <p className="text-gray-400 text-sm">Silakan cek kembali nanti.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tryout;