
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';   // Store this in environment variables (e.g., .env.local)

// Function to generate JWT token
export const generateJwt = (payload: object) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

// Function to verify JWT token
export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};


// Function to decode JWT (for extracting user information)
export const decodeJwt = (token: string) => {
  try {
    return jwt.decode(token); // Decodes the JWT without verifying
  } catch (error) {
    console.error('Token decoding failed:', error);
    return null;
  }
};



























// const BASE_URL = "https://api.escuelajs.co/api/v1"; 

// // Decode the JWT token and return the payload (user info)
// export const decodeJwt = (token: string) => {
//   try {
//     return jwt.decode(token);
//   } catch (err) {
//     console.error("Error decoding token:", err);
//     return null;
//   }
// };

// // Verify if JWT is valid (check if it's expired)
// export const verifyJwt = (token: string, secret: string) => {
//   try {
//     return jwt.verify(token, secret);
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return null;
//   }
// };


// // Function to handle the API request for user signup
// export const signupWithJwt = async (email: string, password: string) => {
//     try {
//       const response = await fetch(`${BASE_URL}/auth/signup`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to sign up');
//       }
  
//       const data = await response.json();
//       const token = data.token; // Assuming the API responds with a 'token' field
  
//       // Save JWT in localStorage (or you can use cookies)
//       localStorage.setItem('token', token);
  
//       return token;
//     } catch (error) {
//       console.error('Error during signup:', error);
//       throw error;
//     }
//   };


//   export const loginWithJwt = async (email: string, password: string) => {
//     try {
//       const response = await fetch(`${BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });
  
//       if (!response.ok) {
//         throw new Error('Invalid credentials');
//       }
  
//       const data = await response.json();
//       const token = data.token; // Assuming the API responds with a 'token' field
  
//       // Optionally, you can store the token in cookies using nookies
//       // nookies.set(null, 'token', token, { path: '/' }); // This stores it globally for the entire site
  
//       // Or store it in localStorage (as a fallback)
//       localStorage.setItem('token', token);
  
//       return token;
//     } catch (error) {
//       console.error('Error during login:', error);
//       throw error;
//     }
//   };



  