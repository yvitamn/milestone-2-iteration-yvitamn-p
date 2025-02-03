
import type { AppProps } from 'next/app';
import { AuthenticateProvider } from '../lib/contexts/AuthenticateProvider';
import { CartProvider } from '../lib/contexts/CartProvider';
//import { ProductCacheProvider } from '@/lib/contexts/ProductCacheProvider';
//import Layout from '../components/Layout';
import { ModalProvider } from '../lib/contexts/ModalContext';


function MyApp({ Component, pageProps }: AppProps) {
  //const userSession = getUserSession(null);
  
  return (
    <AuthenticateProvider>
      
      <CartProvider>
      <ModalProvider>
      {/* <Layout> */}
      {/* <ProductCacheProvider> */}
        <Component {...pageProps} />
        {/* </ProductCacheProvider> */}
      {/* </Layout> */}
      </ModalProvider>
      </CartProvider>
      
    </AuthenticateProvider>
  );
}

export default MyApp;