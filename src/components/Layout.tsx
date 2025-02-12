'use client';
import React from 'react';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';
//import WelcomeModal from '@/pages/index';
import Navbar from '@/layout/Navbar';


 
interface LayoutProps {
  children: React.ReactNode;

}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
   


  // // Close Welcome Modal after the user has visited once
  // useEffect(() => {
  //   const hasVisitedBefore = localStorage.getItem('visited');
  //   if (hasVisitedBefore) {
  //     setIsWelcomeModalOpen(false); // Skip welcome modal if user has visited before
  //   } else {
  //     localStorage.setItem('visited', 'true'); // Mark user as having visited
  //   }
  // }, []);
 
  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     setError('Error loading content'); // Example of error handling
  //   }, 3000);
  // }, []);


  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error loading..{error}</div>;
  // }




  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Navbar */}
      <Navbar />

      
     


   {/* Page Content */}
      <main className="flex-grow container mx-auto p-6">
      {children}

      {/* Welcome Modal */}
    {/* <WelcomeModal  /> */}

           
      

      {/* Footer */}

      </main>
      <Footer />

    </div>
  );
}

export default Layout;