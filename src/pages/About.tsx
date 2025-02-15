// pages/about.tsx
import React, { useState, useEffect } from 'react';

const About: React.FC = () => {
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate fetching data (e.g., products)
    setTimeout(() => {
      // Set error to true to simulate an error
      setError(true);
    }, 1000);
  }, []);

  return (
    <div>
      {error ? (
        <div>Error fetching products</div>  // This could be what's showing up instead of "About Page"
      ) : (
        <h1>About Page</h1>  // This should be your expected output
      )}
    </div>
  );
};

export default About;
