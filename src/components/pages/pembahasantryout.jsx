import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import NavigasiSiswa from '../common/navigasisiswa';
import api from '../../api';

const PembahasanTryout = () => {
  const { id } = useParams();
  const location = useLocation();
  
  // Ambil jawaban user yang dioper dari halaman Hasil
  const userAnswers = location.state?.userAnswers || {}; 

  const [loading, setLoading] = useState(true);
  const [tryout, setTryout] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // FETCH DATA PEMBAHASAN (Soal + Kunci + Penjelasan)
  useEffect(() => {
    const fetchPembahasan = async () => {
      try {
        const response = await api.get(`/tryouts/${id}/discussion`);
        setTryout(response.data);
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (error) {
        console.error("Gagal load pembahasan:", error);
      }
    };
    fetchPembahasan();
  }, [id]);

  // Navigasi Next/Prev
  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat Pembahasan...</div>;

  const currentQ = questions[currentQuestionIndex];
  // Jawaban user untuk soal no ini (ID Option)
  const userAnsId = userAnswers[currentQuestionIndex]; 

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-800">
      <NavigasiSiswa />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-24">
        <h1 className="text-xl font-bold text-gray-500 mb-6 border-b pb-4">
          Pembahasan: {tryout?.title}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* KOLOM KIRI: SOAL & OPSI */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-white border border-gray-300 rounded px-4 py-2 text-sm font-bold text-gray-600 shadow-sm">
                Status: {userAnsId ? "Dijawab" : "Tidak Dijawab"}
              </div>
              <div className="flex gap-2">
                <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className="bg-white border border-[#74151e] rounded p-1 text-[#74151e] disabled:opacity-50 hover:bg-red-50">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} className="bg-white border border-[#74151e] rounded p-1 text-[#74151e] disabled:opacity-50 hover:bg-red-50">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Teks Soal */}
            <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Soal {currentQuestionIndex + 1}</h2>
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
                {currentQ.question_text}
              </p>
            </div>

            {/* Opsi Jawaban */}
            <div className="space-y-4">
              {currentQ.options.map((opt, idx) => {
                const isCorrectKey = opt.is_correct === 1; // Kunci Jawaban
                const isUserSelected = userAnsId === opt.id; // Pilihan User
                
                // Logika Warna
                let containerClass = "border-gray-300 bg-white";
                let icon = null;

                if (isCorrectKey) {
                  containerClass = "border-green-500 bg-green-50"; // Jawaban Benar selalu Hijau
                  icon = <Check className="text-green-600" size={20} />;
                } else if (isUserSelected && !isCorrectKey) {
                  containerClass = "border-red-500 bg-red-50"; // Jawaban User Salah jadi Merah
                  icon = <X className="text-red-600" size={20} />;
                }

                return (
                  <div
                    key={opt.id}
                    className={`w-full text-left border rounded-lg p-4 flex items-center justify-between transition-all ${containerClass}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${
                        isCorrectKey ? 'border-green-600 bg-green-600 text-white' : 
                        (isUserSelected ? 'border-red-600 bg-red-600 text-white' : 'border-gray-300 text-gray-500')
                      }`}>
                         {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-gray-700 text-sm font-medium">
                        {opt.option_text}
                      </span>
                    </div>
                    {icon}
                  </div>
                );
              })}
            </div>

            {/* Kotak Penjelasan */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">PEMBAHASAN</span>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed text-justify whitespace-pre-wrap">
                {currentQ.explanation || "Tidak ada pembahasan untuk soal ini."}
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: Navigasi Nomor */}
          <div className="lg:col-span-1">
            <div className="sticky top-28"> 
              <div className="grid grid-cols-5 gap-2 mb-8">
                {questions.map((q, index) => {
                  // Cek apakah jawaban user benar atau salah untuk styling nomor
                  const userAnswerId = userAnswers[index];
                  // Cari opsi yang benar di data question ini
                  const correctOption = q.options.find(o => o.is_correct === 1);
                  
                  const isCorrect = userAnswerId === correctOption?.id;
                  const isActive = index === currentQuestionIndex;
                  
                  let gridClass = "bg-white border-gray-300 text-gray-400"; // Default (Kosong)

                  if (userAnswerId) {
                      gridClass = isCorrect 
                        ? "bg-green-100 border-green-500 text-green-700" 
                        : "bg-red-100 border-red-500 text-red-700";
                  }

                  if (isActive) gridClass += " ring-2 ring-gray-600 ring-offset-1";

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`aspect-square border rounded flex items-center justify-center text-sm font-bold shadow-sm transition-all ${gridClass}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PembahasanTryout;