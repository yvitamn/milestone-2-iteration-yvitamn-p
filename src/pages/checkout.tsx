'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart'; 
import { useAuth } from '@/hooks/useAuth';
import { ThankYouModal } from '@/components/ThankYouModal';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { User } from '@/lib/types';
import { fetchUserData } from '@/lib/apiUser';
import { useUserData } from '@/hooks/useUserData';



interface CheckoutPageProps {
    userCheckout: User;  //This comes from server-side props
    
  }
    
//Server-side authentication check using `getServerSideProps`
export const getServerSideProps: GetServerSideProps = async (context) => {
    const token = context.req.cookies['auth-token'];
    if (!token) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
 // If the user is authenticated, proceed with the page
   
 // Fetch user data using the token
 const userDataResponse = await fetchUserData(token);

 if ('message' in userDataResponse) {
   console.error(userDataResponse.message);  // Log the error message
   return {
     props: {
        error: userDataResponse.message,
      },
   };
 }
 return {
      props: {
        userCheckout: userDataResponse, // Pass the user data to the page
      }, //can pass additional props
    };
};


const Checkout: React.FC<CheckoutPageProps> = ({ userCheckout }) => {
    const { isAuthenticated } = useAuth(); //add userData here?
    const { userFetched, errorUserData } = useUserData(isAuthenticated);
    const { addedProducts, clearCart } = useCart(); // Get the cart items
    const [paymentMethod, setPaymentMethod] = useState<string>(''); // State for selected payment method
    const [error, setError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false); // Track order success
    const [checkoutError, setCheckoutError] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();// To navigate after checkout
    const user = userFetched;  

  // Calculate total price
  const calculateTotalPrice = () => {
    return addedProducts.reduce(
        (total, product) => 
            total + product.price * product.quantity, 
        0
    );
 
};

  // If the user is not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

 

  const handleCheckout = async () => {
      if (!paymentMethod) {
        setCheckoutError('Please select a payment method.');
        return;
    }
    setIsLoading(true);
    setCheckoutError(null); 

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

// // Check if user is of type `AuthResponseWithPurchase` and has `lastPurchase`
// const isAuthResponseWithPurchase = (user: any): user is AuthResponseWithPurchase => {
//     return user?.lastPurchase !== undefined;
//   };



  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-6 text-center">Checkout</h2>
      {errorUserData && <p className="text-red-500 text-center">{errorUserData}</p>}
      {userCheckout && (
        <p className="text-lg text-center">Hello, {userFetched?.name}!</p>
      )}
      {/* Check if lastPurchase exists */}
      {user?.lastPurchase && user.lastPurchase.length > 0 ? (
        <p>Last Purchase: {user.lastPurchase[0].name} for ${user.lastPurchase[0].price}</p>
      ) : (
        <p>You haven't made a purchase yet.</p>
      )}

      {orderSuccess ? (
        <ThankYouModal />
      ) : (
        <div>
          {addedProducts.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <h3 className="text-2xl mb-4">Your Cart Items:</h3>
              <ul className="mb-6">
                {addedProducts.map((product) => (
                  <li key={product.id} className="flex justify-between mb-2">
                    <span>{product.title}</span>
                    <span>${product.price} x {product.quantity}</span>
                  </li>
                ))}
              </ul>
            
              
              <div className="mb-4 font-semibold">
                Total: ${calculateTotalPrice().toFixed(2)}
              </div>

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

              {checkoutError && <p className="text-red-500 mb-4">{checkoutError}</p>}
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout;





