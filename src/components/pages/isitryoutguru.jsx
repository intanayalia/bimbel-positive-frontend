import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2, Save, CheckCircle, ArrowLeft, Clock, Calendar, AlertCircle } from 'lucide-react';
import NavigasiGuru from '../common/navigasiguru'; 
import api from '../../api'; // Import API

const IsiTryoutGuru = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil Data dari Navigate (dikirim dari TryoutGuru.jsx)
  const { mode, tryoutData, receivedTitle, receivedSubject } = location.state || {};

  // Default Template Soal Kosong
  const defaultQuestion = {
    id: Date.now(), // ID Sementara (Timestamp) untuk penanda frontend
    text: '',
    explanation: '',
    options: [
      { label: 'A', text: '', isCorrect: false },
      { label: 'B', text: '', isCorrect: false },
      { label: 'C', text: '', isCorrect: false },
      { label: 'D', text: '', isCorrect: false },
      { label: 'E', text: '', isCorrect: false },
    ]
  };

  // --- STATE ---
  const [displayTitle, setDisplayTitle] = useState('');
  const [displaySubject, setDisplaySubject] = useState('');
  const [duration, setDuration] = useState(60); 
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  
  const [questions, setQuestions] = useState([defaultQuestion]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- EFEK: LOAD DATA (EDIT MODE) ---
  useEffect(() => {
    if (mode === 'edit' && tryoutData) {
      // Isi Form Header
      setDisplayTitle(tryoutData.title);
      setDisplaySubject(tryoutData.subject);
      setDuration(tryoutData.duration);
      setOpenTime(tryoutData.start_time || '');
      setCloseTime(tryoutData.end_time || '');
      
      // Mapping Soal dari Database ke Frontend
      if (tryoutData.questions && tryoutData.questions.length > 0) {
        const mappedQuestions = tryoutData.questions.map(q => ({
            id: q.id, // ID Asli Database (Angka kecil/UUID)
            text: q.question_text,
            explanation: q.explanation,
            options: q.options.map((opt, idx) => ({
                label: String.fromCharCode(65 + idx), // 0->A, 1->B
                text: opt.option_text,
                isCorrect: opt.is_correct === 1 // Konversi 1 (int) ke true (bool)
            }))
        }));
        setQuestions(mappedQuestions);
      }
    } else if (receivedTitle) {
      // Mode Buat Baru (Data dari Modal sebelumnya)
      setDisplayTitle(receivedTitle);
      setDisplaySubject(receivedSubject);
    }
  }, [mode, tryoutData, receivedTitle, receivedSubject]);

  // --- HANDLERS ---

  const handleAddQuestion = () => {
    // Tambah soal baru dengan ID timestamp (sebagai penanda ini soal baru)
    setQuestions([...questions, { ...defaultQuestion, id: Date.now() }]);
    
    // Scroll ke bawah otomatis
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length === 1) return alert("Minimal harus ada satu soal.");
    if (window.confirm("Hapus soal ini? (Jika soal sudah tersimpan di database, perubahan akan efektif setelah disimpan)")) {
        setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value; 
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = value;
    setQuestions(updated);
  };

  const handleSetKey = (qIndex, optIndex) => {
    const updated = [...questions];
    // Reset semua opsi di soal ini jadi false
    updated[qIndex].options.forEach(opt => opt.isCorrect = false);
    // Set yang dipilih jadi true
    updated[qIndex].options[optIndex].isCorrect = true;
    setQuestions(updated);
  };

  // --- LOGIKA SIMPAN UTAMA ---
  const handleSubmit = async () => {
    const tryoutId = tryoutData?.id;
    if (!tryoutId) {
        alert("Error: ID Tryout hilang. Silakan kembali ke menu utama.");
        return navigate('/tryout-guru');
    }

    // 1. Validasi Input Soal
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.text) return alert(`Soal No. ${i + 1} teks pertanyaannya masih kosong.`);
        if (!q.options.some(o => o.isCorrect)) return alert(`Soal No. ${i + 1} belum dipilih kunci jawabannya.`);
        if (q.options.some(o => !o.text)) return alert(`Soal No. ${i + 1} ada pilihan jawaban yang kosong.`);
    }

    setIsSubmitting(true);

    try {
        // A. UPDATE HEADER TRYOUT (PUT)
        // Kita update judul, mapel, durasi, waktu buka/tutup
        await api.put(`/teacher/tryouts/${tryoutId}`, {
            title: displayTitle,
            subject: displaySubject,
            duration: duration,
            start_time: openTime,
            end_time: closeTime
        });

        // B. SIMPAN SOAL BARU (POST)
        // Filter soal yang ID-nya panjang (Timestamp) -> Berarti ini soal baru yang belum ada di DB
        const newQuestions = questions.filter(q => String(q.id).length > 10);

        if (newQuestions.length > 0) {
            // Loop request untuk setiap soal baru
            const savePromises = newQuestions.map(q => {
                const payload = {
                    text: q.text,
                    explanation: q.explanation,
                    options: q.options.map(opt => ({
                        text: opt.text,
                        isCorrect: opt.isCorrect
                    }))
                };
                return api.post(`/teacher/tryouts/${tryoutId}/questions`, payload);
            });

            await Promise.all(savePromises);
        }

        alert("Berhasil menyimpan perubahan!");
        navigate('/tryout-guru');

    } catch (error) {
        console.error("Gagal menyimpan:", error);
        alert("Gagal menyimpan. Pastikan semua input valid dan koneksi aman.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-800 pb-20">
      <NavigasiGuru />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* HEADER & NAVIGASI */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/tryout-guru')} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} className="text-gray-600"/>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#74151e] line-clamp-1">
                {mode === 'edit' ? 'Edit Tryout' : 'Input Soal'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-red-100 text-[#74151e] text-xs font-bold rounded">
                    {displaySubject}
                </span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-gray-500 text-sm">{displayTitle}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 bg-[#74151e] text-white rounded-lg font-bold shadow hover:bg-[#5a1017] transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Save size={18} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>

        {/* PENGATURAN WAKTU (Sekarang Bisa Diedit) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Clock size={16} className="text-[#74151e]" /> Durasi (Menit)
            </label>
            <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#74151e]" 
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Calendar size={16} className="text-[#74151e]" /> Waktu Buka
            </label>
            <input 
                type="datetime-local" 
                value={openTime} 
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#74151e]" 
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Calendar size={16} className="text-[#74151e]" /> Waktu Tutup
            </label>
            <input 
                type="datetime-local" 
                value={closeTime} 
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#74151e]" 
            />
          </div>
        </div>

        {/* LIST SOAL */}
        <div className="space-y-8">
          {questions.map((q, qIndex) => (
            <div key={q.id || qIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Header Soal */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700">Soal No. {qIndex + 1}</span>
                    {/* Indikator Status Soal */}
                    {String(q.id).length < 10 ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">Tersimpan di DB</span>
                    ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200">Baru</span>
                    )}
                </div>
                {questions.length > 1 && (
                  <button 
                    onClick={() => handleDeleteQuestion(qIndex)} 
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                    title="Hapus Soal"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Input Text Soal */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Pertanyaan</label>
                  <textarea
                    rows={3}
                    value={q.text}
                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                    placeholder="Tulis pertanyaan soal di sini..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#74151e]/20 focus:border-[#74151e] focus:outline-none transition-all"
                  />
                </div>

                {/* Input Opsi Jawaban */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wide">Pilihan Jawaban (Klik Huruf untuk Set Kunci)</p>
                  <div className="space-y-3">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-3">
                        <button
                          onClick={() => handleSetKey(qIndex, optIndex)}
                          className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center border font-bold text-sm transition-all shadow-sm ${
                            opt.isCorrect 
                                ? 'bg-green-600 border-green-600 text-white scale-105' 
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                          title="Jadikan Kunci Jawaban"
                        >
                          {opt.isCorrect ? <CheckCircle size={18} /> : opt.label}
                        </button>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                          placeholder={`Jawaban ${opt.label}`}
                          className={`flex-1 border rounded-lg p-2.5 text-sm focus:outline-none transition-all ${
                            opt.isCorrect 
                                ? 'bg-green-50 border-green-500 ring-1 ring-green-500 text-green-900 font-medium' 
                                : 'border-gray-300 focus:border-[#74151e] focus:ring-2 focus:ring-[#74151e]/20'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input Pembahasan */}
                <div className="pt-4 border-t border-dashed border-gray-200">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <AlertCircle size={16} className="text-[#74151e]"/> Pembahasan / Kunci Penjelasan
                  </label>
                  <textarea
                    rows={3}
                    value={q.explanation || ''}
                    onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                    placeholder="Jelaskan mengapa jawabannya benar..."
                    className="w-full border border-yellow-300 rounded-lg p-3 bg-yellow-50/30 focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Tambah Soal (Bawah) */}
        <div className="mt-8 mb-20">
          <button
            onClick={handleAddQuestion}
            className="w-full py-4 bg-white border-2 border-dashed border-gray-300 text-gray-500 rounded-xl font-bold hover:border-[#74151e] hover:text-[#74151e] hover:bg-red-50 flex justify-center items-center gap-2 transition-all shadow-sm group"
          >
            <div className="bg-gray-100 p-1 rounded-full group-hover:bg-[#74151e] group-hover:text-white transition-colors">
                <Plus size={20} /> 
            </div>
            Tambah Soal Baru
          </button>
        </div>

      </div>
    </div>
  );
};

export default IsiTryoutGuru;