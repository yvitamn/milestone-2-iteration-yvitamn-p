import { render, screen, fireEvent } from '@testing-library/react';
import CategorySelect from '@/components/CategorySelect';
import { CategoryType } from '@/lib/types';

// Mocking the next/link component to avoid real navigation
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('CategorySelect', () => {
  const mockOnCategorySelect = jest.fn();

  const categories: CategoryType[] = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Books' },
  ];

  it('should render the list of categories correctly', () => {
    render(<CategorySelect categories={categories} onCategorySelect={mockOnCategorySelect} />);

    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it('should call onCategorySelect when a category is clicked', () => {
    render(<CategorySelect categories={categories} onCategorySelect={mockOnCategorySelect} />);

    const categoryItem = screen.getByText('Electronics');
    fireEvent.click(categoryItem);

    expect(mockOnCategorySelect).toHaveBeenCalledWith('1');
    expect(mockOnCategorySelect).toHaveBeenCalledTimes(1);
  });

  it('should navigate to the correct category page on click', () => {
    render(<CategorySelect categories={categories} onCategorySelect={mockOnCategorySelect} />);

    const categoryLink = screen.getByText('Electronics');
    fireEvent.click(categoryLink);

    // Ensuring that the link directs to the correct URL
    expect(categoryLink.closest('a')).toHaveAttribute('href', '/categories/1');
  });
});