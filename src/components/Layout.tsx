import React, { useState } from 'react';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';
import WelcomeModal from '@/components/WelcomeModal';
//import CartModal from '@/components/CartModal';
//import { useCart } from '@/hooks/useCart';
import Navbar from '@/layout/Navbar';

interface LayoutProps {
  children: React.ReactNode;

}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  //const { addedProducts: cartItems } = useCart();
  //const { isAuthenticated, logout, user } = useAuth(); 
  //const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
  
 
  // const handleCartClick = () => {
  //   setIsCartModalOpen(true);  // Show cart modal when clicked
  // };
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Navbar */}
      <Navbar categories={[]} onCategoryChange={() => {}} /> 
      {/* <nav className="bg-gray-800 p-4 text-white"> */}
   
      {/* </nav> */}

      {/* Welcome Modal */}
      {isWelcomeModalOpen && <WelcomeModal onClose={() => setIsWelcomeModalOpen(false)} />}


      {/* Page Content */}
      <main className="flex-grow container mx-auto p-6">{children}</main>

      {/* Cart Modal */}
      {/* {isCartModalOpen && (
        <CartModal isOpen={isCartModalOpen}
         onClose={() => setIsCartModalOpen(false)} 
         cartItems={cartItems} />
      )} */}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;