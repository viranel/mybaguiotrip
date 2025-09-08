import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  fullName?: string;
}

// Function to save credentials to a text file and optionally to database (development only)
const saveCredentialsToFile = async (email: string, password: string, fullName?: string, saveToDatabase: boolean = false) => {
  const credentials = `MyBaguioTrip - User Credentials
Generated: ${new Date().toLocaleString()}

Email: ${email}
Password: ${password}
Full Name: ${fullName || 'Not provided'}

Note: This file is for development purposes only.
Remove this functionality before production deployment.
`;

  console.log('📄 Credentials text:', credentials);

  // Try to save to file (only works on mobile, not web)
  let fileUri = null;
  try {
    const fileName = `credentials_${Date.now()}.txt`;
    fileUri = FileSystem.documentDirectory + fileName;
    
    await FileSystem.writeAsStringAsync(fileUri, credentials);
    
    console.log('📄 Credentials saved to file:', fileUri);
    
    // Try to share the file if sharing is available
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Save MyBaguioTrip Credentials',
        });
        console.log('📤 Credentials file shared successfully');
      }
    } catch (shareError) {
      console.log('📤 Sharing not available or failed:', shareError);
    }
  } catch (fileError) {
    console.log('📄 File system not available (web platform):', fileError.message);
    // Continue with database save even if file save fails
  }
  
  // Always try to save to database (works on all platforms)
  if (saveToDatabase) {
    try {
      console.log('🔄 Attempting to save credentials to database...');
      console.log('📧 Email:', email);
      console.log('📝 Credentials length:', credentials.length);
      
      const { data, error } = await supabase
        .from('user_credentials')
        .insert({
          email: email,
          credentials_text: credentials,
          created_at: new Date().toISOString(),
          is_development: true
        });
      
      console.log('📊 Database response:', { data, error });
      
      if (error) {
        console.error('❌ Error saving credentials to database:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
      } else {
        console.log('✅ Credentials saved to database successfully');
        console.log('✅ Inserted data:', data);
      }
    } catch (dbError) {
      console.error('💥 Database error:', dbError);
      console.error('💥 Error stack:', dbError.stack);
    }
  }
  
  return fileUri;
};

export const auth = {
  async signUp(email: string, password: string, fullName?: string) {
    try {
      console.log('Attempting signup with:', { email, fullName });
      console.log('🔐 DEV DEBUG - Password for testing:', password);
      
      // Save credentials to file and database for development
      await saveCredentialsToFile(email, password, fullName, true);
      
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

  // Development function to export current user credentials
  async exportCurrentUserCredentials(password?: string) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        throw new Error('No user logged in');
      }

      const credentials = `MyBaguioTrip - Current User Credentials
Generated: ${new Date().toLocaleString()}

Email: ${user.email}
Password: ${password || '[Password not provided - use password reset]'}
Full Name: ${user.user_metadata?.full_name || 'Not provided'}
User ID: ${user.id}

Note: This file is for development purposes only.
Remove this functionality before production deployment.
`;

      const fileName = `current_user_credentials_${Date.now()}.txt`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, credentials);
      
      console.log('📄 Current user credentials saved to:', fileUri);
      console.log('📄 File contents:', credentials);
      
      // Try to share the file
      try {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/plain',
            dialogTitle: 'Export MyBaguioTrip Credentials',
          });
          console.log('📤 Credentials file shared successfully');
        }
      } catch (shareError) {
        console.log('📤 Sharing not available or failed:', shareError);
      }
      
      return { success: true, fileUri };
    } catch (error: any) {
      console.error('Error exporting credentials:', error);
      return { success: false, error: error.message };
    }
  },

  // Development function to retrieve credentials from database
  async getCredentialsFromDatabase() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('No user logged in');
      }

      const { data, error } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('email', user.email)
        .eq('is_development', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { success: true, credentials: data };
    } catch (error: any) {
      console.error('Error retrieving credentials from database:', error);
      return { success: false, error: error.message };
    }
  },
};
