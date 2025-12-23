import React, { useState, useEffect, useRef } from 'react';
import NavigasiAdmin from '../common/navigasiadmin';
import api from '../../api'; // Pastikan path ini benar
import { Search, Bell, Plus, MoreVertical, X, Eye, EyeOff, Upload, Trash2, Edit2, ChevronDown, Loader2, MinusCircle } from 'lucide-react';

const AdminPengguna = () => {
  // ==============================
  // 1. STATE MANAGEMENT
  // ==============================
  
  // --- Data dari API ---
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // --- UI State ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [activeModal, setActiveModal] = useState(null); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // --- Form State (Gabungan User & Kelas) ---
  const [formData, setFormData] = useState({
    // Field User
    name: '', email: '', password: '', role: '',
    // Field Kelas
    title: '', mentor: '', schedule: '', description: '',
    jenjang: 'SMA', tingkat: 10, kapasitas: 30, durasi: 90
  });

  // --- State Khusus Upload Gambar Kelas ---
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // --- State Khusus Edit Siswa (Daftar ID Kelas yang diikuti) ---
  const [userCourses, setUserCourses] = useState([]); 

  const dropdownRef = useRef(null);

  // ==============================
  // 2. API INTEGRATION
  // ==============================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const [resGuru, resSiswa, resKelas] = await Promise.all([
            api.get('/admin/teachers'),
            api.get('/admin/students'),
            api.get('/admin/courses')
        ]);

        setTeachers(resGuru.data);
        setStudents(resSiswa.data);
        setCourses(resKelas.data);
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    } finally {
        setIsLoading(false);
    }
  };

  // ==============================
  // 3. HANDLERS & LOGIC
  // ==============================

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id) => setOpenDropdownId(openDropdownId === id ? null : id);

  // --- MODAL HANDLERS ---
  const openAddModal = (type) => {
    setSelectedItem(null);
    setActiveModal(type);
    setOpenDropdownId(null);
    setImageFile(null);
    setPreviewImage(null);
    setUserCourses([]); // Reset pilihan kelas siswa
    
    // Reset Form ke Default
    setFormData({ 
        name: '', email: '', password: '', role: '',
        title: '', mentor: '', schedule: '', description: '',
        jenjang: 'SMA', tingkat: 10, kapasitas: 30, durasi: 90
    });
  };

  const openEditModal = (item, type) => {
    setSelectedItem(item);
    setActiveModal(type);
    setOpenDropdownId(null);
    setImageFile(null);
    setPreviewImage(null);
    
    // 1. Jika Edit KELAS
    if (type.includes('CLASS')) {
        setPreviewImage(item.image);
        setFormData({
            title: item.title,
            mentor: item.mentor,
            schedule: item.schedule,
            description: item.description,
            jenjang: item.jenjang || 'SMA',
            tingkat: item.tingkat || 10,
            kapasitas: item.kapasitas || 30,
            durasi: item.durasi || 90
        });
    } 
    // 2. Jika Edit USER (Guru/Siswa)
    else {
        setFormData({
            name: item.name,
            email: item.email,
            role: item.role
        });

        // Khusus Edit SISWA: Ambil data kelas yang sudah diambil dari Backend
        if (item.role === 'student') {
            if (item.courses && item.courses.length > 0) {
                // Map object courses menjadi array ID: [1, 5, 8]
                setUserCourses(item.courses.map(c => c.id));
            } else {
                setUserCourses([]);
            }
        }
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
    setShowPassword(false);
  };

  // --- INPUT HANDLERS ---
  const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setImageFile(file);
          setPreviewImage(URL.createObjectURL(file));
      }
  };

  // --- LOGIC DAFTAR KELAS SISWA ---
  // Ganti kelas di dropdown tertentu
  const handleUserCourseChange = (index, newCourseId) => {
      const updatedCourses = [...userCourses];
      updatedCourses[index] = parseInt(newCourseId); 
      setUserCourses(updatedCourses);
  };

  // Tambah slot dropdown baru (Default ambil course pertama yg tersedia)
  const handleAddCourseSlot = () => {
      if (courses.length > 0) {
          setUserCourses([...userCourses, courses[0].id]);
      } else {
          alert("Tidak ada kelas yang tersedia untuk dipilih.");
      }
  };

  // Hapus slot dropdown
  const handleRemoveCourseSlot = (index) => {
      const updatedCourses = userCourses.filter((_, i) => i !== index);
      setUserCourses(updatedCourses);
  };

  // --- SAVE DATA (CREATE / UPDATE) ---
  const handleSave = async () => {
      setIsSubmitting(true);
      try {
          // A. SIMPAN KELAS (Pakai FormData untuk File Upload)
          if (activeModal.includes('CLASS')) {
              const data = new FormData();
              data.append('title', formData.title);
              data.append('mentor', formData.mentor);
              data.append('schedule', formData.schedule);
              data.append('description', formData.description);
              data.append('jenjang', formData.jenjang);
              data.append('tingkat', formData.tingkat);
              data.append('kapasitas', formData.kapasitas);
              data.append('durasi', formData.durasi);
              
              if (imageFile) {
                  data.append('image', imageFile);
              }

              const config = { headers: { 'Content-Type': 'multipart/form-data' } };

              if (selectedItem) {
                  data.append('_method', 'PUT'); // Method spoofing untuk Laravel
                  await api.post(`/admin/courses/${selectedItem.id}`, data, config);
              } else {
                  await api.post('/admin/courses', data, config);
              }
          } 
          // B. SIMPAN USER (JSON)
          else {
              let role = '';
              if (activeModal === 'ADD_TEACHER' || (selectedItem && selectedItem.role === 'guru')) role = 'guru';
              if (activeModal === 'ADD_STUDENT' || (selectedItem && selectedItem.role === 'student')) role = 'student';

              const payload = { 
                  name: formData.name, 
                  email: formData.email, 
                  role: role 
              };
              
              if (formData.password) payload.password = formData.password;

              // KIRIM ARRAY ID KELAS KE BACKEND (Khusus Siswa)
              if (role === 'student') {
                  payload.course_ids = userCourses;
              }

              if (selectedItem) {
                  await api.put(`/admin/users/${selectedItem.id}`, payload);
              } else {
                  await api.post('/admin/users', payload);
              }
          }

          alert("Data berhasil disimpan!");
          closeModal();
          fetchData(); // Refresh data

      } catch (error) {
          console.error("Error saving:", error);
          alert("Gagal menyimpan data. Pastikan input valid.");
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- DELETE DATA ---
  const handleDelete = async (id, type) => {
      if(!window.confirm("Yakin ingin menghapus data ini?")) return;
      try {
          const endpoint = type === 'course' ? `/admin/courses/${id}` : `/admin/users/${id}`;
          await api.delete(endpoint);
          fetchData();
      } catch (error) {
          alert("Gagal menghapus data.");
      }
  };

  // ==============================
  // 4. RENDER MODAL CONTENT
  // ==============================

  const renderModalContent = () => {
    if (!activeModal) return null;
    const isEdit = activeModal.includes('EDIT');
    const isClass = activeModal.includes('CLASS');
    
    // --- FORM KELAS ---
    if (isClass) {
      return (
        <>
          <h2 className="text-xl font-bold text-[#67051a] mb-6">{isEdit ? 'Edit Kelas' : 'Tambah Kelas'}</h2>
          
          <div className="space-y-4">
            {/* Upload Foto */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                {previewImage ? (
                    <div className="relative h-40 w-full">
                         <img src={previewImage} alt="Preview" className="h-full w-full object-contain rounded-md" />
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                             <p className="text-white text-xs font-bold">Ganti Foto</p>
                         </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                        <Upload size={32} className="mb-2" />
                        <span className="text-sm font-medium">Upload Foto Kelas</span>
                        <span className="text-xs">Max 2MB</span>
                    </div>
                )}
            </div>

            {/* Input Fields Kelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67051a] focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pengajar (Mentor)</label>
              <div className="relative">
                <select name="mentor" value={formData.mentor} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#67051a] focus:outline-none">
                  <option value="">Pilih Pengajar</option>
                  {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenjang</label>
                  <select name="jenjang" value={formData.jenjang} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#67051a] focus:outline-none">
                      <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option><option value="UTBK">UTBK</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat</label>
                  <select name="tingkat" value={formData.tingkat} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#67051a] focus:outline-none">
                      {[...Array(12)].map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                  <input type="number" name="kapasitas" value={formData.kapasitas} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Menit)</label>
                  <input type="number" name="durasi" value={formData.durasi} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none" />
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal</label>
              <input type="text" name="schedule" value={formData.schedule} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67051a] focus:outline-none" placeholder="Contoh: Senin, 14:00" />
            </div>
            
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#67051a] focus:outline-none" rows="2"></textarea>
            </div>
          </div>
        </>
      );
    }

    // --- FORM USER (PENGAJAR & SISWA) ---
    const isStudentEdit = (isEdit || activeModal === 'ADD_STUDENT') && (!selectedItem || selectedItem?.role === 'student') && activeModal !== 'ADD_TEACHER';

    return (
      <>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#67051a]">
              {isEdit ? 'Edit User' : activeModal === 'ADD_TEACHER' ? 'Tambah Pengajar' : 'Tambah Siswa'}
            </h2>
        </div>
        
        <div className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#67051a] focus:outline-none transition-all" placeholder="Nama Lengkap"/>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#67051a] focus:outline-none transition-all" placeholder="email@domain.com"/>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#67051a] focus:outline-none transition-all" placeholder={isEdit ? "••••• (Biarkan kosong jika tetap)" : "Minimal 6 karakter"}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
            </div>
          </div>

          {/* --- BAGIAN KHUSUS SISWA: DAFTAR KELAS --- */}
          {isStudentEdit && (
             <div className="pt-2 border-t border-gray-100 mt-4">
                <label className="block text-sm font-bold text-gray-800 mb-3">Daftar Kelas yang Diambil</label>
                
                {userCourses.length === 0 && (
                    <p className="text-xs text-gray-400 mb-3 italic">Belum ada kelas yang dipilih.</p>
                )}

                <div className="space-y-3">
                    {userCourses.map((courseId, index) => (
                        <div key={index} className="flex gap-2 items-center">
                             <div className="relative flex-1 group">
                                 <select 
                                    value={courseId} 
                                    onChange={(e) => handleUserCourseChange(index, e.target.value)} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-600 appearance-none focus:ring-2 focus:ring-[#67051a] focus:outline-none hover:border-[#67051a] transition-colors cursor-pointer"
                                 >
                                   <option value="" disabled>Pilih Kelas</option>
                                   {courses.map(option => (
                                       <option key={option.id} value={option.id}>{option.title} ({option.jenjang}-{option.tingkat})</option>
                                   ))}
                                 </select>
                                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#67051a] transition-colors" size={18}/>
                             </div>
                             <button onClick={() => handleRemoveCourseSlot(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Kelas">
                                <MinusCircle size={20} />
                             </button>
                        </div>
                    ))}

                    <button 
                        onClick={handleAddCourseSlot} 
                        className="text-sm text-[#67051a] font-semibold hover:bg-red-50 px-3 py-2 rounded-lg flex items-center gap-2 mt-2 transition-colors border border-transparent hover:border-red-100"
                    >
                        <Plus size={16}/> Tambah Kelas Lain
                    </button>
                </div>
             </div>
          )}
        </div>
      </>
    );
  };

  // ==============================
  // 5. RENDER UI UTAMA
  // ==============================
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <NavigasiAdmin />
      <div className="flex-1 ml-64 p-8 relative">
        
        {/* HEADER */}
        <header className="sticky top-0 z-30 mb-8 bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-700">Pengguna & Kelas</h1>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
                    <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-10 h-10 rounded-full" />
                    <div className="hidden md:block">
                      <p className="text-sm font-bold text-gray-800">Admin Utama</p>
                    </div>
                </div>
            </div>
        </header>

        {isLoading ? (
            <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-[#67051a]" size={40} /></div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* --- SECTION 1: LIST PENGAJAR --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-gray-800 text-lg">Kelola Pengajar</h2>
                    <button onClick={() => openAddModal('ADD_TEACHER')} className="bg-[#67051a] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-[#8a0a24]"><Plus size={16} /> Tambah</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                    {teachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center p-3 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                           <img src={`https://i.pravatar.cc/150?u=${teacher.id}`} className="w-10 h-10 rounded-full mr-3 object-cover" />
                           <div className="overflow-hidden flex-1">
                               <h3 className="text-sm font-bold text-gray-800 truncate">{teacher.name}</h3>
                               <p className="text-[10px] text-gray-500 truncate">{teacher.email}</p>
                           </div>
                           <div className="relative">
                               <button onClick={() => toggleDropdown(`teacher-${teacher.id}`)} className="p-1 text-gray-400 hover:text-gray-600 rounded-full"><MoreVertical size={16} /></button>
                               {openDropdownId === `teacher-${teacher.id}` && (
                                   <div ref={dropdownRef} className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border z-10 overflow-hidden">
                                       <button onClick={() => openEditModal(teacher, 'EDIT_USER')} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"><Edit2 size={12}/> Edit</button>
                                       <button onClick={() => handleDelete(teacher.id, 'user')} className="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 flex items-center gap-2"><Trash2 size={12}/> Hapus</button>
                                   </div>
                               )}
                           </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SECTION 2: LIST KELAS --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-gray-800 text-lg">Daftar Kelas</h2>
                    <button onClick={() => openAddModal('ADD_CLASS')} className="bg-[#67051a] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-[#8a0a24]"><Plus size={16} /> Tambah</button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {courses.map((course) => (
                        <div key={course.id} className="flex border border-gray-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                             <div className="w-24 bg-gray-100 relative flex-shrink-0">
                                 <img 
                                    src={course.image && course.image.startsWith('http') ? course.image : `http://127.0.0.1:8000${course.image}`} 
                                    alt="Kelas" className="w-full h-full object-cover" 
                                    onError={(e) => {e.target.src = "https://via.placeholder.com/150?text=No+Image"}}
                                 />
                             </div>
                             <div className="p-3 flex-1 flex flex-col justify-center relative">
                                 <div className="absolute top-2 right-2">
                                     <button onClick={() => toggleDropdown(`course-${course.id}`)} className="p-1 text-gray-400 hover:text-gray-600 rounded-full"><MoreVertical size={16} /></button>
                                     {openDropdownId === `course-${course.id}` && (
                                       <div ref={dropdownRef} className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border z-10 overflow-hidden">
                                           <button onClick={() => openEditModal(course, 'EDIT_CLASS')} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"><Edit2 size={12}/> Edit</button>
                                           <button onClick={() => handleDelete(course.id, 'course')} className="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 flex items-center gap-2"><Trash2 size={12}/> Hapus</button>
                                       </div>
                                     )}
                                 </div>
                                 <h3 className="font-bold text-gray-800 text-sm mb-1">{course.title}</h3>
                                 <div className="space-y-1">
                                     <p className="text-[10px] text-gray-500">Mentor: {course.mentor}</p>
                                     <p className="text-[10px] text-gray-500">{course.tingkat} {course.jenjang} | {course.kapasitas} Siswa</p>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SECTION 3: LIST SISWA --- */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-gray-800 text-lg">Kelola Siswa</h2>
                    <button onClick={() => openAddModal('ADD_STUDENT')} className="bg-[#67051a] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-[#8a0a24]"><Plus size={16} /> Tambah</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {students.map((student) => (
                        <div key={student.id} className="flex items-center p-3 border border-gray-100 rounded-xl bg-gray-50/50 relative group">
                           <img src={`https://i.pravatar.cc/150?u=${student.id + 50}`} className="w-10 h-10 rounded-full mr-3 object-cover" />
                           <div className="overflow-hidden flex-1">
                               <h3 className="text-sm font-bold text-gray-800 truncate">{student.name}</h3>
                               <p className="text-[10px] text-gray-500 truncate">{student.email}</p>
                           </div>
                           <div className="relative">
                               <button onClick={() => toggleDropdown(`student-${student.id}`)} className="p-1 text-gray-400 hover:text-gray-600 rounded-full"><MoreVertical size={16} /></button>
                               {openDropdownId === `student-${student.id}` && (
                                   <div ref={dropdownRef} className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border z-10 overflow-hidden">
                                       <button onClick={() => openEditModal(student, 'EDIT_USER')} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"><Edit2 size={12}/> Edit</button>
                                       <button onClick={() => handleDelete(student.id, 'user')} className="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 flex items-center gap-2"><Trash2 size={12}/> Hapus</button>
                                   </div>
                               )}
                           </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
        )}

        {/* MODAL WRAPPER */}
        {activeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl transform scale-100 transition-all max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end mb-2">
                        <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-100 text-gray-400"><X size={20} /></button>
                    </div>
                    
                    {/* ISI MODAL */}
                    {renderModalContent()}
                    
                    {/* FOOTER MODAL (Tombol Simpan) */}
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                        <button 
                            onClick={closeModal} 
                            className="px-8 py-2.5 border border-[#67051a] text-[#67051a] rounded-lg text-sm font-bold hover:bg-red-50 transition-all"
                        >
                            Tutup
                        </button>
                        <button 
                            onClick={handleSave} 
                            disabled={isSubmitting} 
                            className="px-8 py-2.5 bg-[#67051a] text-white rounded-lg text-sm font-bold hover:bg-[#8a0a24] shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Menyimpan...' : (activeModal.includes('EDIT') ? 'Simpan Perubahan' : 'Simpan')}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPengguna;