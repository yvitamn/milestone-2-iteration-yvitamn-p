
import { GetStaticProps } from 'next';
import { fetchCategories } from '@/lib/api';
import { CategoryType } from '@/lib/types';
import CategoryList from '@/components/CategorySelect';
import { useRouter } from 'next/router';
import Navbar from '@/layout/Navbar'; 

interface CategoriesPageProps {
  categories: CategoryType[];
 
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    
    const categories: CategoryType[] = await fetchCategories();
    console.log('Fetched Categories:', categories);
    return {
      props: { categories },
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { notFound: true };
  }
};


const CategoriesPage = ({ categories }: CategoriesPageProps) => {
  
    const router = useRouter();

    // Handle category selection by navigating to category's page
    const onCategorySelect = (categoryId: number | string) => {
      router.push(`/products/categories/${categoryId}`);
    };
  
    return (
      <div>
        <Navbar categories={categories} />
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold">NEW ARRIVAL</h1>
      <CategoryList 
      categories={categories} 
      onCategorySelect={onCategorySelect}
      />
    </div>
    </div>
  );
};

export default CategoriesPage;