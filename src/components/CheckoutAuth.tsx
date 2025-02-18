'use client';
import React, { useState } from 'react';
//import { useRouter } from 'next/router';
import LoginPage from '@/components/LoginPage';
import SignupPage from '@/components/SignupPage';

const CheckoutAuth = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(true); // Toggle between login and signup pages
 // const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-6 text-center">Checkout</h2>
      <p className="text-red-500 text-center">Please log in to proceed with checkout.</p>

      {isLoggingIn ? <LoginPage /> : <SignupPage />}

      <div className="text-center mt-4">
        <button
          onClick={() => setIsLoggingIn(!isLoggingIn)}
          className="text-blue-500 hover:underline"
        >
          {isLoggingIn
            ? 'Don’t have an account? Sign up here.'
            : 'Already have an account? Log in here.'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutAuth;