"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CustomButton from './customButton'
import "../globals.css";
import { MoonIcon } from '@heroicons/react/20/solid'
import { SunIcon } from '@heroicons/react/24/solid'
import supabase from '@/utils/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'
import { ReportFeedbackForm } from './reportFeedback/components'
import useAuthStore from '@/utils/stores/authStore';

interface User {
  email: string;

  user_metadata: {
    full_name: string;
    avatar_url: string;
  };
}

const Navbar: React.FC = () => {
  const { role, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null); // State to store user information
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  useEffect(() => {
    // Check and set the initial theme based on user's system preference or local storage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme as 'light' | 'dark');
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    // Check if the user is logged in
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user as unknown as User); // Set user data if logged in


      }
    };
    getSession();
  }, []);

  const toggleTheme = () => {
    const newTheme: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme); // Persist the user's theme choice
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      await logout();
      setUser(null); // Reset user state after logging out
    }
    
    router.push("/");
   
  };
  // Don't render the navbar if the current route is the login page
  if (pathname === '/login' || pathname === "/admin") {
    return null; // Do not render the component on the login page
  }
  return (
    <>
      <div className="w-full default sticky top-0 z-50 shadow-lg">
        <div className="w-full lg:w-8/12  mx-auto flex justify-between items-center px-4 py-4">

          {/* Left Section: Logo */}
          <div className="flex items-center">
          <a href="/" onClick={() => window.location.reload()} className="flex justify-center items-center">
          <Image
                src={theme === 'light' ? "/contestSpherelight.png" : "/contestSpheredark.png"}
                alt="logo"
                width={118}
                height={18}
                className="object-contain"
              />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={toggleMobileMenu} className="text-default focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* Center Section: Menu Items (hidden on mobile) */}
          <div className="hidden lg:flex  justify-center items-center space-x-4">
          <a href="/" className='text-center default'>Categories</a>
            <a href="/createContestPage" className='text-center default'>Post Contest</a>
            <button className='default ' onClick={handleOpenModal}>Give Feedback</button>
            <button className='default ' onClick={handleOpenModal}>About Us</button>

            {user ? (
              <a href="/myContest" className='text-default'>My Contest</a>
            ) : ''}
          </div>

          {/* Right Section: Theme Toggle and User Info/Login (hidden on mobile) */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-default">Welcome, {user.user_metadata.full_name || user.email}</span>
                <button onClick={handleLogout} className="default">Logout</button>
              </>
            ) : (
              <Link href="/login" className="default">Login</Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-1 text-white rounded-full border-solid dark:border-gray-800 border-purple-300 border-4 bg-toggleButton items-center dark:text-white transition duration-1000 ease-in-out"
            >
              {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu: Shows when mobile menu is toggled */}
          {mobileMenuOpen && (
            
            <div  onClick={toggleMobileMenu} className="absolute bg-gray-900/60  h-[100vh] top-full left-0  rounded-b-xl  w-full  lg:hidden shadow-lg">
              <div className="flex flex-col border-b default  ">
              <a href="/" className='default py-2 border-b border-t text-center'>Home</a>

               
                <a href="/createContestPage" className='default py-2 border-b rounded-lg text-center'>Post Contest</a>
                <button className='default py-2 border-b rounded-lg text-center ' onClick={handleOpenModal}>Give Feedback</button>
                <div className="flex default  border-b py-2 justify-center ">
                  <button
                    onClick={toggleTheme}
                    className='flex flex-row   gap-2 text-center'        >
                    {theme === 'light' ? <><MoonIcon className="h-6 w-6" /> <p>Dark Mode</p></> : <><SunIcon className="h-6 w-6" /><p>Light Mode</p></>}

                  </button>
                </div>
                {user ? (
                  <a href="/myContest" className='default py-2 border-b text-center'>My Contest</a>
                ) : ''}
                {user ? (
                  <>

                    <button onClick={handleLogout} className="default py-2 border-b text-center">Logout</button>
                  </>
                ) : (
                  <Link href="/login" className="default py-2 border-b text-center">Login</Link>
                )}
                

                <button
                  onClick={toggleMobileMenu}
                  className='text-default rounded-2xl py-2 '>X</button>

              </div>
            </div>
          )}
        </div>
      </div>
      <ReportFeedbackForm isOpen={isModalOpen} onClose={handleCloseModal} contestTitle={null} contestId={null} />

    </>

  )
}

export default Navbar;
