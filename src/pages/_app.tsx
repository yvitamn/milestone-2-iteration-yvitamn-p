'use client';

import React from 'react';
import type { AppProps } from 'next/app';
import { AuthenticateProvider } from '@/lib/contexts/AuthenticateProvider';
import { CartProvider } from '@/lib/contexts/CartProvider';
import LayoutUser from '@/components/LayoutUser';
import { CategoryType } from '@/lib/types';
import '@/styles/globals.css'; 
// import Navbar from '@/layout/Navbar';
// import Header from '@/layout/Header';
// import Footer from '@/layout/Footer';



function MyApp({ Component, pageProps }: AppProps) {
  const categories: CategoryType[] = []; 

  return (
    <AuthenticateProvider>     
      <CartProvider>

        {/* <Navbar />
       <header className="flex flex-col min-h-screen">
        <Header />
       </header> */}
        <LayoutUser categories={categories}>
        {/* <main className="flex-grow"> */}
        <Component {...pageProps} />
        {/* </main> */}
        </LayoutUser>
        {/* <footer className="mt-auto">
        <Footer />
        </footer> */}

      </CartProvider>      
    </AuthenticateProvider>
  );
}

export default MyApp;