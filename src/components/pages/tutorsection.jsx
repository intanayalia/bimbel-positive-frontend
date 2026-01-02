import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../../api'; // <-- 1. SUDAH DI-UNCOMMENT

// --- ICONS ---
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

export const TutorCard = ({ name, subject, university, image }) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 w-full h-full flex flex-col">
            <div className="group relative h-72 w-full overflow-hidden bg-gray-200">
                <div className="absolute inset-0 bg-brand-dark opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10"></div>
                <img 
                    src={image} 
                    alt={name} 
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=Foto+Mentor"; }}
                />
            </div>
            <div className="p-6 text-center flex-1 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-brand-dark mb-1">{name}</h3>
                <p className="text-brand-dark-accent font-medium text-sm mb-3 uppercase tracking-wide">{subject}</p>
                <div className="w-10 h-1 bg-brand-icon-bg mx-auto rounded-full mb-4"></div>
                <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    <span>{university}</span>
                </div>
            </div>
        </div>
    );
};

export default function TutorSection() {
    
    // STATE DATA
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    // FETCH DATA DARI API
    useEffect(() => {
        const fetchTutors = async () => {
            try {
                // Mengambil data guru dari backend
                const response = await api.get('/tutors');
                setTutors(response.data);
            } catch (error) {
                console.error("Gagal load tutor:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTutors();
    }, []);

    // Helper: Mendapatkan inisial untuk placeholder gambar (jika tidak ada foto)
    const getPlaceholderImage = (name) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=400`;
    };

    return (
        <section className="py-20 bg-brand-light-bg">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">
                        Yuk Kenalan dengan Mentor Kami
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Belajar bareng mentor-mentor asik, berpengalaman, dan lulusan PTN ternama.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-brand-dark w-10 h-10" />
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 flex-wrap">
                        {tutors.length > 0 ? (
                            tutors.slice(0, 3).map((tutor, index) => (
                                <div key={tutor.id || index} className="w-full lg:w-1/3 max-w-sm lg:max-w-none">
                                    <TutorCard 
                                        name={tutor.name}
                                        // Gunakan data dari API jika ada, atau default value
                                        subject={tutor.subject || "Mentor Spesialis"} 
                                        university={tutor.university || "Pengajar Berpengalaman"}
                                        // Gunakan foto dari API atau generator avatar
                                        image={tutor.avatar_url || getPlaceholderImage(tutor.name)} 
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center w-full py-10">
                                <p className="text-gray-500">Belum ada data mentor yang ditampilkan.</p>
                            </div>
                        )}

                        <Link 
                            to="/tutor" 
                            className="flex-shrink-0 w-14 h-14 bg-brand-dark rounded-full flex items-center justify-center hover:bg-brand-dark-accent transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 mt-4 lg:mt-0 lg:ml-4"
                            title="Lihat Semua Tutor"
                        >
                            <ArrowRightIcon />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}