// [GSA-ATH-F-CT] - Authentication Context & User Session Provider Component
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSession {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  role: 'admin' | 'member';
  gotra?: string;
  memberId?: string;
}

interface AuthContextType {
  user: UserSession | null;
  role: 'admin' | 'member' | 'guest';
  isLoggedIn: boolean;
  loginUser: (user: UserSession) => void;
  loginAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // [GSA-ATH-F-CT-01: Session Storage Initialization]
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('gsa_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [role, setRole] = useState<'admin' | 'member' | 'guest'>(() => {
    try {
      const saved = localStorage.getItem('gsa_auth_role');
      if (saved === 'admin' || saved === 'member') return saved;
      return user ? user.role : 'guest';
    } catch (e) {
      return 'guest';
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('gsa_auth_user', JSON.stringify(user));
      localStorage.setItem('gsa_auth_role', user.role);
    } else {
      localStorage.removeItem('gsa_auth_user');
      localStorage.removeItem('gsa_auth_role');
    }
  }, [user]);

  const loginUser = (session: UserSession) => {
    setUser(session);
    setRole(session.role);
  };

  const loginAdmin = () => {
    const adminSession: UserSession = {
      id: 'admin-1',
      name: 'श्री घाँची समाज एडमिन (Admin)',
      email: 'admin@ghanchisamaj.org',
      role: 'admin',
      memberId: 'GHS-ADM-001'
    };
    setUser(adminSession);
    setRole('admin');
  };

  const logout = () => {
    setUser(null);
    setRole('guest');
    localStorage.removeItem('gsa_auth_user');
    localStorage.removeItem('gsa_auth_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoggedIn: !!user, loginUser, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
