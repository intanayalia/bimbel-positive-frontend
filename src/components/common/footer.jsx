import React from 'react';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 6.5h.01" />
    </svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-brand-dark text-white">
            <div className="container mx-auto px-6 py-10">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                    <div className="md:col-span-2">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-5">
                                <img src="/assets/logo.png" alt="Logo Bimbel Positif" className="h-full w-full object-contain" />
                            </div>
                            <div className="pt-2">
                                <h3 className="font-bold text-2xl">Positive Belajar, Gemilang Prestasi</h3>
                                <hr className="my-4 border-gray-400 border-opacity-50 max-w-xs mx-auto sm:mx-0" />
                                <p className="text-gray-300 max-w-xs">
                                    Desa Sokawera RT 01, RW 03 Kecamatan Padamara, Kabupaten Purbalingga
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="font-bold text-2xl">Hubungi Kami</h3>
                        <div className="space-y-4 mt-6">
                            <a href="#" className="flex items-center justify-center sm:justify-start space-x-3 hover:text-gray-300 transition-colors">
                                <InstagramIcon />
                                <span>@bimbelpositive</span>
                            </a>
                            <a href="#" className="flex items-center justify-center sm:justify-start space-x-3 hover:text-gray-300 transition-colors">
                                <PhoneIcon />
                                <span>+62 858-7848-4800</span>
                            </a>
                            <a href="#" className="flex items-center justify-center sm:justify-start space-x-3 hover:text-gray-300 transition-colors">
                                <FacebookIcon />
                                <span>Bimbingan Belajar Positive</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}