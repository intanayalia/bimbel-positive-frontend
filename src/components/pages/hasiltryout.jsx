import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Ban } from 'lucide-react';
import NavigasiSiswa from '../common/navigasisiswa';

const HasilTryout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Terima data dari halaman sebelumnya (IsiTryout)
  const { totalCorrect, totalWrong, totalEmpty, score, tryoutId, userAnswers } = location.state || { 
    totalCorrect: 0, 
    totalWrong: 0, 
    totalEmpty: 0, 
    score: 0, 
    tryoutId: 0,
    userAnswers: {} // Default kosong
  };

  const handleLihatPembahasan = () => {
    navigate(`/pembahasan-tryout/${tryoutId}`, {
        state: { userAnswers } // Oper jawaban user ke halaman pembahasan
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-800">
      <NavigasiSiswa />

      <div className="flex items-center justify-center min-h-screen pt-24 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-[#4A1015] p-8 flex justify-center items-center h-64 relative">
             <img 
               src="/assets/medal.png" 
               alt="Winner Medal" 
               className="w-40 h-40 object-contain drop-shadow-lg animate-bounce-slow"
               onError={(e) => e.target.style.display = 'none'} 
             />
             <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full opacity-50"></div>
             <div className="absolute top-20 right-10 w-3 h-3 bg-blue-400 rounded opacity-50 rotate-45"></div>
          </div>
          <div className="p-8 pb-10 text-center">
            <h2 className="text-xl font-bold text-[#74151e] mb-2">
              Tryout Selesai!
            </h2>
            <p className="text-xs text-gray-500 mb-8 leading-relaxed px-4">
              Hasil kerjamu sudah keluar. Yuk lihat detailnya di bawah ini.
            </p>
            <div className="bg-[#F8F8F8] border border-gray-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1 h-3 bg-red-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#74151e] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-800">{Math.round(score)}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="text-white fill-[#22c55e]" size={32} />
                    <span className="text-2xl font-bold text-gray-800">{totalCorrect}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500">Benar</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="text-white fill-[#b91c1c]" size={32} />
                    <span className="text-2xl font-bold text-gray-800">{totalWrong}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500">Salah</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Ban className="text-gray-700" size={32} strokeWidth={2} />
                    <span className="text-2xl font-bold text-gray-800">{totalEmpty}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500">Kosong</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                className="flex-1 py-3 rounded-md border border-[#74151e] text-[#74151e] text-sm font-bold hover:bg-red-50 transition-colors"
                onClick={handleLihatPembahasan}
              >
                Lihat Pembahasan
              </button>
              <button 
                className="flex-1 py-3 rounded-md bg-[#74151e] text-white text-sm font-bold hover:bg-[#5a1017] transition-colors shadow-md"
                onClick={() => navigate('/tryout')}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HasilTryout;