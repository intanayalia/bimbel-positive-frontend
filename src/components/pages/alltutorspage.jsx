import React, { useState, useEffect } from 'react';
import Navigasi from '../common/navigasi';
import Footer from '../common/footer';
// import api from '../../api'; // <-- UNCOMMENT INI SAAT INTEGRASI BACKEND
import { TutorCard } from './tutorsection'; 

export default function AllTutorsPage() {
    
    // 1. DATA DUMMY (Untuk Tampilan Sementara sebelum Backend masuk)
    const dummyTutors = [
        { id: 1, name: "Kak Bimo", subject: "Matematika", university: "Alumni ITB", image_url: "/assets/tutors/tutor.png" },
        { id: 2, name: "Kak Sarah", subject: "Bahasa Inggris", university: "Alumni UI", image_url: "/assets/tutors/tutor.png" },
        { id: 3, name: "Kak Dinda", subject: "Biologi", university: "Alumni UGM", image_url: "/assets/tutors/tutor.png" },
        { id: 4, name: "Kak Rio", subject: "Fisika", university: "Alumni ITS", image_url: "/assets/tutors/tutor.png" },
        { id: 5, name: "Kak Andi", subject: "Kimia", university: "Alumni IPB", image_url: "/assets/tutors/tutor.png" },
        { id: 6, name: "Kak Maya", subject: "Sejarah", university: "Alumni UNPAD", image_url: "/assets/tutors/tutor.png" },
        { id: 7, name: "Kak Jojo", subject: "Ekonomi", university: "Alumni UNAIR", image_url: "/assets/tutors/tutor.png" },
        { id: 8, name: "Kak Rara", subject: "Sosiologi", university: "Alumni UB", image_url: "/assets/tutors/tutor.png" },
    ];

    // 2. STATE (Wadah Data)
    const [allTutors, setAllTutors] = useState(dummyTutors);
    const [loading, setLoading] = useState(false); // Opsional: Untuk menampilkan loading spinner

    // 3. AREA KERJA BACKEND (useEffect)
    /*
    useEffect(() => {
        setLoading(true);
        // Backend akan memanggil API: /api/all-tutors
        api.get('/all-tutors')
            .then(response => {
                setAllTutors(response.data); // Data dari database masuk ke sini
                setLoading(false);
            })
            .catch(error => {
                console.error("Gagal load tutor:", error);
                setLoading(false);
            });
    }, []);
    */

    return (
        <div className="bg-brand-light-bg font-sans min-h-screen flex flex-col justify-between">
            <Navigasi />

            <main className="py-24 mb-auto">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4">
                            Semua Tutor Terbaik Kami
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Temukan mentor yang cocok dengan gaya belajarmu di sini.
                        </p>
                    </div>

                    {loading && (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Sedang memuat data tutor...</p>
                        </div>
                    )}

                    {!loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {allTutors.map((tutor) => (
                                <TutorCard 
                                    key={tutor.id}
                                    name={tutor.name}
                                    subject={tutor.subject}
                                    university={tutor.university}
                                    image={tutor.image_url} 
                                />
                            ))}
                        </div>
                    )}
                    
                    {!loading && allTutors.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            Belum ada data tutor.
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}