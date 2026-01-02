import React, { useState, useEffect } from 'react';
import NavigasiAdmin from '../common/navigasiadmin';
import { Search, Trash2, Loader2, RefreshCcw } from 'lucide-react';
import api from '../../api'; // <--- PAKAI INI, JANGAN AXIOS BIASA

// Helper Format Rupiah
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const AdminPembayaran = () => {
  // STATE MANAGEMENT
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ success: 0, pending: 0, failed: 0, total_income: 0 });
  const [chartRange, setChartRange] = useState('Bulan Ini');

  // FETCH DATA
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // Panggil API Backend yang sudah diperbaiki
      // GET /api/admin/payments?range=Bulan Ini
      const response = await api.get('/admin/payments', {
        params: { range: chartRange }
      });

      setOrders(response.data.orders);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Gagal ambil data pembayaran:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [chartRange]); // Reload jika filter waktu berubah

  // HAPUS DATA
  const handleDelete = async (id) => {
    if(!window.confirm("Yakin hapus data ini?")) return;
    try {
        await api.post('/admin/payments/delete', { ids: [id] });
        fetchTransactions(); // Refresh data
    } catch (error) {
        alert("Gagal menghapus data.");
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FD] font-sans overflow-hidden">
      {/* Sidebar */}
      <NavigasiAdmin />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen relative ml-64 overflow-y-auto">
        <div className="p-8">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#67051a]">Riwayat Pembayaran</h1>
                    <p className="text-gray-500 text-sm">Pantau arus kas dan status transaksi siswa.</p>
                </div>
                <button onClick={fetchTransactions} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RefreshCcw size={18} className="text-gray-600"/>
                </button>
            </div>

            {/* Statistik Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Pemasukan" value={formatRupiah(stats.total_income)} color="bg-emerald-500" />
                <StatCard title="Berhasil" value={stats.success} color="bg-blue-500" />
                <StatCard title="Pending" value={stats.pending} color="bg-orange-500" />
                <StatCard title="Gagal" value={stats.failed} color="bg-red-500" />
            </div>

            {/* Tabel Transaksi */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Daftar Transaksi Terbaru</h3>
                    <select 
                        value={chartRange} 
                        onChange={(e) => setChartRange(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 focus:ring-red-900"
                    >
                        <option>Bulan Ini</option>
                        <option>Tahun Ini</option>
                    </select>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-4">ID Order</th>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Nama Siswa</th>
                                <th className="p-4">Paket</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center"><Loader2 className="animate-spin mx-auto"/></td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono font-medium text-gray-600">{order.id}</td>
                                        <td className="p-4 text-gray-600">{order.date}</td>
                                        <td className="p-4 font-bold text-gray-800">{order.name}</td>
                                        <td className="p-4 text-gray-600">{order.category}</td>
                                        <td className="p-4 font-bold text-[#67051a]">{formatRupiah(order.total)}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                                order.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                order.status === 'Dalam Proses' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                'bg-red-50 text-red-600 border-red-200'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => handleDelete(order.original_id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-400">Belum ada data transaksi.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Sub Component Stat Card
const StatCard = ({ title, value, color }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">{title}</p>
            <h3 className="text-2xl font-extrabold text-gray-800">{value}</h3>
        </div>
        <div className={`w-2 h-10 rounded-full ${color}`}></div>
    </div>
);

export default AdminPembayaran;