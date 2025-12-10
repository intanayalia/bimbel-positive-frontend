import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChevronDown, ChevronUp, Award } from 'lucide-react';
import NavigasiSiswa from '../common/navigasisiswa';
import api from '../../api';

const Rekap = () => {
  const [loading, setLoading] = useState(true);
  const [expandedSubject, setExpandedSubject] = useState(null);
  
  // Data Grafik (Default kosong)
  const [chartData, setChartData] = useState({ pie: [], line: [] });
  // Data Riwayat Detail
  const [subjectDetails, setSubjectDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data dari Backend: RekapController@index
        const response = await api.get('/rekap');
        
        // Backend mengirim struktur: { charts: { pie, line }, details: [...] }
        if(response.data) {
            setChartData(response.data.charts);
            setSubjectDetails(response.data.details);
        }
        setLoading(false);
      } catch (error) {
        console.error("Gagal load data rekap:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleAccordion = (id) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      <NavigasiSiswa />
      <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-red-900 mb-8">Rekapitulasi Hasil Belajar</h1>

        {loading ? (
             <div className="text-center py-20"><p className="animate-pulse">Mengambil statistik...</p></div>
        ) : (
            <>
                {/* GRAFIK */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Donut Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-6 text-gray-700 text-center">Rata-rata Nilai per Mapel</h3>
                        <div className="h-64">
                            {chartData.pie.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={chartData.pie} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {chartData.pie.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 italic">Belum ada data nilai.</div>
                            )}
                        </div>
                    </div>

                    {/* Line Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-6 text-gray-700 text-center">Grafik Kehadiran / Aktivitas</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData.line}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="hadir" stroke="#74151e" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Hadir" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* DETAIL NILAI (ACCORDION) */}
                <div className="space-y-4">
                    <h3 className="font-bold text-xl text-gray-800 mb-4">Riwayat Pengerjaan Tryout</h3>
                    {subjectDetails.length > 0 ? subjectDetails.map((subject) => (
                        <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <button onClick={() => toggleAccordion(subject.id)} className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-900 font-bold"><Award size={20}/></div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-gray-800">{subject.subject_name}</h4>
                                        <p className="text-xs text-gray-500">Rata-rata: <span className="font-bold text-green-600">{subject.average_score}</span></p>
                                    </div>
                                </div>
                                {expandedSubject === subject.id ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
                            </button>
                            
                            {expandedSubject === subject.id && (
                                <div className="px-6 pb-6 pt-2 bg-gray-50/50 border-t border-gray-100">
                                    <div className="space-y-3">
                                        {subject.history.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                                                <div>
                                                    <p className="font-bold text-sm text-gray-700">{item.topic}</p>
                                                    <p className="text-xs text-gray-400">{item.week}</p>
                                                </div>
                                                <span className="font-bold text-red-900 bg-red-50 px-3 py-1 rounded-md text-sm">{item.score}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">Belum ada riwayat tryout.</div>
                    )}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default Rekap;