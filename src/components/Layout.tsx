import React, { useState, useEffect } from 'react';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';
import WelcomeModal from '@/components/WelcomeModal';
//import { useCategories } from '@/hooks/useCategories';
import CartModal from '@/components/CartModal';
import Navbar from '@/layout/Navbar';
import { useCart } from '@/hooks/useCart';
import  { useAuth } from '@/hooks/useAuth'; 


interface LayoutProps {
  children: React.ReactNode;

}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Get authentication status
  const { addedProducts: cartItems } = useCart();

  // Modal state
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
  //const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

// Fetch categories for Navbar
//const { data: categories, loading, error } = useCategories('all');


  // Close Welcome Modal after the user has visited once
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('visited');
    if (hasVisitedBefore) {
      setIsWelcomeModalOpen(false); // Skip welcome modal if user has visited before
    } else {
      localStorage.setItem('visited', 'true'); // Mark user as having visited
    }
  }, []);
 

  // Handle Cart Modal
  const handleCartClick = () => {
    setIsCartModalOpen(true);  // Show cart modal when clicked
  };

  // const handleCategoryClick = (categoryId: string) => {
  //   setIsDropdownOpen(false); // Close the dropdown
  //   onCategoryChange(categoryId);
  // };

  // const handleCategoryChange = (categoryId: string) => {
  //   // Handle category change (e.g., filter products based on categoryId)
  //   console.log('Selected category ID:', categoryId);
  // };

  



  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Navbar */}
      <Navbar 
      categories={[]}
       onCategoryChange={() => {}}
      // onCartClick={handleCartClick} 
        /> 
      {/* <nav className="bg-gray-800 p-4 text-white"> */}
   


   {/* Page Content */}
      <main className="flex-grow container mx-auto p-6">
      {children}
      
      {/* Welcome Modal */}
      {isWelcomeModalOpen && <WelcomeModal onClose={() => setIsWelcomeModalOpen(false)} />}

      {/* Cart Modal */}
      {isCartModalOpen && (
        <CartModal isOpen={isCartModalOpen}
         onClose={() => setIsCartModalOpen(false)} 
         cartItems={cartItems} />
      )}

      {/* Thank You Modal */}
      {/* {isThankYouModalOpen && (
        <ThankYouModal 
          isOpen={isThankYouModalOpen}
          onClose={() => setIsThankYouModalOpen(false)}
        />
      )} */}

      
      

      {/* Footer */}

      </main>
      <Footer />
    </div>
  );
}

export default Layout;