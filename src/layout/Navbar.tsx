'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { CategoryType } from '@/lib/types';
//import { fetchCategories } from '@/lib/api';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  categories: CategoryType[];
}

const Navbar = ({ categories }: NavbarProps) => {
  const { userLogin, logout, isAuthenticated } = useAuth(); // Access user and authentication state
  const pathname = usePathname(); // To track the current route
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //const [categoriesNav, setCategoriesNav] = useState<CategoryType[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  
  // // Fetch categories on mount
  // useEffect(() => {
  //   const getCategories = async () => {
  //     try {
  //       const categoriesData = await fetchCategories();
  //       setCategoriesNav(categoriesData);
  //     } catch (error) {
  //       console.error("Failed to fetch categories:", error);
  //     }
  //   };
  //   getCategories();
  // }, []);

  
  const handleCategoryClick = (categoryId: number | string) => {
    setIsDropdownOpen(false); // Close the dropdown after category selection
    router.push(`/products/categories/${categoryId}`); // Navigate to the selected category
  };


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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left-side Links */}
        <div className="space-x-4">
          <Link
            href="/"
            className={`${isActive("/") ? "text-gray-300" : "hover:text-gray-300"}`}
          >
            Home
          </Link>
          
          <Link
            href="/products"
            className={`${isActive("/products") ? "text-gray-300" : "hover:text-gray-300"}`}
          >
            Products
          </Link>
        </div>

        {/* Hamburger Menu Icon */}
        <button
          className="lg:hidden text-white" // Visible only on small screens (lg:hidden hides on large screens)
          onClick={toggleMenu} // Toggle menu on click
        >
          {isMenuOpen ? (
            <X className="text-white" size={24} /> // Display the X icon to close the menu
          ) : (
            <Menu className="text-white" size={24} /> // Display the Menu icon to open the menu
          )}
        </button>

        {/* Shop by Category Dropdown */}
        <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-white hover:text-gray-300"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen ? 'true' : 'false'}
            >
              New Arrivals
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded-lg shadow-lg"
                role="menu"
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    role="menuitem"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
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
          ) : isLoggedOut ? (
            <span className="text-green-500">Logout Successful</span>
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
