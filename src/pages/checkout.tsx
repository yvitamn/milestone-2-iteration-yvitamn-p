
import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart'; // Custom hook to manage cart
import { useAuth } from '@/hooks/useAuth';
import { ThankYouModal } from '@/components/ThankYouModal';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { User } from '@/lib/types';
import { fetchUserData } from '@/lib/apiUser';

interface CheckoutPageProps {
    userCheckout: User;  
  }
    

//Server-side authentication check using `getServerSideProps`
export const getServerSideProps: GetServerSideProps = async (context) => {
    const token = context.req.cookies['auth-token'];
    if (!token || token !== 'true') {
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
        userCheckout: userDataResponse.user, // Pass the user data to the page
      }, //can pass additional props
    };
};


const Checkout: React.FC<CheckoutPageProps> = ({ userCheckout }) => {
    const { isAuthenticated } = useAuth();
    const { addedProducts, clearCart } = useCart(); // Get the cart items
    const [paymentMethod, setPaymentMethod] = useState<string>(''); // State for selected payment method
    const [error, setError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false); // Track order success
    //const { token } = useAuth();
    //const { user, loading, error } = useUserData(token);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();// To navigate after checkout

  // Calculate total price
  const calculateTotalPrice = () => {
    return addedProducts.reduce((total, product) => total + product.price * product.quantity, 0);
 
};

  // If the user is not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

 

  const handleCheckout = async () => { 
      if (!paymentMethod) {
        setError('Please select a payment method.');
        return;
    }
    setIsLoading(true);


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

//   const handleCloseModal = () => {
//     setOrderSuccess(false); // Hide modal after closing
//     router.push('/products'); // Redirect to home or any other page
//   };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-6 text-center">Checkout</h2>

      {userCheckout && (
        <p className="text-lg text-center">Hello, {userCheckout.name}!</p>
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





