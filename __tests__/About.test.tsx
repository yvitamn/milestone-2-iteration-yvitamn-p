// //test

// import '@testing-library/jest-dom';
// import { render, screen, waitFor } from '@testing-library/react';
// import About from '@/pages';

// describe('About', () => {
//   it('renders a heading',async() => {
//     render(<About />);
//     screen.debug();
//     const heading = await screen.findByText('About Page');
//      // return content === 'About Page' && element.tagName.toLowerCase() === 'h1';

    
//     expect(heading).toBeInTheDocument();
//   });

//  it('does not render an error message', async () => {
//     render(<About />);

//     // Wait for the "About Page" to appear, but not the error message
//     await waitFor(() => expect(screen.queryByText('Error fetching products')).toBeNull());
//   });
// });


