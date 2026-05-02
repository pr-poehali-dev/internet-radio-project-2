import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const AUTH_URL = 'https://functions.poehali.dev/21bf72c1-489a-4e07-b404-3d305bc5fc5d';

export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  favorite_genre: string | null;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, display_name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, 'display_name' | 'bio' | 'favorite_genre' | 'avatar_url'>>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const authFetch = (action: string, method: string, body?: object, token?: string) =>
  fetch(`${AUTH_URL}?action=${action}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'X-Auth-Token': token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
    return data;
  });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pulse-radio-token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    authFetch('me', 'GET', undefined, token)
      .then(u => setUser(u))
      .catch(() => { localStorage.removeItem('pulse-radio-token'); setToken(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (loginVal: string, password: string) => {
    const data = await authFetch('login', 'POST', { login: loginVal, password });
    localStorage.setItem('pulse-radio-token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (username: string, email: string, password: string, display_name?: string) => {
    const data = await authFetch('register', 'POST', { username, email, password, display_name: display_name || username });
    localStorage.setItem('pulse-radio-token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    if (token) await authFetch('logout', 'POST', {}, token).catch(() => {});
    localStorage.removeItem('pulse-radio-token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: Partial<Pick<User, 'display_name' | 'bio' | 'favorite_genre' | 'avatar_url'>>) => {
    if (!token) throw new Error('Не авторизован');
    const updated = await authFetch('update', 'PUT', data, token);
    setUser(prev => prev ? { ...prev, ...updated } : updated);
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!token) throw new Error('Не авторизован');
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const data = await authFetch('upload_avatar', 'POST', { file: base64, content_type: file.type }, token);
    setUser(prev => prev ? { ...prev, avatar_url: data.avatar_url } : prev);
    return data.avatar_url;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, uploadAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};