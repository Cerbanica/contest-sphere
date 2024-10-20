"use client"
import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import supabase from '@/utils/supabaseClient'
import { defaultFormData } from '../dataList'
import { ContestCard } from '../components'
import { formatDateManual, formatEntry, calculateDaysRemaining } from '@/utils/contestUtils';
import { BookmarkButton, CategoryLink, ListSection, MainPrizeEntryFee, RemainingDays } from '../components/contestDetailsCard/components';


const page = () => {
    const [theme, setTheme] = useState('dark');
    const [contestDetails, setContestDetails] = useState(defaultFormData);
    const [contestList, setContestList] = useState([]);
    const [showDetailsCard, setShowDetailsCard] = useState(false);

    let status = "Pending";


    useEffect(() => {

        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }


        const fetchContests = async () => {
            try {
                let query = supabase.from('contests').select('id, title, linkToThumbnail, prizeRange, mainPrize, category, deadline,status,startdate, description, entryFee').eq('status', status);;


                const { data, error, count } = await query;

                if (error) throw error;

                setContestList(data);
                /*   setFetchError(null);
                  setTotalItems(count);
                  setTotalPage(Math.ceil(count / itemsPerPage)); */
            } catch (error) {
                //setFetchError('Couldn\'t fetch contest data');
                setContestList([]);
            }
        };

        fetchContests();
    }, []);
    const approveReject =  async (contestId,newStatus) =>{
        const { data, error } = await supabase
        .from('contests')      // Select the 'contests' table
        .update({ status: newStatus })  // Specify the column to update and its new value
        .eq('id', contestId);  // Match the row where 'id' equals 'contestId'

    if (error) {
        console.error('Error updating contest:', error);
    } else {
        console.log('Contest updated:', data);
        const updatedContestList = contestList.filter(contest => contest.id !== contestId);
        setContestList(updatedContestList);

        const newContest = updatedContestList.length > 0 ? updatedContestList[0] : null;

           // Step 4: If another contest is available, set it as the contestDetails
           if (newContest) {
           // alert(newContest.id);
            viewContestDetails(newContest.id);
        } else {
            // Handle the case where no contest is available (empty list)
            setShowDetailsCard(false);
            setContestList([]);
        }
    }
    }
    const viewContestDetails = (contestId) => {


        const fetchContest = async () => {
            const { data, error } = await supabase
                .from('contests')
                .select('*')
                .eq('id', contestId)
                .single(); // Fetch a single row

            if (error) {
                console.error('Error fetching contest details:', error);
            } else {



                setContestDetails(data);
                //toggleDetailsCardMobile();
                setShowDetailsCard(true);




            }
        }



        fetchContest();


    };
    return (
        <div className='flex flex-row p-4'>
            <div className='w-2/12 default-2 border p-4 pt-0 h-[95vh] rounded-2xl rounded-r-none flex flex-col'>
                <div className="text-lg default-2 border-b min-h-20 flex justify-center  p-2 flex-col ">

                    <h1 className='text-lg text-default'>email</h1>
                    <h1 className='text-sm text-default-2'>admin</h1>

                </div>
                <button className='p-2 cursor-pointer hover:dark:bg-slate-700 text-left'>Dashboard</button>
                <button className='p-2 cursor-pointer hover:dark:bg-slate-700 text-left'>Contest</button>
                <button className='p-2 cursor-pointer hover:dark:bg-slate-700 text-left'>Reports & Feedbacks</button>
                <button className='p-2 cursor-pointer hover:dark:bg-slate-700 text-left'>Create a Post</button>
                <button className='p-2 cursor-pointer hover:dark:bg-slate-700 text-left'>Light Mode</button>

                <div className="mt-auto mb-10">
                    <span className='default-2 border-t text-lg text-default py-4 flex flex-col'>Logout</span>
                </div>
            </div>
            <div className="w-10/12 default overflow-y-auto p-4 pt-0 border border-l-0 h-[95vh] rounded-2xl rounded-l-none flex flex-col">
                <div className="w-full default border-b min-h-20 flex items-center justify-between">
                    <Image
                        src={theme === 'light' ? "/contestSpherelight.png" : "/contestSpheredark.png"}
                        alt="logo"
                        width={180}
                        height={18}
                        className="object-contain"
                    />                    <span className=' text-lg text-default flex flex-col'>Good Morning <span className='text-default-2 text-sm  bg-none'>Tuesday, 12th August 2024</span></span>

                    <span className='  text-lg text-default border border-cs '>last 24 Hours</span>
                </div>

                <div className="w-full default border-b p-4  flex justify-between flex-row gap-2">
                    <div className="flex-1  bg-slate-800 flex flex-col rounded-lg p-4 text-center ">
                        <span className='text-4xl text-default '>24</span>
                        <span className='text-sm text-default'>contest pending approval</span>
                        <span className='text-sm text-default-2'>684 total contests</span>
                    </div>
                    <div className="flex-1  flex flex-col rounded-lg p-4 text-center">
                        <span className='text-4xl text-default'>100</span>
                        <span className='text-sm text-default'>unread reports & feedbacks</span>
                        <span className='text-sm text-default-2'>64 total reports & feedbacks</span>
                    </div>
                    <div className="flex-1   flex flex-col rounded-lg p-4 text-center">
                        <span className='text-4xl text-default'>20</span>
                        <span className='text-sm text-default'>new user</span>
                        <span className='text-sm text-default-2'>104 total users</span>
                    </div>


                </div>
                <div className="   p-4 flex flex-col gap-4">
                    <h1 className="w-full text-center text-cs text-3xl sticky top-0">Contests</h1>
                    {!showDetailsCard ? (
                        <>
                            <h1 className="w-full text-center text-cs text-3xl">Searchbar</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

                                {contestList.map((contest) => (

                                    <div key={contest.id} >
                                        <ContestCard contest={contest} onClick={() => viewContestDetails(contest.id)} />
                                    </div>
                                ))}
                            </div>
                        </>) : (
                        <>
                            <span className='w-full flex flex-row gap-4 min-h-[50vh]'>

                                <div className="flex-1 default flex flex-col">
                                    <div
                                        className="bg-cover bg-center lg:min-h-[30vh] min-h-[30vh] min-w-[20vh] h-full w-full rounded-xl lg:rounded-b-none "
                                        style={{
                                            backgroundImage: `url('${contestDetails.linkToThumbnail || 'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg'}')`,
                                        }}
                                    ></div>
                                    <div className='p-4 pt-0'>
                                        {/* Content Section */}
                                        <div className="w-full  rounded-r-xl">
                                            <div className="flex flex-col w-full pt-2  sticky top-0  border-b shadow-lg border-t lg:border-t-0  default">

                                                {/* Title and Bookmark */}
                                                <div className="flex w-full flex-row items-end justify-between pb-2   ">
                                                    <div className='w-9/12 flex flex-col'>
                                                        <span className=" font-bold text-3xl overflow-hidden m-0">
                                                            {contestDetails.title}
                                                        </span>
                                                        <a href={"/?search=" + contestDetails.organizer} className='text-lg text-blue-400 -mt-2 underline'>{contestDetails.organizer}</a>
                                                    </div>
                                                </div>

                                                {/* Category, Date, and Deadline */}
                                                <div className="flex flex-row justify-between">
                                                    <div className="flex flex-col w-9/12 pb-2">
                                                        <div className="flex   flex-row align-middle">
                                                            <CategoryLink category={contestDetails.category} />
                                                            <span className="text-lg text-gray-400 px-2">
                                                                {formatDateManual(contestDetails.startdate, contestDetails.deadline)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Days Remaining */}
                                                    <RemainingDays deadline={contestDetails.deadline} />
                                                </div>
                                            </div>



                                            <MainPrizeEntryFee mainPrize={contestDetails.mainPrize} entryFee={contestDetails.entryFee} />
                                            <div className="py-4 border-t shadow-inner default">
                                                <span className="text-default-2  text-lg text-justify">
                                                    {contestDetails.description}
                                                </span>
                                            </div>



                                        </div>
                                    </div>

                                </div>
                                <div className="flex-1 default flex flex-col">
                                    {/* Prize List */}
                                    <ListSection title={"List of Prizes"} items={contestDetails.prizeList} />

                                    {/* Judges List */}
                                    <ListSection title={"List of Prizes"} items={contestDetails.prizeList} />

                                </div>
                                <div className="flex-1 default flex flex-col">Others
                                <button onClick={()=>approveReject(contestDetails.id,"On Going")} className=' p-2 rounded -lg min-w-72 bg-green-700 text-default-inverse text-lg font-bold'>Approve</button>
                                <button onClick={()=>approveReject(contestDetails.id,"Denied")} className='mt-2 min-w-72 border border-green-700 text-default-inverse text-lg font-bold p-2 rounded -lg '>Reject</button>

                           
                                </div>

                            </span>
                            </>
                    )}
                    <h1 className="w-full text-center text-cs text-3xl sticky top-0">Report and Feedback</h1>


                </div>

            </div>
        </div>
    )
}

export default page
