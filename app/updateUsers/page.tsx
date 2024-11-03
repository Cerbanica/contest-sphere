'use client';
import supabase from '@/utils/supabaseClient';
import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { NextResponse } from 'next/server'



const Page = () => {
   

    const router = useRouter();



    useEffect(() => {


        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                try {
                    // Check if email already exists in the 'users' table
                    const { data: existingUser, error: checkError } = await supabase
                        .from('users')
                        .select('email,role')
                        .eq('email', session.user.email)
                        .single(); // Use single() since email should be unique

                    if (checkError && checkError.code !== 'PGRST116') {
                        // Handle error if it's not a "no rows found" error
                        throw checkError;
                    }

                    /* if (existingUser&&userAuth) {
                        console.log('User already exists:', existingUser.email);
                        console.log('Role:', existingUser.role);
                        if(existingUser.role==='admin'){
                          router.push('/admin'); // Redirect to home or other page
  
                        }else{
                          router.push('/about'); // Redirect to home or other page
  
                        }
                        return;
                    }else{
                      alert('not loffed');
                    } */

                    if (!existingUser) {

                        // If email does not exist, insert user data
                        const { data, error } = await supabase
                            .from('users')
                            .insert({
                                email: session.user.email,
                                full_name: session.user.user_metadata.full_name,
                            });

                        if (error) throw error;

                    }



                    router.push('/'); // Redirect to home or other page
                } catch (err) {
                    console.error('Error inserting user:', err);
                    //setError('Failed to insert user data');
                }
            } else {
                router.push('/'); // Redirect to home if no session is found
            }
        };

        getSession();
    }, [router]);


    return null;
};

export default Page;
/* function setError(arg0: string) {
    throw new Error('Function not implemented.');
}
 */
