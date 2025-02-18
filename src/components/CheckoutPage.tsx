'use client';
import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart'; 
import { useAuth } from '@/hooks/useAuth'; 
import { CheckCircle, ShoppingBag } from 'lucide-react'; 
import { useUserData } from '@/hooks/useUserData';
import { useRouter } from 'next/navigation';


const CheckoutPage = () => { 
    const { userData, isAuthenticated } = useAuth();
    const { addedProducts, clearCart } = useCart(); 
    const [paymentMethod, setPaymentMethod] = useState<string>(''); 
    const [error, setError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    // Use the updated user data from useUserData
    const { userFetched, errorUserData } = useUserData(isAuthenticated);

      // Calculate total price
      const calculateTotalPrice = () => {
        return addedProducts.reduce(
            (total, product) => 
                total + product.price * product.quantity, 
            0
        );
    
    };

  const handleCheckout = async () => {
      if (!paymentMethod) {
        setError('Please select a payment method.');
        return;
    }
    setIsLoading(true);
    setError(null); 

    try {
        const checkoutSuccess = true;  // Simulate checkout success
        if (!checkoutSuccess) throw new Error('Checkout failed. Try again.');
        
        setOrderSuccess(true);
        clearCart();
       // router.push('/thank-you');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setIsLoading(false);
      }
    };

      const handleContinueShopping = () => {
        router.push('/products'); // Navigate to the products page (or any other page you want)
      };

      // Display errors if any
    //   useEffect(() => {
    //     if (errorUserData || userDataError) {
    //       setError(errorUserData || userDataError);
    //     }
    //   }, [errorUserData, userDataError]);

      // Simulate fetching user data
    //   useEffect(() => {
    //     if (isAuthenticated) {
    //       // Simulate a delay for fetching user data
    //       setTimeout(() => {
    //         setIsFetchingUserData(false);
    //       }, 1000);
    //     }
    //   }, [isAuthenticated]);
      
    //   // Destructure last purchase from user data
    //   const lastPurchase = userData?.lastPurchase?.[0] || userFetched?.lastPurchase?.[0];


    //   if (!isAuthenticated) {
    //     return (
    //       <div className="container mx-auto p-6">
    //         <h2 className="text-4xl font-bold mb-6 text-center">Checkout</h2>
    //         <p className="text-red-500 text-center">Please log in to proceed with checkout.</p>
    //         <button
    //           onClick={() => router.push('/login')}
    //           className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 w-full"
    //         >
    //           Go to Login for Checkout
    //         </button>
    //       </div>
    //     );
    //   }
    

            //Check if user is authenticated and data is available
        if (!isAuthenticated) {
            router.push('/checkout'); 
            return null;
        }

        if (errorUserData) {
            return <p className="text-red-500">{errorUserData}</p>;
        }



      return (
        <div className="container mx-auto p-6">
        <h2 className="text-4xl font-bold mb-6 text-center">Checkout</h2>
  
        {userFetched || userData ? (
          <p className="text-lg text-center">Hello, {userFetched.name}!</p>
        ) : (
          <p>No user data available.</p>
        )}
  
        {orderSuccess ? (
          <div className="text-center mt-6">
            <CheckCircle className="text-green-500 mx-auto" size={48} />
            <p className="text-green-600 text-xl mt-4">Your order was successful!</p>
          </div>
        ) : (
          <div>
            {addedProducts.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <h3 className="text-2xl mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" /> Your Cart Items:
                </h3>
                <ul className="mb-6">
                  {addedProducts.map((product) => (
                    <li key={product.id} className="flex justify-between mb-2">
                      <span>{product.title}</span>
                      <span>${product.price} x {product.quantity}</span>
                    </li>
                  ))}
                </ul>
  
                <div className="mb-4 font-semibold">Total: ${calculateTotalPrice().toFixed(2)}</div>
  
                <div>
                  <h3 className="text-xl mb-4">Select Payment Method:</h3>
                  <select
                    className="border border-gray-300 p-2 w-full mb-4"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="">Select Payment Method</option>
                    <option value="shopeepay">Shopeepay</option>
                    <option value="paypal">PayPal</option>
                    <option value="gpay">GPay</option>
                  </select>
                </div>
  
                {error && <p className="text-red-500 mb-4">{error}</p>}
  
                <div className="flex justify-center">
                  <button
                    onClick={handleCheckout}
                    className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 w-full mb-4"
                    disabled={!paymentMethod || isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
  
                  <button
                    onClick={handleContinueShopping}
                    className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 w-full"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };
  
    

export default CheckoutPage;





