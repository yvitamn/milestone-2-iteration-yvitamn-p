
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { CartProvider } from '@/lib/contexts/CartProvider';
import  Layout from '@/components/Layout';
import { ModalProvider } from '@/lib/contexts/ModalContext';
import '@/styles/globals.css'; 
import React, { Suspense } from 'react';


function MyApp({ Component, pageProps }: AppProps) {
  //const userSession = getUserSession(null);
  
  return (
    <AuthProvider>     
      <CartProvider>
      <ModalProvider>
         {/* Use Suspense to handle the fallback UI while Layout is loading */}
         <Suspense fallback={<div>Loading...</div>}>
      <Layout>
     
        <Component {...pageProps} />
      
      </Layout>
      </Suspense>
      </ModalProvider>
      </CartProvider>
      
    </AuthProvider>
  );
}

export default MyApp;