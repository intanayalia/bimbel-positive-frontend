import React, { useState, useEffect, useRef } from 'react';
import api from '../../api'; // <--- IMPORT PENTING (Menggantikan axios biasa)
import NavigasiAdmin from '../common/navigasiadmin';
import { Search, Bell, ChevronDown, Plus, MoreVertical, Loader2, Edit, Trash2, X } from 'lucide-react';

const AdminPaket = () => {
  // ==============================
  // 1. STATE MANAGEMENT
  // ==============================
  
  // UI States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Chart & Filter States
  const [chartTimeRange, setChartTimeRange] = useState('Bulan Ini');
  const [isChartFilterOpen, setIsChartFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('SEMUA'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [editId, setEditId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', desc: '', duration: '', price: '', discount: '', finalPrice: '', status: true
  });

  // Data States
  const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState({ bestSeller: { name: '-', count: 0 }, leastInterested: { name: '-', count: 0 } });
  const [packages, setPackages] = useState([]);

  // Refs
  const dropdownRef = useRef(null);

  // Helpers
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const calculateFinalPrice = (price, discount) => price - (price * (discount / 100));
  const filterOptions = ['SEMUA', 'SD', 'SMP', 'SMA', 'UTBK'];
  const chartFilterOptions = ['Bulan Ini', '3 Bulan', '6 Bulan', '1 Tahun'];

  // ==============================
  // 2. API INTEGRATION (MENGGUNAKAN 'api' INSTANCE)
  // ==============================

  useEffect(() => {
    fetchData();
  }, []); 

  // Simulasi refresh chart saat filter berubah
  useEffect(() => {
    fetchData(); 
  }, [chartTimeRange]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
        // 1. Ambil List Paket (Menggunakan 'api', tidak perlu header manual)
        // Endpoint relatif, base URL sudah diatur di file api.js
        const resPaket = await api.get('/admin/packages');
        
        // Mapping Data Backend -> Frontend
        const mappedData = resPaket.data.map(item => ({
            id: item.id,
            name: item.nama_paket,
            desc: item.deskripsi,
            duration: `${item.durasi} Bulan`,
            durationValue: item.durasi,
            price: parseFloat(item.harga),
            discount: item.diskon,
            status: item.status,
            category: item.kategori,
            terjual: item.terjual
        }));
        setPackages(mappedData);

        // 2. Ambil Data Chart
        const resChart = await api.get('/admin/packages-chart');
        if(resChart.data) {
            setChartData(resChart.data.chart);
            setSummaryData(resChart.data.summary);
        }

    } catch (error) {
        console.error("Gagal mengambil data:", error);
        // Error handling biasanya sudah dihandle oleh interceptor di api.js
        // Tapi kita bisa tambah alert manual jika perlu
    } finally {
        setIsLoading(false);
    }
  };

  // ==============================
  // 3. EVENT HANDLERS
  // ==============================

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.chart-dropdown-container')) setIsChartFilterOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newData = { ...prev, [name]: value };
        if (name === 'price' || name === 'discount') {
            const price = parseFloat(name === 'price' ? value : prev.price) || 0;
            const discount = parseFloat(name === 'discount' ? value : prev.discount) || 0;
            const final = price - (price * (discount / 100));
            newData.finalPrice = final >= 0 ? final : 0;
        }
        return newData;
    });
  };

  const resetForm = () => {
    setFormData({ name: '', desc: '', duration: '', price: '', discount: '', finalPrice: '', status: true });
    setEditId(null);
  };

  const openAddModal = () => { resetForm(); setModalMode('add'); setIsModalOpen(true); };

  const handleEdit = (id) => {
    const pkgToEdit = packages.find(p => p.id === id);
    if (pkgToEdit) {
        setFormData({
            name: pkgToEdit.name,
            desc: pkgToEdit.desc,
            duration: pkgToEdit.durationValue,
            price: pkgToEdit.price,
            discount: pkgToEdit.discount,
            finalPrice: calculateFinalPrice(pkgToEdit.price, pkgToEdit.discount),
            status: pkgToEdit.status === 'Aktif'
        });
        setModalMode('edit');
        setEditId(id);
        setIsModalOpen(true);
    }
    setActiveDropdown(null);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Yakin ingin menghapus paket ini?')) {
        try {
            await api.delete(`/admin/packages/${id}`);
            fetchData(); // Refresh tanpa reload page
            setActiveDropdown(null);
        } catch (error) {
            alert("Gagal menghapus data.");
        }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) return alert("Nama dan Harga wajib diisi!");
    
    // Auto-detect kategori
    let detectedCategory = 'Umum';
    const upperName = formData.name.toUpperCase();
    if (upperName.includes('SD')) detectedCategory = 'SD';
    else if (upperName.includes('SMP')) detectedCategory = 'SMP';
    else if (upperName.includes('SMA')) detectedCategory = 'SMA';
    else if (upperName.includes('UTBK')) detectedCategory = 'UTBK';

    const payload = {
        name: formData.name,
        desc: formData.desc,
        duration: formData.duration,
        price: formData.price,
        discount: formData.discount,
        status: formData.status ? 'Aktif' : 'Tidak Aktif',
        category: detectedCategory
    };

    try {
        if (modalMode === 'add') {
            await api.post('/admin/packages', payload);
        } else {
            await api.put(`/admin/packages/${editId}`, payload);
        }
        
        alert("Berhasil menyimpan data!");
        fetchData(); 
        setIsModalOpen(false);
        resetForm();
    } catch (error) {
        console.error("Save error:", error);
        alert("Gagal menyimpan data.");
    }
  };

  // Logic Grafik Scale
  const maxChartValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value), 1) : 10;
  const chartSteps = [0, Math.round(maxChartValue * 0.25), Math.round(maxChartValue * 0.5), Math.round(maxChartValue * 0.75), maxChartValue];

  // Filter Logic
  const getFilteredPackages = () => {
    if (filterCategory === 'SEMUA') return packages;
    return packages.filter(p => p.category === filterCategory);
  };
  const visiblePackages = getFilteredPackages();

  // ==============================
  // 4. RENDER UI
  // ==============================
  return (
    <div className={`flex bg-gray-50 min-h-screen font-sans ${isModalOpen ? 'overflow-hidden h-screen' : ''}`} onClick={() => isFilterOpen && setIsFilterOpen(false)}>
      <NavigasiAdmin />

      <div className="flex-1 ml-64 p-8 relative">
        
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-40 mb-8 bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700">Daftar Paket</h1>
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
                  <p className="text-sm font-bold text-gray-800">Nama Admin</p>
                  <p className="text-xs text-gray-500">Admin Utama</p>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-[60vh] text-[#67051a]"><Loader2 className="animate-spin" size={40} /></div>
        ) : (
          <div className="animate-in fade-in duration-500 space-y-6">
            
            {/* --- GRAFIK & SUMMARY --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* LEFT: CHART SECTION */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="font-bold text-gray-800">Jumlah Paket Terjual</h2>
                      <div className="relative chart-dropdown-container">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setIsChartFilterOpen(!isChartFilterOpen); }}
                            className="flex items-center gap-2 text-xs border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 bg-white transition-colors"
                          >
                              {chartTimeRange} <ChevronDown size={14} className={`transition-transform ${isChartFilterOpen ? 'rotate-180' : ''}`}/>
                          </button>
                          {isChartFilterOpen && (
                            <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                                {chartFilterOptions.map((opt) => (
                                    <button 
                                        key={opt} 
                                        onClick={() => { setChartTimeRange(opt); setIsChartFilterOpen(false); }} 
                                        className={`w-full text-left px-4 py-2 text-xs hover:bg-red-50 transition-colors ${chartTimeRange === opt ? 'text-[#67051a] font-bold bg-red-50' : 'text-gray-600'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                          )}
                      </div>
                  </div>

                  <div className="h-56 relative flex items-end justify-around px-2 pb-6 border-l border-b border-gray-200 ml-6">
                      <div className="absolute -left-8 inset-y-0 flex flex-col justify-between text-xs text-gray-400 pb-6">
                         {chartSteps.reverse().map((step, i) => <span key={i}>{step}</span>)}
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 z-0">
                         {chartSteps.map((_, i) => <div key={i} className="border-b border-dashed border-gray-100 w-full h-0"></div>)}
                      </div>
                      {chartData.map((item, idx) => {
                          const heightPercent = maxChartValue > 0 ? (item.value / maxChartValue) * 100 : 0;
                          return (
                            <div key={idx} className="flex flex-col items-center gap-3 z-10 w-12 group relative h-full justify-end">
                                <div className="w-8 bg-[#8B2D3F] rounded-t-md transition-all duration-700 relative hover:bg-[#67051a]" style={{ height: `${heightPercent}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {item.value} Terjual
                                    </div>
                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">{item.value}</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-600 absolute -bottom-6">{item.label}</span>
                            </div>
                          );
                      })}
                  </div>
              </div>

              {/* RIGHT: SUMMARY SECTION */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="font-bold text-gray-800 mb-4">Ringkasan Paket</h2>
                  <div className="border-b border-gray-100 pb-4 mb-4">
                      <div className="flex gap-4 text-xs mb-6">
                          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Paket aktif</div>
                          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Paket tidak aktif</div>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                      <div>
                          <div className="bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg inline-block mb-3">Paket Terlaris</div>
                          <p className="font-bold text-gray-800 text-sm">{summaryData.bestSeller?.name || '-'}</p>
                          <p className="text-xs text-gray-500 mt-1">Terjual : <span className="font-bold text-gray-800">{summaryData.bestSeller?.count || 0} siswa</span></p>
                      </div>
                      <div>
                          <div className="bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg inline-block mb-3">Paket Kurang Diminati</div>
                          <p className="font-bold text-gray-800 text-sm">{summaryData.leastInterested?.name || '-'}</p>
                          <p className="text-xs text-gray-500 mt-1">Terjual : <span className="font-bold text-gray-800">{summaryData.leastInterested?.count || 0} siswa</span></p>
                      </div>
                  </div>
              </div>
            </div>

            {/* --- TABEL DAFTAR PAKET --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="font-bold text-gray-800 text-lg">Daftar Paket</h2>
                        <p className="text-xs text-gray-400 mt-1">Kelola dan atur paket yang tersedia</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <button onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }} className="flex items-center gap-2 text-xs border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 font-medium bg-white">
                                {filterCategory === 'SEMUA' ? 'Urutkan' : filterCategory} <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}/>
                            </button>
                            {isFilterOpen && (
                                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                                    {filterOptions.map((opt) => (
                                        <button key={opt} onClick={() => { setFilterCategory(opt); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-red-50 transition-colors ${filterCategory === opt ? 'text-[#67051a] font-bold bg-red-50' : 'text-gray-600'}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={openAddModal} className="bg-[#67051a] hover:bg-[#520415] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors shadow-sm">
                            <Plus size={16} /> Tambah
                        </button>
                    </div>
                </div>

                <div className="overflow-visible">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                                <th className="py-4 px-4 font-semibold rounded-tl-lg">Nama Paket</th>
                                <th className="py-4 px-4 font-semibold">Deskripsi</th>
                                <th className="py-4 px-4 font-semibold">Durasi</th>
                                <th className="py-4 px-4 font-semibold">Harga</th>
                                <th className="py-4 px-4 font-semibold">Diskon (%)</th>
                                <th className="py-4 px-4 font-semibold">Harga Akhir</th>
                                <th className="py-4 px-4 font-semibold text-center">Status</th>
                                <th className="py-4 px-4 font-semibold text-center rounded-tr-lg">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {visiblePackages.length > 0 ? (
                                visiblePackages.map((pkg, idx) => {
                                    const finalPrice = calculateFinalPrice(pkg.price, pkg.discount);
                                    return (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                            <td className="py-4 px-4 font-medium text-gray-800">{pkg.name}</td>
                                            <td className="py-4 px-4 text-gray-500 text-xs max-w-[200px] truncate">{pkg.desc}</td>
                                            <td className="py-4 px-4 text-gray-600 text-xs">{pkg.duration}</td>
                                            <td className="py-4 px-4 text-gray-600 font-medium text-xs">{formatRupiah(pkg.price)}</td>
                                            <td className="py-4 px-4 text-gray-600 text-xs pl-8">{pkg.discount}</td>
                                            <td className="py-4 px-4 text-gray-800 font-bold text-xs">{formatRupiah(finalPrice)}</td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${pkg.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                                    {pkg.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center relative">
                                                <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === pkg.id ? null : pkg.id); }} className={`p-1 rounded-full transition-colors ${activeDropdown === pkg.id ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                                                    <MoreVertical size={16} />
                                                </button>
                                                {activeDropdown === pkg.id && (
                                                    <div ref={dropdownRef} className="absolute right-8 top-8 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 origin-top-right">
                                                        <div className="py-1">
                                                            <button onClick={() => handleEdit(pkg.id)} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-[#67051a] flex items-center gap-2"><Edit size={14} /> Edit</button>
                                                            <button onClick={() => handleDelete(pkg.id)} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} /> Hapus</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="8" className="text-center py-8 text-gray-400 text-sm">Tidak ada paket ditemukan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

          </div>
        )}

        {/* MODAL (Sama persis dengan kode sebelumnya) */}
        {isModalOpen && (
            <>
                <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all scale-100 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">{modalMode === 'add' ? 'Tambah Paket Baru' : `Edit Paket ${formData.name}`}</h2> 
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-8 overflow-y-auto space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Paket</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Contoh: Reguler SMP Kelas 8" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#67051a]/20 focus:border-[#67051a] text-sm transition-all"/>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                                <textarea name="desc" value={formData.desc} onChange={handleInputChange} rows="4" placeholder="Tulis deskripsi paket disini..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#67051a]/20 focus:border-[#67051a] text-sm transition-all resize-none"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Durasi</label>
                                    <div className="relative">
                                        <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full pl-4 pr-16 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#67051a]/20 focus:border-[#67051a] text-sm"/>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">Bulan</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Diskon</label>
                                    <div className="relative">
                                        <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full pl-4 pr-16 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#67051a]/20 focus:border-[#67051a] text-sm"/>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">Persen</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Harga</label>
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Rp 0" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#67051a]/20 focus:border-[#67051a] text-sm mb-4"/>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Harga Akhir</label>
                                <input type="text" value={formData.finalPrice ? formatRupiah(formData.finalPrice) : ''} readOnly className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 text-sm cursor-not-allowed font-semibold"/>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <div className="flex items-center gap-3">
                                    <div onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))} className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.status ? 'bg-[#67051a]' : 'bg-gray-300'}`}>
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.status ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className={`text-sm font-medium ${formData.status ? 'text-[#67051a]' : 'text-gray-400'}`}>{formData.status ? 'Aktif' : 'Tidak Aktif'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
                            {modalMode === 'add' ? (
                                <>
                                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg border border-[#67051a] text-[#67051a] text-sm font-semibold hover:bg-red-50 transition-colors">Tutup</button>
                                    <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-[#67051a] text-white text-sm font-semibold hover:bg-[#520415] shadow-md transition-transform active:scale-95">Simpan</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleDelete(editId)} className="px-6 py-2.5 rounded-lg border border-red-600 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">Hapus</button>
                                    <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-[#9e1c37] text-white text-sm font-semibold hover:bg-[#801b30] shadow-md transition-transform active:scale-95">Simpan Perubahan</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )}

      </div>
    </div>
  );
};

export default AdminPaket;