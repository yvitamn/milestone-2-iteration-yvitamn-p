
import { useAuth } from '@/hooks/useAuth';
import CheckoutPage from '@/components/CheckoutPage';
import CheckoutAuth from '@/components/CheckoutAuth';

const Checkout = () => {
  const { isAuthenticated } = useAuth(); // Use authentication context to check if user is authenticated

  
  // If user is authenticated, show checkout page
  if (isAuthenticated) {
    return <CheckoutPage />;
  } 
  if (!isAuthenticated) {
    // If not authenticated, show CheckoutAuth component
    return <CheckoutAuth />;
  }
  // If user is not authenticated, show login or signup page
  return (
   <CheckoutPage />
  );
};


export default Checkout;