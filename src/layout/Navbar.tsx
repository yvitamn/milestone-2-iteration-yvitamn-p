'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { CategoryType } from '@/lib/types';
import { ChevronDown, ChevronUp, ShoppingCart, User, LogOut, List, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  categories: CategoryType[];
}
const Navbar = ({ categories }: NavbarProps) => {
  const { userLogin, logout, isAuthenticated } = useAuth(); // Access user and authentication state
  const pathname = usePathname(); 
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

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
    return pathname === path ? "text-gray-300" : "hover:text-gray-300";
  };

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  // };

  return (
    <nav className="bg-gray-800 p-4 text-white">
    <div className="container mx-auto flex justify-between items-center">
      <ul className="flex space-x-4">
        {/* Home Link */}
        <li>
          <Link href="/" className={isActive("/")}>
            Home
          </Link>
        </li>

        {/* Products Link */}
        <li>
          <Link href="/products" className={isActive("/products")}>
            <ShoppingBag className="inline mr-1" size={18} /> Products
          </Link>
        </li>

        {/* Categories Dropdown */}
        <li className="relative inline-block text-left">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white hover:text-gray-300"
          >
            {/* Updated icon size to larger one (size={24}) */}
            <List className="inline mr-2" size={24} /> Categories {/* Larger icon */}
            {isDropdownOpen ? (
              <ChevronUp className="inline ml-1" size={16} />
            ) : (
              <ChevronDown className="inline ml-1" size={16} />
            )}
          </button>

          {isDropdownOpen && (
            <div
              className="absolute left-0 mt-2 w-96 bg-black bg-opacity-50 text-white border border-gray-300 rounded-lg shadow-lg"
              ref={dropdownRef}
              role="menu"
            >
              <ul className="py-2">
                {/* Iterate over categories and display each one */}
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  >
                    <span onClick={() => handleCategoryClick(category.id)}>
                      {category.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li> {/* Added closing </li> tag */}

        {/* Checkout Link */}
        {isAuthenticated && !isLoggedOut && (
          <li>
            <Link href="/checkout" className={isActive("/checkout")}>
              <ShoppingCart className="inline mr-1" size={18} /> Checkout
            </Link>
          </li>
        )}
      </ul>

      {/* User Links (Login/SignUp or User Profile + Logout) */}
      <div className="flex items-center space-x-4">
        {isAuthenticated && !isLoggedOut ? (
          <>
            <span className="text-gray-300">
              <span>{userLogin?.name}</span>
            </span>
            <span
              onClick={handleLogout}
              className="cursor-pointer hover:text-gray-300 ml-4"
            >
              <LogOut className="inline mr-1" size={18} /> Logout
            </span>
          </>
        ) : (
          <>
            <Link href="/login" className={isActive("/login")}>
              <User className="inline mr-1" size={18} /> Login
            </Link>
            <Link href="/signup" className={isActive("/signup")}>
              <User className="inline mr-1" size={18} /> Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  </nav>
);
};
export default Navbar;
