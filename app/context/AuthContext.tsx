"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/app/utils/axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarImage?: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return <AuthContext.Provider value={{ user, loading, setUser, refreshUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
