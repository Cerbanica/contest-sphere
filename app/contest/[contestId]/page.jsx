'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/utils/supabaseClient';
import { Tabs } from '@/app/components';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/useAuth';

const Page = ({ params }) => {
  const userAuth = useAuth(); // Use authentication hook
  const [isAdded, setIsAdded] = useState(false);
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabsData] = useState([
    { id: 1, name: 'Prizes List', content: 'Tab 1 content <b>huh</b>' },
    { id: 2, name: 'Judges', content: 'Tab 2 content' },
    { id: 3, name: 'Submission Format', content: 'Tab 3 content' },
  ]);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const contestId = params.contestId; // Contest ID from params

  useEffect(() => {
    const fetchContest = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', contestId)
        .single(); // Fetch a single row

      if (error) {
        console.error('Error fetching contest details:', error);
      } else {
        setContest(data);
      }
      setLoading(false);
    };

    fetchContest();
  }, [contestId]);

  // Check if the contest has been added by the user
  useEffect(() => {
    const checkIfContestAdded = async () => {
      if (userAuth) {
        const { data: existingEntry, error } = await supabase
          .from('user_contests')
          .select('*')
          .eq('email', userAuth.email) // Directly use userAuth.email
          .eq('contest_id', contestId)
          .single();

        if (existingEntry) {
          setIsAdded(true);
        } else {
          setIsAdded(false);
        }
      }
    };

    if (userAuth) {
      checkIfContestAdded();
    }
  }, [userAuth, contestId]);

  const handleAddUserContest = async () => {
    try {
      if (userAuth) {
        if (isAdded) {
          // Remove contest
          const { error } = await supabase
            .from('user_contests')
            .delete()
            .eq('email', userAuth.email)
            .eq('contest_id', contestId);

          if (error) {
            setMessage(`Error: ${error.message}`);
          } else {
            setMessage('Contest removed from list.');
            setIsAdded(false); // Update UI
          }
        } else {
          // Add contest
          const { error } = await supabase
            .from('user_contests')
            .insert([{ email: userAuth.email, contest_id: contestId }]);

          if (error) {
            setMessage(`Error: ${error.message}`);
          } else {
            setMessage('Contest added to list.');
            setIsAdded(true); // Update UI
          }
        }
      } else {
        alert("Please login to save contest");
        router.push('/login'); // Redirect if not logged in
      }
    } catch (err) {
      setMessage(`Unexpected error: ${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 sm:p-12">
      <h1 className="text-xl font-bold my-2">{contest?.title || 'Contest Details'}</h1>
      <p>{contest?.category}</p>
      <p>RM{contest?.firstPrize}</p>
      <p>
        Is Added status: {isAdded ? 'True' : 'False'}, user email: {userAuth?.email || 'Not logged in'}, contest ID: {contestId}
      </p>
      <button className="default rounded-xl p-5 text-lg m-6" onClick={handleAddUserContest}>
        {isAdded ? 'Remove from list' : 'Add Contest'}
      </button>
      <Tabs tabsData={tabsData} />
    </div>
  );
};

export default Page;
