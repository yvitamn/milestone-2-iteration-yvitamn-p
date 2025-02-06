import React, { useState } from 'react';
//import Navbar from '../layout/Navbar';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';
import WelcomeModal from '@/components/WelcomeModal';
import CartModal from '@/components/CartModal';
import { useCart } from '@/hooks/useCart';
//import { ProductsType } from '../lib/types';
//import '@/styles/globals.css'; 

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { addedProducts: cartItems } = useCart();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
  //const [isCartOpen, setIsCartOpen] = useState(false);

  // const handleAddToCart = (product: ProductsType) => {
  //   console.log('Product added to cart:', product);
  // };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Navbar */}
      {/* <Navbar  /> */}
      {/* {children} */}
      {/* <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}

      {/* Welcome Modal */}
      {isWelcomeModalOpen && <WelcomeModal onClose={() => setIsWelcomeModalOpen(false)} />}

      {/* Page Content */}
      <main className="flex-grow container mx-auto p-6">
        {children}
      </main>

      {/* Cart Modal */}
      {isCartModalOpen && (
        <CartModal
          isOpen={isCartModalOpen}
          onClose={() => setIsCartModalOpen(false)}
          cartItems={cartItems}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}