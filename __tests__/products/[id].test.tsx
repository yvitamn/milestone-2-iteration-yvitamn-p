
import { render, screen, waitFor } from '@testing-library/react';
import ProductPage, { getStaticProps } from '@/pages/products/[id]';
import { ProductsType } from '@/lib/types';


// Mock fetch calls and useRouter
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;


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

  beforeEach(() => {
  (global.fetch as jest.Mock) .mockClear();
  });

  it('fetches and displays product details', async () => {
    // Mock product fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockProduct),
    });

    // Mock the category fetch (if needed)
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
    });

    // expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    // expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();

  it('returns 404 for missing product', async () => {
    // Mock fetch to return an empty product response (i.e., not found)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(null),
    });

    const { props } = await getStaticProps({ params: { id: '1' } });
    expect(props).toEqual({ notFound: true }); 
  });
});
