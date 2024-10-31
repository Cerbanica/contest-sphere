import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import supabase from '@/utils/supabaseClient';

export const useAuth = (redirectPath = '/login') => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      }

      if (session) {
        setUser(session.user); // User is logged in
      } else {
        // Check if the current path is "/"
        if (pathname === '/') {
         
           // Redirect to login or another page if not authenticated
        }else{
          
          
          router.push(redirectPath);
        }
      }
    };

    getSession();
  }, [router, redirectPath]);

  return user;
};
