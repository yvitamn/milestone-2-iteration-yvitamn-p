//test

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import About from '@/pages';

describe('About', () => {
  it('renders a heading', () => {
    render(<About />);
    
    const heading = screen.getByText('About Page');
    
    expect(heading).toBeInTheDocument();
  });
});


