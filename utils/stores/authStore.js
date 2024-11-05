// stores/authStore.js
import { create } from 'zustand';
import supabase from '../supabaseClient';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      loading: true,
      error: null,

      verifyUserRole: async (userData) => {
        try {
          set({ loading: true });
          const { data: existingUser, error } = await supabase
            .from("users")
            .select("email,role")
            .eq("email", userData.email)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          if(existingUser){
            set({ role: existingUser.role });
          }else{

            // If email does not exist, insert user data
            const { data, error } = await supabase
              .from("users")
              .insert({
                email: userData.email,
                full_name: userData.user_metadata.full_name,
                role: 'normal',
              });

            if (error) throw error;

            console.log("User inserted:", data);
            set({ role: 'normal' });
          }
          set({ user: userData, loading: false });
        } catch (error) {
          set({ error: error.message , loading: false});
        } finally {
          set({ loading: false });
        }
      },

      checkOrAddUser: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const userData = session.user;
          set({ loading: true });
          
          const { data: existingUser, error } = await supabase
            .from("users")
            .select("email,role")
            .eq("email", userData.email)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          let userRole = 'Guest';

          if (!existingUser) {
            // If email does not exist, insert user data
            const { data, error } = await supabase
              .from("users")
              .insert({
                email: session.user.email,
                full_name: session.user.user_metadata.full_name,
                role: 'normal1',
              });

            if (error) throw error;

            console.log("User inserted:", data);
            userRole = 'normal1';
          } else {
            userRole = existingUser.role;
          }

          set({ role: userRole });
          set({ user: userData });
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      logout: () => set({ user: null, role: null }),
    }),
    {
      name: 'user-store', // Unique name for local storage key
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

export default useAuthStore;
