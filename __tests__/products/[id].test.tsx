// __tests__/products/[id].test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import ProductPage, { getStaticProps } from '@/pages/products/[id]';
import { ProductDetail } from '@/components/ProductDetail';
import { ProductsType, CategoryType } from '@/lib/types';

// Mock fetch calls and useRouter
global.fetch = jest.fn();
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ query: { id: '1' } }),
}));

describe('ProductPage', () => {
  const mockProduct: ProductsType = {
    id: '1',
    title: 'Test Product',
    description: 'This is a test product.',
    price: 99.99,
    quantity: 10,
    imageUrl: 'https://via.placeholder.com/500',
    category: { id: 1, name: 'Test Category' },
  };

  const mockCategory: CategoryType = {
    id: 1,
    name: 'Test Category',
  };

  it('fetches and displays product details', async () => {
    // Mock the fetch response for product data
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockProduct),
    });

    // Mock the category data response
    const mockCategoryRes = [
      { id: 1, name: 'Test Category' }
    ];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockCategoryRes),
    });

    // Call getStaticProps to simulate server-side fetching
    const { props } = await getStaticProps({ params: { id: '1' } });

    // Render the ProductPage component with the fetched props
    render(<ProductPage {...props} />);

    // Wait for the product to be rendered
    await waitFor(() => screen.getByText(mockProduct.title));

    // Check if product details are displayed
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
  });

  it('handles missing product data gracefully', async () => {
    // Mock fetch to return an empty product response (i.e., not found)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(null),
    });

    const { props } = await getStaticProps({ params: { id: '1' } });

    expect(props).toEqual({ notFound: true }); // Should return 404 if product is not found
  });
});
