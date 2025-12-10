import React from 'react';

import Navigasi from '../common/navigasi'; 
import HeroSection from '../common/herosection'; 
import FeaturesSection from './featuressection';
import PricingSection from './pricingsection';
import TutorSection from './tutorsection';
import AboutUsPage from './aboutuspage';
import Footer from '../common/footer';

export default function Home() {
    return (
        <div className="bg-brand-light-bg font-sans min-h-screen">
            
            <Navigasi />

            <main>
                <HeroSection />
                <FeaturesSection />
                <PricingSection />
                <TutorSection />
                <AboutUsPage />
            </main>

            <Footer />

        </div>
    );
}