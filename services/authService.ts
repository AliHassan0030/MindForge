import { jwtDecode } from "jwt-decode";
import { UserProfile } from "../types";

const STORAGE_KEY = 'mindforge_user_session';
const TOKEN_KEY = 'mindforge_auth_token';

interface GoogleJwtPayload {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  exp: number;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

// Helper to generate a mock JWT for email/password users
// In a real app, this happens on the backend with a secret key
const generateMockJwt = (user: UserProfile): string => {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    picture: user.avatar,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days expiration
  };

  const base64UrlEncode = (obj: any) => {
    return btoa(JSON.stringify(obj))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signature = "mock_signature_secret_12345"; // Mock signature

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const processGoogleToken = (credential: string): AuthResponse => {
  const decoded = jwtDecode<GoogleJwtPayload>(credential);
  
  // Map Google profile to our UserProfile type
  const user: UserProfile = {
    id: decoded.sub,
    name: decoded.name,
    email: decoded.email,
    avatar: decoded.picture,
    level: 1,
    points: 0,
    streak: 0,
    badges: [] 
  };

  return { user, token: credential };
};

// Simulates a backend login with Email/Password and returns a JWT
export const loginWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // In a real app, this would validate against a database
  const name = email.split('@')[0];
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  const user: UserProfile = {
    id: `email_${email}`,
    name: capitalizedName,
    email: email,
    // Generate a consistent avatar based on email
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    level: 1,
    points: 0,
    streak: 0,
    badges: []
  };

  const token = generateMockJwt(user);

  return { user, token };
};

export const saveSession = (user: UserProfile, token: string) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

export const getSession = (): UserProfile | null => {
  const storedUser = localStorage.getItem(STORAGE_KEY);
  const storedToken = localStorage.getItem(TOKEN_KEY);

  if (!storedUser || !storedToken) return null;

  // Optional: Check token expiration here if needed
  try {
    const user = JSON.parse(storedUser);
    return user;
  } catch (e) {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
};