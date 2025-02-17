'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/layout/Navbar';
import { CategoryType } from '@/lib/types';
import { fetchCategories } from '@/lib/api';
//import CategoryList from '@/components/CategoryList';  // Import CategoryList

const LayoutUser = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories(); // Fetch categories from the API
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getCategories();
  }, []);

  return (
    <div>
      {/* Pass categories to the Navbar */}
      <Navbar categories={categories} />
      
      
      
      <main>{children}</main>
    </div>
  );
};

export default LayoutUser;
