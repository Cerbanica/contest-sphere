"use client";

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import  useAuthStore  from '@/utils/stores/authStore';
import supabase from '@/utils/supabaseClient';
import { useRouter } from "next/navigation";


const Page = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(null);
  const { user, setUser, checkOrAddUser, syncUserRole } = useAuthStore();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const handleSignIn = async () => {
   
    setLoading(true);
     try {
      console.log("Attempting sign-in...");
      const { data:session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/updateUsers`,
        },
      })
     
     /*  //if (error) throw error;

      const userData = {
       
        email: session.user.email,
        name: session.user.user_metadata.full_name,
      };
    
      setUser(userData);
      await checkOrAddUser(userData);
      console.log("here2");
      await syncUserRole(); // Fetch and sync user role in Zustand
      router.push('/about'); */
      
    } catch (error) {
      console.error("Error in handleSignIn:", error);
    setError(error.message);
    } finally {
      setLoading(false);
    } 
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-0 m-0" style={{
      backgroundImage: `url('/csbg (1).png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="flex flex-col lg:flex-row default border shadow-lg rounded-lg max-w-4xl w-full overflow-hidden">
        <div className="w-full lg:w-7/12">
          <Image src="/wizardcat.webp" alt="logo" width={1000} height={1000} className="object-contain" />
        </div>

        <div className="w-full lg:w-5/12 flex flex-col border-l default justify-between">
          <div className="flex justify-center border-b default-2 p-4">
            <Image src={theme === 'light' ? "/contestSpherelight.png" : "/contestSpheredark.png"} alt="logo" width={200} height={20} className="object-contain" />
          </div>

          <div className="flex flex-col p-4 flex-grow">
            <h1 className="text-3xl font-bold text-center mb-6">
              Whoosh! Your magical journey begins here
            </h1>
            <p className="text-sm text-default-2 mb-4">
              Build up your portfolio by joining contests so you can land an interview later. Hopefully. No promise though.
            </p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button onClick={handleSignIn} disabled={loading} className={`w-full mt-auto mb-12 button-secondary transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
