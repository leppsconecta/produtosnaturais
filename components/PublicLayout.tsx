import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import ScrollToTop from './ScrollToTop';

export default function PublicLayout() {
    return (
        <div className="min-h-screen font-sans text-earth-800 selection:bg-mustard-500/30 selection:text-olive-900 bg-offwhite">
            <ScrollToTop />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
}
