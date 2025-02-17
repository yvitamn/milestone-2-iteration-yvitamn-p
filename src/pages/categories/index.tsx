//'use client';
import { GetStaticProps } from 'next';
import { fetchCategories } from '@/lib/api';
import { CategoryType } from '@/lib/types';
import CategoryList from '@/components/CategoryList';
//import { useRouter } from 'next/router';

interface CategoriesPageProps {
  categories: CategoryType[];
 onCategorySelect: (categoryId: number | string) => void;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    
    const categories: CategoryType[] = await fetchCategories();

    return {
      props: { categories },
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { notFound: true };
  }
};

const CategoriesPage = ({ categories, onCategorySelect }: CategoriesPageProps) => {
  
    // const router = useRouter();

    // // Handle category selection by navigating to category's page
    // const onCategorySelect = (categoryId: number | string) => {
    //   router.push(`/products/categories/${categoryId}`);
    // };
  
    return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold">Categories</h1>
      <CategoryList 
      categories={categories} 
      onCategorySelect={onCategorySelect}
      />
    </div>
  );
};

export default CategoriesPage;