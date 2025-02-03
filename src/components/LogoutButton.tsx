import { useRouter } from 'next/router';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // Call the API route to log out
    await fetch('/api/logout', { method: 'POST' });

    // After logging out, redirect to the login page
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600">
      Logout
    </button>
  );
};

export default LogoutButton;