import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Assuming SECRET_KEY is set in your environment
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

// User interface
export interface User {
  id: number;
  email: string;
  password: string; // Only for registration
  name: string;
}

// Function to generate JWT token
export const generateJwt = (payload: object) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

// Function to verify JWT token
export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    return null;
  }
};

// Function to decode JWT (without verifying)
export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload | null;
  } catch (error) {
    console.error('Token decoding failed:', error);
    return null;
  }
};

// Mock user database (replace this with your actual database)
const users: User[] = [
  {
    id: 1,
    email: 'test@example.com',
    name: 'John Doe',
    password: '$2a$10$wYlr7gGxlGAji97MOnFrG.xOmI8CTQw6IqKfM9aOylRM.jE9shmfC', // bcrypt hash of 'password123'
  },
];

// Function to hash password (used during user registration)
export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10); // Hash password with 10 rounds
};

// Function to compare a given password with the stored hashed password
export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

// Function to sign up with JWT
export const signupJwt = (email: string, password: string, name: string): string => {
  // Check if the user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Create a new user
  const newUser: User = {
    id: users.length + 1, // This would normally be auto-generated in a database
    email,
    name,
    password: hashPassword(password), // Hash password before storing
  };

  // Add the user to the "database" (in real-world, save it in your database)
  users.push(newUser);

  // Generate JWT token for the new user
  const token = generateJwt({ id: newUser.id, email: newUser.email, name: newUser.name });

  return token;
};

// Function to log in with JWT
export const loginJwt = (email: string, password: string): string => {
  // Find the user by email
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new Error('User not found');
  }

  // Check if the provided password matches the hashed password
  if (!comparePassword(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token for the user
  const token = generateJwt({ id: user.id, email: user.email, name: user.name });

  return token;
};

// Example usage of signupJwt and loginJwt functions:

try {
  // Sign up a new user
  const signupToken = signupJwt('test@example.com', 'password123', 'John Doe');
  console.log('Sign up successful, token:', signupToken);

  // Log in with the same credentials
  const loginToken = loginJwt('test@example.com', 'password123');
  console.log('Login successful, token:', loginToken);
} catch (error: unknown) {
  if (error instanceof Error) {
    // Now you can access 'message' safely
    console.error('Error:', error.message);
  } else {
    // If the error is not an instance of Error, handle it
    console.error('An unknown error occurred');
  }
}
