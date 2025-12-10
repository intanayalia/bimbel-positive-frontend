import React from 'react';
import { Link } from 'react-router-dom';

const StarIcon = () => (
    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export default function HeroSection() {
    return (
        <section className="relative bg-brand-light-bg pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">

            <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#800000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-brand-icon-bg rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-brand-dark rounded-full blur-[100px] opacity-10"></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-icon-bg shadow-sm mb-6 animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-dark opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-dark"></span>
                            </span>
                            <span className="text-xs font-bold text-brand-dark tracking-wide uppercase">Bimbel Terbaik #1</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                            Positive <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-dark-accent">Belajar</span>,<br />
                            Gemilang Prestasi
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Metode belajar yang <strong>adaptif</strong> dan <strong>menyenangkan</strong>. Kami membantu siswa tidak hanya menghafal, tapi memahami konsep hingga ke akarnya.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/register" className="group relative px-8 py-4 bg-brand-dark text-white font-bold rounded-xl shadow-lg shadow-brand-dark/30 hover:shadow-brand-dark/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                <span className="relative z-10">Daftar Sekarang</span>
                                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-brand-dark-accent to-brand-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                            <Link to="/pricing" className="px-8 py-4 bg-white text-brand-dark border-2 border-brand-dark/10 font-bold rounded-xl hover:bg-gray-50 hover:border-brand-dark transition-all duration-300">
                                Lihat Paket Belajar
                            </Link>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 relative mt-12 lg:mt-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-beige-header to-transparent rounded-full opacity-50 blur-3xl -z-10"></div>
                        
                        <div className="relative mx-auto w-full max-w-md lg:max-w-full">
                            <img 
                                src="/assets/murid_landing_page.png" 
                                alt="Siswa Bimbel Positif" 
                                className="w-full h-auto object-contain drop-shadow-2xl relative z-10 hover:scale-[1.02] transition-transform duration-500"
                            />
                            <div className="absolute -left-8 top-16 md:-left-20 md:top-28 animate-float z-20">
                                <div className="relative w-24 h-24 md:w-36 md:h-36 bg-brand-dark rounded-full shadow-xl flex items-center justify-center">
                                    <img 
                                        src="/assets/laptop.png" 
                                        alt="Online Learning" 
                                        className="absolute w-[130%] max-w-none -top-6 -left-6 md:-top-10 md:-left-10 drop-shadow-lg" 
                                    />
                                </div>
                            </div>
                            <div className="absolute -right-8 bottom-24 md:-right-20 md:bottom-40 animate-float delay-1000 z-20">
                                <div className="relative w-20 h-20 md:w-28 md:h-28 bg-brand-dark rounded-full shadow-xl flex items-center justify-center">
                                    <img 
                                        src="/assets/topiwisuda.png" 
                                        alt="Success" 
                                        className="absolute w-[140%] max-w-none -bottom-4 -right-4 md:-bottom-8 md:-right-8 drop-shadow-lg transform rotate-12" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}