import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';
import WelcomeModal from '@/components/WelcomeModal';
import CartModal from '@/components/CartModal';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';


interface LayoutProps {
  children: React.ReactNode;

}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { addedProducts: cartItems } = useCart();
  const { isAuthenticated, logout, user } = useAuth(); 
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
  //const [isCartOpen, setIsCartOpen] = useState(false);
 // const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');  // Manage active tab state

  // const handleTabChange = (tab: 'products' | 'categories') => {
  //   setActiveTab(tab);
  // };
  // const handleAddToCart = (product: ProductsType) => {
  //   console.log('Product added to cart:', product);
  // };

  // Check if the current route is active
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
  };

  const handleCartClick = () => {
    setIsCartModalOpen(true);  // Show cart modal when clicked
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Navbar */}
      <nav className="bg-gray-800 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            ShopSmart
          </Link>
          <div className="space-x-4">
            <Link href="/" className={`${isActive('/') ? 'text-gray-300' : 'hover:text-gray-300'}`}>
              Home
            </Link>

            {/* Other links */}
            <Link href="/products" className={`${isActive('/products') ? 'text-gray-300' : 'hover:text-gray-300'}`}>
              Products
            </Link>

            {/* Only authenticated users can access Checkout */}
            {isAuthenticated ? (
              <Link href="/checkout" className={`${isActive('/checkout') ? 'text-gray-300' : 'hover:text-gray-300'}`}>
                Checkout
              </Link>
            ) : null}

            {/* Authentication Links */}
            {isAuthenticated ? (
              <>
                <span className="text-gray-300">Welcome, {user?.name}!</span>
                <button onClick={handleLogout} className="hover:text-gray-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`${isActive('/login') ? 'text-gray-300' : 'hover:text-gray-300'}`}>
                  Login
                </Link>
                <Link href="/signup" className={`${isActive('/signup') ? 'text-gray-300' : 'hover:text-gray-300'}`}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Welcome Modal */}
      {isWelcomeModalOpen && <WelcomeModal onClose={() => setIsWelcomeModalOpen(false)} />}

      {/* Page Content */}
      <main className="flex-grow container mx-auto p-6">{children}</main>

      {/* Cart Modal */}
      {isCartModalOpen && (
        <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} cartItems={cartItems} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;