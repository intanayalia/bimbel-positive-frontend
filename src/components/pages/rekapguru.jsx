import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { Award, TrendingUp, Users } from 'lucide-react';
import NavigasiGuru from '../common/navigasiguru';
import api from '../../api';

const RekapGuru = () => {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  
  // State Data Chart (Default array kosong)
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [recentData, setRecentData] = useState([]);

  // --- FETCH DATA DARI API ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Panggil endpoint yang baru kita buat
        const response = await api.get('/teacher/rekap');
        
        setPieData(response.data.pie);
        setLineData(response.data.line);
        setRecentData(response.data.recent);
        
        setLoading(false);
      } catch (error) {
        console.error("Gagal memuat rekap guru:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      <NavigasiGuru />

      <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-red-900">Analisis Performa Siswa</h1>
            <p className="text-gray-500">Pantau perkembangan nilai dan aktivitas belajar siswa secara real-time.</p>
        </div>

        {loading ? (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-900 mx-auto mb-4"></div>
                <p className="text-gray-500 animate-pulse">Sedang mengkalkulasi data...</p>
            </div>
        ) : (
            <>
                {/* --- BAGIAN 1: SUMMARY CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-900">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-bold">Total Partisipasi</p>
                            <h3 className="text-2xl font-extrabold text-gray-800">{recentData.length > 0 ? recentData.length + "+" : 0}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-bold">Rata-rata Tertinggi</p>
                            <h3 className="text-2xl font-extrabold text-gray-800">
                                {pieData.length > 0 
                                    ? pieData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name 
                                    : "-"}
                            </h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-700">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-bold">Tren Bulan Ini</p>
                            <h3 className="text-2xl font-extrabold text-gray-800">Positif</h3>
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN 2: CHARTS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    
                    {/* Donut Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
                        <h3 className="font-bold text-lg mb-4 text-gray-700">Rata-rata Nilai per Mapel</h3>
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="90%">
                                <PieChart>
                                    <Pie 
                                        data={pieData} 
                                        cx="50%" cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">Belum ada data nilai tryout.</div>
                        )}
                    </div>

                    {/* Line Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
                        <h3 className="font-bold text-lg mb-4 text-gray-700">Aktivitas Ujian (6 Bulan Terakhir)</h3>
                        {lineData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="90%">
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Line 
                                        type="monotone" 
                                        dataKey="total_ujian" 
                                        stroke="#74151e" 
                                        strokeWidth={3} 
                                        dot={{r: 4}} 
                                        activeDot={{r: 6}} 
                                        name="Jml Peserta"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">Belum ada aktivitas.</div>
                        )}
                    </div>
                </div>

                {/* --- BAGIAN 3: TABEL AKTIVITAS TERAKHIR --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800">Riwayat Pengerjaan Siswa (Terbaru)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">Nama Siswa</th>
                                    <th className="px-6 py-4">Judul Tryout</th>
                                    <th className="px-6 py-4">Mapel</th>
                                    <th className="px-6 py-4 text-center">Nilai</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentData.length > 0 ? (
                                    recentData.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-700">{item.siswa}</td>
                                            <td className="px-6 py-4 text-gray-600">{item.tryout}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{item.mapel}</td>
                                            <td className="px-6 py-4 text-center font-bold">{item.score}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    item.status === 'Lulus' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-400">Belum ada data pengerjaan siswa.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default RekapGuru;