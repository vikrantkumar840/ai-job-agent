"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "@/lib/api";

import {
  saveTokens,
  clearTokens,
  getAccessToken,
} from "@/lib/auth";

interface User {
  id: number;
  full_name: string;
  email: string;
  credits: number;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      if (!getAccessToken()) {
        setUser(null);
        return;
      }

      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch (err) {
      clearTokens();
      setUser(null);
    }
  }

  useEffect(() => {
    async function initialize() {
      await refreshUser();
      setLoading(false);
    }

    initialize();
  }, []);

  async function login(data: LoginData) {
    const response = await loginUser(data);

    saveTokens(
      response.access_token,
      response.refresh_token
    );

    await refreshUser();
  }

  async function register(data: RegisterData) {
    const response = await registerUser(data);

    saveTokens(
      response.access_token,
      response.refresh_token
    );

    await refreshUser();
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
