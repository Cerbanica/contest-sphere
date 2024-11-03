import { createClient } from "@supabase/supabase-js";
import useAuthStore from "@/stores/authStore";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Login function WTF NI SUPABASE LOGIN NOT GUGEL
export async function login(email, password) {
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });

  if (error) {
    throw new Error("Login failed: " + error.message);
  }

  // Fetch user role from Supabase profiles table
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("email", user.email)
    .single();

  if (profile) {
    const { setUser, setRole } = useAuthStore.getState();
    setUser({ email: user.email });
    setRole(profile.role || "user"); // Set role, default to "user"
  }else{
          // If email does not exist, insert user data
          const { data, error } = await supabase
          .from('users')
          .insert({
              email: session.user.email,
              full_name: session.user.user_metadata.full_name,
              role:'users'
          });
          setUser({ email: session.user.email });
         setRole("user");

  }
}

// Logout function
export async function logout() {
  await supabase.auth.signOut();
  const { logout } = useAuthStore.getState();
  logout();
}
