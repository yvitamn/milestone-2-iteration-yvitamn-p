
import type { AppProps } from 'next/app';
import { AuthenticateProvider } from '@/lib/contexts/AuthenticateProvider';
import { CartProvider } from '@/lib/contexts/CartProvider';
import  LayoutUser from '@/components/LayoutUser';
//import withPrivateRoute from '@/lib/hoc/withPrivateRoute';
import '@/styles/globals.css'; 
import React from 'react';


function MyApp({ Component, pageProps }: AppProps) {
  //const ProtectedComponent = withPrivateRoute(Component);
  
  return (
    <AuthenticateProvider>     
      <CartProvider>
      {/* <ModalProvider> */}
         {/* Use Suspense to handle the fallback UI while Layout is loading */}
         {/* <Suspense fallback={<div>Loading...</div>}> */}
      <LayoutUser>
     
        <Component {...pageProps} />
      
      </LayoutUser>
      {/* </Suspense> */}
      {/* </ModalProvider> */}
      </CartProvider>
      
    </AuthenticateProvider>
  );
}

export default MyApp;