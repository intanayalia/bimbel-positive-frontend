import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import NavigasiSiswa from '../common/navigasisiswa';
import api from '../../api'; // Import API configuration

const IsiTryout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [tryoutData, setTryoutData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // State Jawaban User
  // Format: { index_soal: option_id } 
  // Contoh: { 0: 105, 1: 108 }
  const [answers, setAnswers] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. FETCH DATA SOAL (Tanpa Kunci Jawaban) ---
  useEffect(() => {
    const fetchSoal = async () => {
      try {
        const response = await api.get(`/tryouts/${id}`);
        setTryoutData(response.data);
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (error) {
        console.error("Gagal load soal:", error);
        alert("Gagal memuat soal tryout. Pastikan koneksi aman.");
        navigate('/tryout');
      }
    };
    fetchSoal();
  }, [id, navigate]);

  // --- 2. EVENT HANDLERS ---

  // Saat user memilih opsi (A, B, C, D)
  const handleOptionClick = (optionId) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optionId }));
  };

  // Menghapus jawaban pada soal yang sedang aktif
  const handleClearAnswer = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentQuestionIndex];
    setAnswers(newAnswers);
  };

  // Navigasi Soal Sebelumnya
  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  // Navigasi Soal Selanjutnya
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
  };

  // --- 3. LOGIC SUBMIT & PENILAIAN ---
  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    setShowModal(false);

    try {
      // A. Kirim Jawaban ke Backend untuk Disimpan
      // Backend akan mengembalikan data tryout lengkap dengan kunci jawaban (is_correct)
      const response = await api.post(`/tryouts/${id}/submit`, {
        answers: answers // Mengirim object jawaban user
      });

      const fullData = response.data;

      // B. Hitung Statistik Nilai di Frontend untuk Tampilan Cepat
      let totalCorrect = 0;
      let totalWrong = 0;
      let totalEmpty = 0;

      fullData.questions.forEach((q, index) => {
        const userAnswerId = answers[index]; // ID Option yang dipilih user

        if (!userAnswerId) {
          totalEmpty++;
        } else {
          // Cari opsi yang dipilih user di data response (yang sudah ada kunci jawabannya)
          const selectedOption = q.options.find(opt => opt.id === userAnswerId);

          // Cek apakah benar (is_correct === 1)
          if (selectedOption && selectedOption.is_correct) {
            totalCorrect++;
          } else {
            totalWrong++;
          }
        }
      });

      // Hitung Skor (Skala 0-100)
      const score = (totalCorrect / fullData.questions.length) * 100;

      // C. Redirect ke Halaman Hasil
      // Kita kirim 'userAnswers' agar halaman pembahasan nanti tahu apa yang dipilih user
      navigate('/hasil-tryout', {
        state: {
          totalCorrect,
          totalWrong,
          totalEmpty,
          score,
          tryoutId: id,
          userAnswers: answers
        }
      });

    } catch (error) {
      console.error("Gagal submit:", error);
      alert("Terjadi kesalahan saat mengirim jawaban. Coba lagi.");
      setIsSubmitting(false);
    }
  };

  // Helper function untuk label huruf (0->A, 1->B, dst)
  const getLabel = (idx) => String.fromCharCode(65 + idx);

  // Loading State
  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Memuat Soal...</div>;

  // Variabel Helper Render
  const currentQ = questions[currentQuestionIndex];
  const totalSoal = questions.length;
  const filledAnswers = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-800 relative">
      <NavigasiSiswa />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-24">
        {/* Header Judul Tryout */}
        <h1 className="text-xl font-bold text-gray-500 mb-6 border-b pb-4">
          {tryoutData?.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* --- KOLOM KIRI: AREA SOAL --- */}
          <div className="lg:col-span-3 space-y-6">

            {/* Info Bar (Timer & Progress) */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 flex-wrap">
                <div className="bg-white border border-red-300 rounded-md px-4 py-2 text-center min-w-[100px] shadow-sm">
                  <p className="text-xs font-bold text-red-500">Waktu :</p>
                  <p className="text-sm font-bold text-red-600">{tryoutData?.duration} Menit</p>
                </div>
                <div className="bg-white border border-gray-300 rounded-md px-4 py-2 text-center min-w-[100px] shadow-sm">
                  <p className="text-xs font-bold text-gray-600">Terjawab :</p>
                  <p className="text-sm font-bold text-green-600">{filledAnswers} / {totalSoal}</p>
                </div>
              </div>

              {/* Tombol Navigasi Prev/Next */}
              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  className="bg-white border border-[#74151e] rounded p-1 text-[#74151e] hover:bg-red-50 disabled:opacity-50"
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <button
                  onClick={handleNext}
                  className="bg-white border border-[#74151e] rounded p-1 text-[#74151e] hover:bg-red-50 disabled:opacity-50"
                  disabled={currentQuestionIndex === totalSoal - 1}
                >
                  <ChevronRight size={24} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Kotak Soal */}
            <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm min-h-[200px]">
              <h2 className="text-lg font-bold mb-4">Soal No. {currentQuestionIndex + 1}</h2>
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
                {currentQ.question_text}
              </p>
            </div>

            {/* List Pilihan Jawaban */}
            <div className="space-y-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQuestionIndex] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionClick(opt.id)}
                    className={`w-full text-left bg-white border rounded-lg p-4 flex items-center gap-4 transition-all ${isSelected ? 'border-[#74151e] bg-red-50/10' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-xs ${isSelected ? 'border-[#74151e] bg-[#74151e] text-white' : 'border-gray-300 text-gray-500'
                      }`}>
                      {getLabel(idx)}
                    </div>
                    <span className="text-gray-700 text-sm font-medium">
                      {opt.option_text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tombol Hapus Jawaban */}
            <div>
              <button
                onClick={handleClearAnswer}
                className="px-6 py-2 border border-[#74151e] text-[#74151e] rounded-md font-bold text-sm hover:bg-red-50 transition-colors"
              >
                Hapus Jawaban
              </button>
            </div>
          </div>

          {/* --- KOLOM KANAN: NAVIGASI NOMOR --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="grid grid-cols-5 gap-2 mb-8">
                {questions.map((_, index) => {
                  const isActive = index === currentQuestionIndex;
                  const isAnswered = answers[index] !== undefined;

                  // Logic Styling Tombol Nomor
                  let buttonClass = "bg-white border border-red-200 text-gray-700 hover:bg-gray-50";
                  if (isActive) buttonClass = "bg-gray-300 border-gray-400 text-gray-800";
                  else if (isAnswered) buttonClass = "bg-[#74151e] border-[#74151e] text-white";

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`aspect-square rounded flex items-center justify-center text-sm font-bold transition-colors shadow-sm ${buttonClass}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-[#74151e] text-white py-3 rounded-md font-bold text-sm hover:bg-[#5a1017] transition-colors shadow-sm"
              >
                Kirim Jawaban
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL KONFIRMASI SUBMIT --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 pb-0">
              <h3 className="text-lg font-bold text-gray-800">Konfirmasi Submit</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 pt-4">
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Anda telah menjawab <strong>{filledAnswers}</strong> dari <strong>{totalSoal}</strong> soal.
                <br />
                Apakah Anda yakin ingin mengakhiri ujian ini?
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-md border border-[#74151e] text-[#74151e] font-bold text-sm hover:bg-red-50 transition-colors w-full sm:w-auto"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitFinal}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-md bg-[#74151e] text-white font-bold text-sm hover:bg-[#5a1017] transition-colors w-full sm:w-auto shadow-md"
                >
                  {isSubmitting ? 'Memproses...' : 'Ya, Kirim'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IsiTryout;