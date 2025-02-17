'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { CategoryType } from '@/lib/types';
import CategoryList from '@/components/CategoryList';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface NavbarProps {
  categories: CategoryType[];
}

const Navbar = ({ categories }: NavbarProps) => {
  const { userLogin, logout, isAuthenticated } = useAuth(); // Access user and authentication state
  const pathname = usePathname(); // To track the current route
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  
    
  const handleCategoryClick = (categoryId: number | string) => {
    setIsDropdownOpen(false); // Close the dropdown after category selection
    router.push(`/categories/${categoryId}`); // Navigate to the selected category
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false); // Close dropdown if clicked outside
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleLogout = () => {
    logout(); // Call the logout function from context
    setIsLoggedOut(true);
    // You can also clear local storage or token if you're saving it
    localStorage.removeItem('token');
  };
  

  //const pathname = router.pathname;
  const isActive = (path: string) => {
    return pathname === path;
  };

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  // };

  return (
    <nav className="bg-gray-800 p-4 text-white">
    <div className="container mx-auto flex justify-between items-center">
      {/* Left-side Links */}
      <div className="space-x-4 hidden lg:flex">
        <Link
          href="/products"
          className={`${isActive("/products") ? "text-gray-300" : "hover:text-gray-300"}`}
        >
          Products
        </Link>

        {/* Shop by Category Dropdown */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white hover:text-gray-300"
          >
            Categories
            {isDropdownOpen ? (
              <ChevronUp className="inline ml-1" size={16} />
            ) : (
              <ChevronDown className="inline ml-1" size={16} />
            )}
          </button>

          {isDropdownOpen && (
            <div
              className="absolute left-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded-lg shadow-lg"
              ref={dropdownRef}
              role="menu"
            >
              {/* Use the CategoryList component here */}
              <CategoryList
                categories={categories}
                onCategorySelect={handleCategoryClick} // Pass the function to handle category selection
              />
            </div>
          )}
        </div>
      </div>

      {/* Right-side Links and User Info */}
      <div className="space-x-4 flex items-center">
        {isAuthenticated && !isLoggedOut ? (
          <>
            <Link
              href="/checkout"
              className={`${isActive("/checkout") ? "text-gray-300" : "hover:text-gray-300"}`}
            >
              Checkout
            </Link>
            <div className="text-gray-300">
              <span>{userLogin?.name}!</span>
              <span
                onClick={handleLogout}
                className="cursor-pointer hover:text-gray-300"
              >
                Logout
              </span>
            </div>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className={`${isActive("/login") ? "text-gray-300" : "hover:text-gray-300"}`}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={`${isActive("/signup") ? "text-gray-300" : "hover:text-gray-300"}`}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  </nav>
);
};

export default Navbar;
