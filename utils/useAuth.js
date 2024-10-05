// utils/useAuth.js or hooks/useAuth.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/utils/supabaseClient';

export const useAuth = (redirectPath = '/login') => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      }

      if (session) {
        setUser(session.user); // User is logged in
      } else {
        router.push(redirectPath); // Redirect to login or home if not authenticated
      }
    };

    getSession();
  }, [router, redirectPath]);

  return user;
};
