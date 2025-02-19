import React from 'react';
import { useAuth } from '@/hooks/useAuth';  // Custom hook to access the authentication context

const TestComponent = () => {
  // Destructuring the values from the context
  const { userLogin, isAuthenticated, token, errorUserData } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        // Displaying user info if authenticated
        <span>Welcome, {userLogin?.name}</span>
      ) : (
        // Display message when the user is not authenticated
        <span>Please log in.</span>
      )}

      {/* Optionally displaying the token */}
      {token && <p>Token: {token}</p>}

      {/* Optionally displaying error message if there's an error in user data */}
      {errorUserData && <p>Error: {errorUserData}</p>}
    </div>
  );
};

export default TestComponent;
