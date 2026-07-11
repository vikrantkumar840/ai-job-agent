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
      const token = getAccessToken();

      if (!token) {
        setUser(null);
        return;
      }

      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch (error) {
      clearTokens();
      setUser(null);
    }
  }

  useEffect(() => {
    async function init() {
      await refreshUser();
      setLoading(false);
    }

    init();
  }, []);

  async function login(data: LoginData) {
    const response = await loginUser(data);

    saveTokens(
      response.access_token,
      response.refresh_token
    );

    setUser(response.user);
  }

  async function register(data: RegisterData) {
    const response = await registerUser(data);

    saveTokens(
      response.access_token,
      response.refresh_token
    );

    setUser(response.user);
  }

  function logout() {
    clearTokens();

    localStorage.removeItem("workflow_result");
    localStorage.removeItem("resume_uploaded");
    localStorage.removeItem("resume_text");

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

export function useAuthContext() {
  return useContext(AuthContext);
}
