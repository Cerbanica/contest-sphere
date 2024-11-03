// stores/authStore.js
import {create }from "zustand";
import supabase from "../supabaseClient";


const useAuthStore = create((set) => ({
  user: null,
  role: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),

  // For cases where Zustand state needs updating after login
  syncUserRole: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const user = session.user;
      set({ user });
      
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", user.email)
        .single();
        
      if (error) throw error;
      set({ role: data.role });
    }
  },

  checkOrAddUser: async (userData) => {
    try {
      set({ loading: true });
      const { data: existingUser, error } = await supabase
        .from("users")
        .select("email,role")
        .eq("email", userData.email)
        .single();

        if (error && error.code !== 'PGRST116') {
          // Handle error if it's not a "no rows found" error
          throw error;
      }

      if (!existingUser) {
        // If email does not exist, insert user data
        const { data, error } = await supabase
        .from('users')
        .insert({
            email: session.user.email,
            full_name: session.user.user_metadata.full_name,
        });
        if (error) throw error;

                  console.log('User inserted:', data);
      }

      set({ user: userData });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => set({ user: null, role: null }),
}));

export default useAuthStore;
