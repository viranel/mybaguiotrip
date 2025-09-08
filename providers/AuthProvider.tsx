import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, User } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 3000)
        );
        
        const authPromise = auth.getCurrentUser();
        const { user: currentUser } = await Promise.race([authPromise, timeoutPromise]);
        setUser(currentUser);
      } catch (error) {
        console.error('Error getting initial session:', error);
        // Continue without user if auth fails
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange((user) => {
      try {
        console.log('AuthProvider: Auth state changed:', user?.email || 'No user');
        setUser(user);
        setLoading(false);
      } catch (error) {
        console.error('AuthProvider: Error in auth state change:', error);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await auth.signIn(email, password);
      
      if (result.success && result.user) {
        console.log('Setting user state after signin:', result.user);
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('SignIn error in AuthProvider:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const result = await auth.signUp(email, password, fullName);
      
      if (result.success && result.user) {
        console.log('Setting user state after signup:', result.user);
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('SignUp error in AuthProvider:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      console.log('AuthProvider: Simple signOut starting...');
      
      const result = await auth.signOut();
      
      if (result.success) {
        setUser(null);
        console.log('AuthProvider: User cleared successfully');
      } else {
        console.error('AuthProvider: SignOut failed:', result.error);
      }
      
      setLoading(false);
      return result;
    } catch (error) {
      console.error('AuthProvider: SignOut error:', error);
      setUser(null);
      setLoading(false);
      return { success: false, error: 'SignOut failed' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};