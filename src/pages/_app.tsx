
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/lib/contexts/AuthProvider';
import { CartProvider } from '@/lib/contexts/CartProvider';
//import { ProductCacheProvider } from '@/lib/contexts/ProductCacheProvider';
import { Layout } from '@/components/Layout';
import { ModalProvider } from '@/lib/contexts/ModalContext';
import '@/styles/global.css'; 

// Dynamically import Layout using React.lazy
import React, { Suspense } from 'react';

//const Layout = React.lazy(() => import('@/components/Layout'));


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