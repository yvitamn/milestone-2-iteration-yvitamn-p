
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductDetail } from '@/components/ProductDetail';
import { ProductsType, CategoryType } from '@/lib/types';


describe('ProductDetail Component', () => {
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


  const mockOnAddToCart = jest.fn();

  it('renders product details correctly', () => {
    render (
        <ProductDetail
        product={mockProduct}
        category={mockCategory}
        backLink="/products"
        backLinkText="Back to Products"
        onAddToCart={mockOnAddToCart}
/>
    );

    // Check if product title, description, and price are displayed
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(/\$99\/99/)).toBeInTheDocument();
  });


  it('triggers add to cart correctly', async () => {
    render(
        <ProductDetail
        product={mockProduct}
        category={mockCategory}
        backLink="/products"
        backLinkText="Back to Products"
        onAddToCart={mockOnAddToCart}
      />
    )


    // Trigger the "Add to Cart" button
    fireEvent.click(screen.getByText('Add to Cart'));

    // Ensure the onAddToCart function is called
    await waitFor(() => {
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    });
  });


  it('shows loading state when adding product to cart', async () => {
    //Mock a long-running async operation
    mockOnAddToCart.mockImplementation (() => new Promise(() => {}));
     
    render(
        <ProductDetail
          product={mockProduct}
          category={mockCategory}
          backLink="/products"
          backLinkText="Back to Products"
          onAddToCart={mockOnAddToCart}
        />
      );


      // Click the "Add to Cart" button
    fireEvent.click(screen.getByText('Add to Cart'));
    // Wait for "Adding..." text to appear on the button
    
    await waitFor(() => {
    // Check if the "Adding..." text appears on the button
    expect(screen.getByText('Adding...')).toBeInTheDocument();
});
});
});