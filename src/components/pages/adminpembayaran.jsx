import React, { useState, useEffect } from 'react';
import NavigasiAdmin from '../common/navigasiadmin';
import { Search, Bell, ChevronDown, Trash2 } from 'lucide-react';
import axios from 'axios'; // Pastikan axios sudah diinstall

const AdminPembayaran = () => {
  // ==============================
  // 1. STATE MANAGEMENT
  // ==============================
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // State Data (Awalnya kosong, diisi dari API)
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    success: 0,
    pending: 0,
    failed: 0,
    total_income: 0
  });

  const [selectedIds, setSelectedIds] = useState([]); // Menyimpan original_id (bukan string SNV)
  const [chartRange, setChartRange] = useState('Bulan Ini');
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false);

  // ==============================
  // 2. FETCH DATA FROM API
  // ==============================
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token'); // Asumsi token disimpan di localStorage
      // Sesuaikan URL dengan route API Anda
      const response = await axios.get(`http://localhost:8000/api/admin/payments?range=${chartRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(response.data.orders);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Panggil API saat komponen diload atau filter waktu berubah
  useEffect(() => {
    fetchTransactions();
  }, [chartRange]);

  // ==============================
  // 3. HANDLERS
  // ==============================

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const handleCheckboxChange = (originalId) => {
    setSelectedIds(prev => {
      if (prev.includes(originalId)) {
        return prev.filter(item => item !== originalId);
      } else {
        return [...prev, originalId];
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Pilih minimal satu pesanan untuk dihapus.");
      return;
    }

    const confirmMessage = selectedIds.length === 1 
      ? "Yakin ingin menghapus pesanan ini?" 
      : `Yakin ingin menghapus ${selectedIds.length} pesanan yang dipilih?`;

    if (window.confirm(confirmMessage)) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8000/api/admin/payments/delete', 
          { ids: selectedIds }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Refresh data setelah hapus
        fetchTransactions();
        setSelectedIds([]);
        alert("Data berhasil dihapus");
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Gagal menghapus data");
      }
    }
  };

  // ==============================
  // 4. RENDER UI (TIDAK BERUBAH SECARA STRUKTUR)
  // ==============================
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans" onClick={() => isChartDropdownOpen && setIsChartDropdownOpen(false)}>
      <NavigasiAdmin />

      <div className="flex-1 ml-64 p-8 relative">
        
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-40 mb-8 bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700">Pembayaran</h1>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#67051a] w-64 transition-all"/>
            </div>
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><Bell size={20} className="text-gray-600" /></button>
            <div className="relative">
              <div className="flex items-center gap-3 border-l pl-6 border-gray-200 cursor-pointer select-none" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-gray-800">Admin</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in duration-500 space-y-6">
            
            {/* --- TOP STATISTICS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Grafik Batang Simple (Dinamis dari Stats) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-6">Progres Transaksi Paket</h2>
                    {isLoading ? <p className="text-center text-gray-400">Memuat data...</p> : (
                    <div className="h-48 flex items-end justify-around px-4 border-b border-gray-200 relative">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0">
                             {[0, 1, 2, 3].map(i => <div key={i} className="border-b border-dashed border-gray-100 w-full h-[25%] last:border-0"></div>)}
                        </div>
                        
                        {/* Bar: Sudah Dibayar */}
                        <div className="flex flex-col items-center gap-2 z-10 w-16">
                             {/* Tinggi bar disesuaikan secara kasar dengan persentase atau fixed untuk UI */}
                             <div style={{height: stats.success > 0 ? '8rem' : '1rem'}} className="w-12 bg-emerald-50 border border-emerald-100 rounded-t-lg relative flex items-center justify-center group hover:bg-emerald-100 transition-all duration-500">
                                <span className="text-xs font-bold text-emerald-600">{stats.success}</span>
                             </div>
                             <span className="text-[10px] text-gray-500">Sudah Dibayar</span>
                        </div>
                        {/* Bar: Dalam Proses */}
                        <div className="flex flex-col items-center gap-2 z-10 w-16">
                             <div style={{height: stats.pending > 0 ? '4rem' : '1rem'}} className="w-12 bg-yellow-50 border border-yellow-100 rounded-t-lg relative flex items-center justify-center group hover:bg-yellow-100 transition-all duration-500">
                                <span className="text-xs font-bold text-yellow-600">{stats.pending}</span>
                             </div>
                             <span className="text-[10px] text-gray-500">Dalam Proses</span>
                        </div>
                         {/* Bar: Gagal */}
                         <div className="flex flex-col items-center gap-2 z-10 w-16">
                             <div style={{height: stats.failed > 0 ? '3rem' : '1rem'}} className="w-12 bg-red-50 border border-red-100 rounded-t-lg relative flex items-center justify-center group hover:bg-red-100 transition-all duration-500">
                                <span className="text-xs font-bold text-red-600">{stats.failed}</span>
                             </div>
                             <span className="text-[10px] text-gray-500">Gagal</span>
                        </div>
                    </div>
                    )}
                </div>

                {/* Total Transaksi Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                             {/* Total Dinamis */}
                             <h2 className="text-2xl font-bold text-[#67051a]">
                                {isLoading ? '...' : formatRupiah(stats.total_income)}
                             </h2>
                             <p className="font-semibold text-gray-700 text-sm">Total Transaksi</p>
                             <p className="text-xs text-gray-400 mt-1">Pantau total transaksi di rentang waktu yang kamu pilih</p>
                        </div>
                        <div className="relative">
                            <button 
                                onClick={(e) => {e.stopPropagation(); setIsChartDropdownOpen(!isChartDropdownOpen)}} 
                                className="flex items-center gap-2 text-xs border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 bg-white"
                            >
                                {chartRange} <ChevronDown size={14}/>
                            </button>
                            {isChartDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    {['Bulan Ini', 'Tahun Ini'].map(opt => (
                                        <button key={opt} onClick={() => {setChartRange(opt); setIsChartDropdownOpen(false)}} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-600">{opt}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bars (Static dulu karena logic mingguan kompleks, bisa diupdate nanti) */}
                    <div className="mt-auto space-y-4 pt-4 opacity-50 grayscale">
                        {/* Note: Bagian ini saya buat semi-transparent karena butuh logic agregasi mingguan yang kompleks di Backend. 
                            Untuk saat ini biarkan statis atau hubungkan nanti jika perlu detail per minggu */}
                        {[
                            { label: 'Minggu ke 1', val: 'Rp -', width: '20%' },
                            { label: 'Minggu ke 2', val: 'Rp -', width: '20%' },
                            { label: 'Minggu ke 3', val: 'Rp -', width: '20%' },
                            { label: 'Minggu ke 4', val: 'Rp -', width: '20%' },
                        ].map((item, idx) => (
                             <div key={idx} className="flex items-center gap-4 text-xs">
                                 <span className="w-20 text-gray-600 font-medium">{item.label}</span>
                                 <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                                     <div className="absolute top-0 left-0 h-full bg-[#E8D6D9] rounded-full flex items-center justify-end pr-3" style={{ width: item.width }}>
                                         <span className="font-bold text-[#67051a]">{item.val}</span>
                                     </div>
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- TABEL PESANAN --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-gray-800 text-lg">Pesanan Terbaru</h2>
                    
                    <button 
                        onClick={handleDeleteSelected}
                        disabled={selectedIds.length === 0}
                        className={`p-2 rounded-lg border transition-all duration-200 ${
                            selectedIds.length > 0 
                            ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 shadow-sm cursor-pointer' 
                            : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                        }`}
                        title="Hapus Pesanan Terpilih"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                                <th className="py-4 px-4 w-12 text-center rounded-tl-lg"></th> 
                                <th className="py-4 px-4 font-semibold">ID Pesanan</th>
                                <th className="py-4 px-4 font-semibold">Tanggal</th>
                                <th className="py-4 px-4 font-semibold">Nama</th>
                                <th className="py-4 px-4 font-semibold">Kategori</th>
                                <th className="py-4 px-4 font-semibold">Total</th>
                                <th className="py-4 px-4 font-semibold">Metode</th>
                                <th className="py-4 px-4 font-semibold text-center rounded-tr-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan="8" className="text-center py-8">Loading data...</td></tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(order.original_id) ? 'bg-red-50/30' : ''}`}>
                                        
                                        <td className="py-4 px-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.includes(order.original_id)}
                                                onChange={() => handleCheckboxChange(order.original_id)}
                                                className="w-4 h-4 rounded border-gray-300 text-[#67051a] focus:ring-[#67051a] cursor-pointer accent-[#67051a]"
                                            />
                                        </td>

                                        <td className="py-4 px-4 font-medium text-gray-800">{order.id}</td>
                                        <td className="py-4 px-4 text-gray-500 text-xs">{order.date}</td>
                                        <td className="py-4 px-4 font-bold text-gray-800">{order.name}</td>
                                        <td className="py-4 px-4 text-gray-500 text-xs">{order.category}</td>
                                        <td className="py-4 px-4 font-bold text-gray-800">{formatRupiah(order.total)}</td>
                                        <td className="py-4 px-4 text-gray-500 text-xs">{order.method}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-semibold border 
                                                ${order.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                                  order.status === 'Dalam Proses' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                                                  'bg-red-50 text-red-600 border-red-200'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-gray-400 text-sm">Belum ada data pesanan.</td>
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

export default AdminPembayaran;