import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth(); // Access auth functions
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
  

  setIsLoading(true);
    setError('');

    try {
      await login({email, password}); // Use login function from context
    
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Redirect to '/products' page after successful login
    if (isAuthenticated) {
      router.push('/products');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {isAuthenticated ? (
        <div className="bg-white p-6 rounded shadow-md text-center">
          <h1 className="text-2xl font-semibold">You're logged in!</h1>
          <button
            onClick={logout}
            className="mt-4 bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h1 className="text-2xl font-semibold mb-4 text-center">Please Login</h1>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <span
              onClick={() => router.push('/signup')}
              className="text-blue-500 cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
