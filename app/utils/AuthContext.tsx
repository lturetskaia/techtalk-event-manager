import type { UserLoginData, AuthContextType, LoginData } from './types';
import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from 'react';
import { getData, postData } from './http';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserLoginData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check active session status when the app loads
  useEffect(() => {
    async function getInitialLoginState() {
      await getData('/api/me')
        .then((res) => setUser(res.user))
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
    }
    getInitialLoginState();
  }, []);

  const login = async (loginData: LoginData) => {
    const res = await postData('/login', loginData);
    setUser(res.user);
    return res.user; //return the new user login data
  };

  const logout = async () => {
    const res = await postData('/logout');
    setUser(null);
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
