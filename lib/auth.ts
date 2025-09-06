import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  fullName?: string;
}

export const auth = {
  async signUp(email: string, password: string, fullName?: string) {
    try {
      console.log('Attempting signup with:', { email, fullName });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      console.log('Supabase signup response:', { data, error });

      if (error) {
        console.error('Supabase signup error:', error);
        throw error;
      }

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        console.log('User created but needs email confirmation');
        const user = {
          id: data.user.id,
          email: data.user.email!,
          fullName: fullName,
        };
        
        console.log('🔐 AUTH DEBUG - SignUp (Email Confirmation):');
        console.log('  Raw Supabase user:', data.user);
        console.log('  User ID:', data.user?.id);
        console.log('  User Email:', data.user?.email);
        console.log('  Processed user:', user);
        
        return {
          success: true,
          user,
          needsConfirmation: true,
        };
      }

      const user = data.user ? {
        id: data.user.id,
        email: data.user.email!,
        fullName: fullName,
      } : null;

      console.log('🔐 AUTH DEBUG - SignUp (Direct):');
      console.log('  Raw Supabase user:', data.user);
      console.log('  User ID:', data.user?.id);
      console.log('  User Email:', data.user?.email);
      console.log('  Processed user:', user);

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      console.error('Signup error details:', error);
      return {
        success: false,
        error: error.message || 'Signup failed',
      };
    }
  },

  async signIn(email: string, password: string) {
    try {
      console.log('Attempting signin with:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Supabase signin response:', { data, error });

      if (error) {
        console.error('Supabase signin error:', error);
        throw error;
      }

      const user = data.user ? {
        id: data.user.id,
        email: data.user.email!,
        fullName: data.user.user_metadata?.full_name,
      } : null;

      console.log('🔐 AUTH DEBUG - SignIn Response:');
      console.log('  Raw Supabase user:', data.user);
      console.log('  User ID:', data.user?.id);
      console.log('  User Email:', data.user?.email);
      console.log('  User Metadata:', data.user?.user_metadata);
      console.log('  Processed user:', user);

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      console.error('Signin error details:', error);
      return {
        success: false,
        error: error.message || 'Signin failed',
      };
    }
  },

  async signOut() {
    try {
      console.log('lib/auth: Simple signOut starting...');
      
      // Simple signOut
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('lib/auth: SignOut error:', error);
        return { success: false, error: error.message };
      }

      console.log('lib/auth: SignOut successful');
      return { success: true };
    } catch (error: any) {
      console.error('lib/auth: SignOut error:', error);
      return { success: false, error: error.message };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;

      return {
        success: true,
        user: user ? {
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata?.full_name,
        } : null,
      };
    } catch (error: any) {
      return {
        success: false,
        user: null,
        error: error.message,
      };
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 AUTH DEBUG - State Change:');
      console.log('  Event:', event);
      console.log('  Session exists:', !!session);
      console.log('  Raw session user:', session?.user);
      
      if (session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata?.full_name,
        };
        console.log('  User ID:', session.user.id);
        console.log('  User Email:', session.user.email);
        console.log('  Processed user:', user);
        callback(user);
      } else {
        console.log('  No user in session');
        callback(null);
      }
    });
  },
};
