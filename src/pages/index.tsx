'use client';
import React from 'react';
import { useRouter } from 'next/router';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/products');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-blue-500">SHOP SMART</span>
        </h1>
        <button
          onClick={handleNavigate}
          className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
        >
          <span>S  H  O  P</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
