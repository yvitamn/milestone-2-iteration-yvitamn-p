import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const withPrivateRoute = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth(); // Using context to get authentication status
    const [loading, setLoading] = useState(true); // Add a loading state while checking auth


    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login'); // Redirect to login if not authenticated
      }else{
        setLoading(false); // Set loading to false once auth is checked
      }
    }, [isAuthenticated]);

    if (loading) {
      return <p>Loading...</p>; // Or any loading state you want
    }

    // If user is authenticated, render the protected component
    
    return <Component {...props} />;
  };
};

export default withPrivateRoute;
