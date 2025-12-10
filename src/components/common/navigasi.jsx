import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigasi() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-brand-dark shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-8"> 
                    <Link to="/" className="flex-shrink-0">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-sm"> 
                            <img 
                                src="/assets/logo.png" 
                                alt="Logo Bimbel Positif" 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                    </Link>
                    <nav className="hidden md:flex space-x-6 text-sm font-bold text-white/90">
                        <Link to="/" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-white pb-0.5">
                            Home
                        </Link>
                        <Link to="/pricing" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-white pb-0.5">
                            Daftar Paket
                        </Link>
                        <Link to="/pembayaran" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-white pb-0.5">
                            Pembayaran
                        </Link>
                    </nav>

                </div>
                <div className="space-x-4 flex items-center">
                    <Link 
                        to="/login" 
                        className="text-sm font-bold text-white hover:text-gray-200 transition-colors"
                    >
                        Masuk
                    </Link>
                    <Link 
                        to="/register" 
                        className="px-5 py-2 text-brand-dark bg-white rounded-full hover:bg-gray-100 transition duration-300 font-bold text-sm shadow-md"
                    >
                        Daftar
                    </Link>
                </div>
            </div>
        </header>
    );
}