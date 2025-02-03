import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const withPrivateRoute = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const router = useRouter();
    const isAuthenticated = useAuth();// Your authentication check logic, e.g., check if the user is logged in

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login'); // Redirect to login if not authenticated
      }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
      return <p>Loading...</p>; // Or any loading state you want
    }

    return <Component {...props} />;
  };
};

export default withPrivateRoute;
