import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import api from '../../api'; // <-- 1. UNCOMMENT INI NANTI

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

export const TutorCard = ({ name, subject, university, image }) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 w-full h-full">
            <div className="group relative h-72 w-full overflow-hidden bg-gray-200">
                <div className="absolute inset-0 bg-brand-dark opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10"></div>
                <img 
                    src={image} 
                    alt={name} 
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=No+Image"; }}
                />
            </div>
            <div className="p-6 text-center">
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
    
    // DATA DUMMY
    const initialTutors = [
        { id: 1, name: "Kak Bimo", subject: "Matematika", university: "Alumni ITB", image_url: "/assets/tutors/tutor.png" },
        { id: 2, name: "Kak Sarah", subject: "Bahasa Inggris", university: "Alumni UI", image_url: "/assets/tutors/tutor.png" },
        { id: 3, name: "Kak Dinda", subject: "Biologi", university: "Alumni UGM", image_url: "/assets/tutors/tutor.png" },
    ];

    const [tutors, setTutors] = useState(initialTutors);

    // 2. AREA BACKEND (Tinggal Uncomment)
    /*
    useEffect(() => {
        // API: Ambil 3 tutor teratas (misal: /api/tutors?limit=3)
        api.get('/tutors?limit=3')
            .then(res => setTutors(res.data))
            .catch(err => console.error(err));
    }, []);
    */

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

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                    {tutors.map((tutor, index) => (
                        <div key={tutor.id || index} className="w-full lg:w-1/3 max-w-sm lg:max-w-none">
                            <TutorCard 
                                name={tutor.name}
                                subject={tutor.subject}
                                university={tutor.university}
                                image={tutor.image_url} 
                            />
                        </div>
                    ))}


                    <Link 
                        to="/tutor" 
                        className="flex-shrink-0 w-14 h-14 bg-brand-dark rounded-full flex items-center justify-center hover:bg-brand-dark-accent transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 mt-4 lg:mt-0 lg:ml-4"
                        title="Lihat Semua Tutor"
                    >
                        <ArrowRightIcon />
                    </Link>
                </div>
            </div>
        </section>
    );
}