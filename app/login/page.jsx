"use client"
import React, { useEffect, useState } from 'react'
import supabase from "../../utils/supabaseClient";
import Image from 'next/image'


const page = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState('dark');

    useEffect(()=>{
      const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
    })
  
    const handleSignIn = async () => {
      setLoading(true);
      try {
        const { user, session } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/updateUsers`,
          },
        });
       

        
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row default shadow-lg rounded-lg max-w-4xl w-full overflow-hidden">
        {/* Left side with Image */}
        <div className="w-full lg:w-7/12">
          <Image
            src={"/wizardcat.webp"}
            alt="logo"
            width={1000}
            height={1000}
            className="object-contain "
          />
        </div>
    
        {/* Right side with Logo at Top and Content Centered */}
        <div className="w-full lg:w-5/12 p-4 flex flex-col justify-between">
          {/* Logo stays at the top */}
          <div className="flex justify-center m-4  dark:bg-gray-800 p-2 rounded-full">
            <Image
              src={theme === 'light' ? "/contestSpherelight.png" : "/contestSpheredark.png"}
              alt="logo"
              width={200}
              height={20}
              className="object-contain "
            />
          </div>
    
          {/* Centered Text and Button */}
          <div className="flex flex-col justify-center items-center flex-grow">
            <h1 className="text-3xl font-bold text-center mb-6">
              Whoosh! Your magical journey begins here
            </h1>
            <p className="default mb-4">
              Build up your portfolio by joining contests so you can land an interview later. Hopefully. No Promise tho.
            </p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    );
}

export default page;
