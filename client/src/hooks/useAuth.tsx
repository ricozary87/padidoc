import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isOperator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("padidoc_token"));
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("padidoc_token");
      if (savedToken) {
        try {
          const response = await fetch("/api/auth/me", {
            headers: {
              "Authorization": `Bearer ${savedToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(savedToken);
          } else {
            localStorage.removeItem("padidoc_token");
            setToken(null);
          }
        } catch (error) {
          console.error("Auth check error:", error);
          localStorage.removeItem("padidoc_token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, user } = await response.json();
        setToken(token);
        setUser(user);
        localStorage.setItem("padidoc_token", token);
        
        toast({
          title: "Login berhasil",
          description: `Selamat datang, ${user.username}!`,
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || "Login gagal");
      }
    } catch (error) {
      toast({
        title: "Login gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat login",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("padidoc_token");
    
    toast({
      title: "Logout berhasil",
      description: "Anda telah berhasil logout",
    });
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const isAdmin = user?.role === "admin";
  const isOperator = user?.role === "operator";

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    token,
    hasRole,
    isAdmin,
    isOperator,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};