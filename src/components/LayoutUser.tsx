
import Navbar from '@/layout/Navbar';
import { CategoryType } from '@/lib/types'; 
import Footer from '@/layout/Footer';

const LayoutUser = ({ 
    children, categories
 }: { 
    children: React.ReactNode
    categories: CategoryType[];
}) => {

  return (
    <div>
      {/* Pass categories to the Navbar */}
      <Navbar categories={categories}/>
      
      {/* <Header /> */}
      
      <main className="flex-grow">{children}</main>


      <Footer/>

    </div>
  );
};

export default LayoutUser;
