import { signupJwt } from '@/lib/auth/jwt'; // Import the signup function
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';


const Signup: React.FC = () => {
  const [name, setName] = useState<string>('');
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
        const token = await signupJwt(email, password, name); // Use the signup function
        console.log('User signed up and JWT token saved:', token);
        router.push('/login'); // Redirect to login after successful signup
      } catch (err) {
        setError('Signup failed. Please try again.');
      }finally {
        setIsLoading(false);
      }
    };


  return (
    <Layout>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl font-semibold mb-4 text-center">Sign Up</h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
         <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>        
          
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
           {isLoading ? 'Signing up...' : 'Sign Up'}
         </button>
       </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-blue-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
    </Layout>
  );
};

export default Signup;
