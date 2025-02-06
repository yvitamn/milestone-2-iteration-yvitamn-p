import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Category } from '@/lib/types';

interface NavbarProps {
  categories: Category[]; // Add categories prop
  onCategoryChange: (categoryId: string) => void; // Add callback for category selection
}

const Navbar: React.FC<NavbarProps> = ({ categories, onCategoryChange }) => {
  const { isAuthenticated, logout } = useAuth(); // Access user and authentication state
  const pathname = usePathname(); // To track the current route
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  const handleLogout = () => {
    logout(); // Call the logout function from context
    // You can also clear local storage or token if you're saving it
    localStorage.removeItem('token');
  };

  // Check if the current route is active
  const isActive = (path: string) => pathname === path;

  // Handle category selection
  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId); // Notify parent component of category change
    setIsDropdownOpen(false); // Close the dropdown
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold">
          ShopSmart
        </Link>
        <div className="space-x-4">
          <Link
            href="/"
            className={`${isActive('/') ? 'text-gray-300' : 'hover:text-gray-300'}`}
          >
            Home
          </Link>

        {/* Shop by Category Dropdown */}
        <div className="relative">
        <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`${isActive('/products') ? 'text-gray-300' : 'hover:text-gray-300'}`}
        >
        Shop by Category
        </button>
        {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg text-black">
          {categories.map((category) => (
          <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id.toString())}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
         {category.name}
         </button>
        ))}
            </div>
          )}
           </div>

          {isAuthenticated ? (
            <>
              <Link
                href="/products"
                className={`${isActive('/products') ? 'text-gray-300' : 'hover:text-gray-300'}`}
              >
                Products
              </Link> 
              <Link
                href="/checkout"
                className={`${isActive('/checkout') ? 'text-gray-300' : 'hover:text-gray-300'}`}
              >
                Checkout
              </Link>
              {/* <span className="text-gray-300">Welcome, {user?.name}!</span> Display user name */}
              <button
                onClick={handleLogout}
                className="hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`${isActive('/login') ? 'text-gray-300' : 'hover:text-gray-300'}`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={`${isActive('/signup') ? 'text-gray-300' : 'hover:text-gray-300'}`}
              >
                Sign Up
              </Link>
            </>
          )}
          {/* Cart Button */}
          {/* <button
            onClick={onCartClick}
            className="hover:text-gray-300"
          >
            Cart
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;