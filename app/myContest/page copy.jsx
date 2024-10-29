'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/utils/supabaseClient';
import { useAuth } from '@/utils/useAuth';
import { ContestCard } from '../components';
import { TrashIcon} from '@heroicons/react/24/solid'





const Page = () => {
  const [user, setUser] = useState(null); // State to store user information
  const [contests, setContests] = useState([]); // State to store contests
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter(); // Next.js router for redirection
  const userAuth = useAuth(); // Custom hook to get authenticated user

  useEffect(() => {
    if (userAuth) {
      setUser(userAuth);
    
      fetchUserContests(userAuth.email);
    }
  }, [userAuth]);

  // Fetch contests saved by the user from the user_contests table
  const fetchUserContests = async (email) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_contests')
      .select('contest_id, contests(id, title, prizeRange, mainPrize, description, category, deadline,status, entryFee)')
      .eq('email', email);

    if (error) {
      console.error('Error fetching user contests:', error);
    } else {
      setContests(data.map((item) => ({ ...item.contests, id: item.contest_id })));
    }
    setLoading(false);
  };

  // Handle contest removal
  const handleRemoveContest = async (contestId) => {
    const { error } = await supabase
      .from('user_contests')
      .delete()
      .eq('email', user.email)
      .eq('contest_id', contestId);

    if (error) {
      console.error('Error removing contest:', error);
    } else {
      // Remove the contest from the local state
      setContests(contests.filter(contest => contest.id !== contestId));
    }
  };

  // Handle contest click to redirect to contest page
  const handleContestClick = (contestId) => {
    router.push(`/contest/${contestId}`);
  };

  if (loading) return <div>Loading....</div>;

  return (
    <div className="min-h-screen bg-transparent ">
    <div className="container mx-auto">      
    <div className="w-full flex justify-center items-center flex-col">
     <h1 className="text-cs font-bold text-3xl text-center mt-4  ">My Contest</h1>
     <div className="w-full flex justify-center mt-2 items-center">
         <hr className="border-t-1 border-cs w-full lg:w-1/2" />
      </div>
    
      <div className=" flex flex-col  justify-items-center items-center gap-2  lg:w-1/2 sm:w-11/12 mt-2 ">        {contests.map(contest => (
          <>
          <div key={contest.id} className=" rounded-2xl bg-gray-100 dark:bg-transparent dark:border dark:border-gray-700">
          <div className="relative  rounded-2xl">
     
      {/* Button on top left */}
      <button
        className="absolute z-10 top-2 left-2 default-2 items-center text-default-invert px-4 py-2 rounded-lg "
        onClick={() => handleRemoveContest(contest.id)}
      >
        <TrashIcon className="w-6 fill-red-400 " />
      </button>
          <ContestCard contest={contest} />
          
         
            
      </div>
      </div>
      
      
      </>
           
        ))}
      </div>

      {contests.length === 0 && (
        <p className="mt-6 text-center text-gray-500">No saved contests found.</p>
      )}
    </div>
    </div>
    </div>
  );
};

export default Page;
