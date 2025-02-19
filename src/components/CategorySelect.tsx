'use client';
import { CategoryType } from '@/lib/types';
import Link from 'next/link';

interface CategorySelectProps {
  categories: CategoryType[];
  onCategorySelect: (categoryId: number | string) => void;  // Callback when a category is selected
}

const CategorySelect = ({ 
    categories, 
    onCategorySelect 
}: CategorySelectProps) => {


// const router = useRouter();

    // // Handle category selection by navigating to category's page
    // const onCategorySelect = (categoryId: number | string) => {
    //   router.push(`/products/categories/${categoryId}`);
    // };

  return (
    <div className="py-2">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.id}`}  // Adjusted route for category detail
        >
          <div
            onClick={() => onCategorySelect(category.id)} // Optionally call a function when clicked
            className="block px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
          >
            {category.name}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategorySelect;