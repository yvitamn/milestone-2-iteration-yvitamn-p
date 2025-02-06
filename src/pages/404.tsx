import Layout from '@/components/Layout';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-4">Sorry, we couldn't find the page you're looking for.</p>
        <Link href="/" className="text-blue-500 hover:underline text-lg">
        Go back to the homepage
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
