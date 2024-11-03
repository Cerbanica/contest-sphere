"use client"
import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import supabase from '@/utils/supabaseClient'
import { defaultFormData } from '../dataList'
import { ContestCard, ReportFeedbackCard } from '../components'
import { formatDateManual, formatEntry, calculateDaysRemaining } from '@/utils/contestUtils';
import { BookmarkButton, CategoryLink, ListSection, MainPrizeEntryFee, RemainingDays } from '../components/contestDetailsCard/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from "next/navigation";
import  useAuthStore  from '@/utils/stores/authStore';



import { useAuth } from '@/utils/useAuth';

const page = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const { role, syncUserRole, user } = useAuthStore();
   // const userAuth = useAuth(); 
    const [theme, setTheme] = useState('dark');
    const [count,setCount]=useState({newUser:-1000,totalUser:-1000,totalContest:-1000,pendingContest:-1000, newReport:-1000, totalReport:-1000})
    const [contestDetails, setContestDetails] = useState(defaultFormData);
    const [contestList, setContestList] = useState([]);
    const [reportFeedbackList, setReportFeedbackList] = useState([]);
    const [showDetailsCard, setShowDetailsCard] = useState(false);
    let status = "Pending";
    const updateCount = (newValues) => {
        setCount((prevCount) => ({
            ...prevCount,  // Keep the previous state
            ...newValues   // Merge new values
        }));
    };
    useEffect(() => {
        
      
    },[count]);

    useEffect(() => {
        // Fetch and sync role once
        const checkUserRole = async () => {
            setIsLoading(true);
            await syncUserRole();

            // Redirect if the user is not an admin
            if (role !== 'admin') {
                //router.push('/');
            } else {
                setIsLoading(false);
            }
        };

        checkUserRole();
    }, [router, role]);
    
      

      // Fetch theme, contests, report feedback, and users on mount
      useEffect(() => {
        // Theme setup
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }

        // Fetch all initial data
        const fetchData = async () => {
            try {
                // Fetch contests
                const pendingQuery = supabase
                    .from('contests')
                    .select('id, title, linkToThumbnail, prizeRange, mainPrize, category, deadline,status,startdate, description, entryFee', { count: 'exact' })
                    .eq('status', status);
                const { data: contestData, count: pendingContestCount } = await pendingQuery;
                setContestList(contestData);

                const totalContestQuery = supabase.from('contests').select('*', { count: 'exact' });
                const { count: totalContestCount } = await totalContestQuery;

                // Fetch report feedback
                const reportFeedbackQuery = supabase.from('reportFeedback').select('*', { count: 'exact' }).eq('status', status);
                const { count: newReportCount } = await reportFeedbackQuery;
                const totalReportQuery = supabase.from('reportFeedback').select('*', { count: 'exact' });
                const { count: totalReportCount } = await totalReportQuery;

                // Fetch users
                const newUserQuery = supabase
                    .from('users')
                    .select('*', { count: 'exact' })
                    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
                const { count: newUserCount } = await newUserQuery;
                const totalUserQuery = supabase.from('users').select('*', { count: 'exact' });
                const { count: totalUserCount } = await totalUserQuery;

                // Update counts
                updateCount({
                    pendingContest: pendingContestCount,
                    totalContest: totalContestCount,
                    newReport: newReportCount,
                    totalReport: totalReportCount,
                    newUser: newUserCount,
                    totalUser: totalUserCount,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };  

        fetchData();
    }, []);
    
    const approveReject = async (contestId, newStatus) => {
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
    const fixedDismiss = async (Id, newStatus) => {
        const { data, error } = await supabase
            .from('reportFeedback')      // Select the 'contests' table
            .update({ status: newStatus })  // Specify the column to update and its new value
            .eq('id', Id);  // Match the row where 'id' equals 'contestId'

        if (error) {
            console.error('Error updating contest:', error);
        } else {
            console.log('Report Feedback updated:', data);
            const updatedList = reportFeedbackList.filter(item => item.id !== Id);
            setReportFeedbackList(updatedList);

            const newItems = updatedList.length > 0 ? updatedList[0] : null;

            // Step 4: If another contest is available, set it as the contestDetails
            if (newItems) {
                // alert(newContest.id);
                setReportFeedbackList(newItems);
            } else {

                setReportFeedbackList([]);
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
        <div className='flex flex-row p-4 '>
            {isLoading ?(
                <div className=' w-full text-default-2  p-10 items-center justify-items-center gap-20 flex flex-col'> <h1 className='text-2xl'>This Page is for Admin Only</h1><a href="/" className='w-96 button-primary'>Back</a></div>
            ):(
                <>
            <div className='w-2/12 default border p-4 pt-0 h-[90vh] rounded-2xl rounded-r-none flex flex-col'>
                <div className="text-lg default border-b min-h-20 flex justify-center  p-2 flex-col ">

                    <h1 className='text-lg text-default'>email</h1>
                    <h1 className='text-sm text-default-2'>admin</h1>

                </div>
                <button className='p-2 cursor-pointer hover:dark:bg-slate-700 text-left'>Dashboard</button>
                <button className='p-2 cursor-pointer hover:dark:bg-slate-700 text-left'>Contest</button>
                <button className='p-2 cursor-pointer hover:dark:bg-slate-700 text-left'>Reports & Feedbacks</button>
                <button className='p-2 cursor-pointer hover:dark:bg-slate-700 text-left'>Create a Post</button>
                <button className='p-2 cursor-pointer hover:dark:bg-slate-700 text-left'>Light Mode</button>

                <div className="mt-auto ">
                    <span className='default border-t text-lg text-default py-4 flex flex-col'>Logout</span>
                </div>
            </div>
            <div className="w-10/12  p-4 default-border overflow-y-auto  pt-0 border border-l-0 h-[90vh] rounded-2xl rounded-l-none flex flex-col">
                <div className="w-full default-border border-b min-h-20 flex items-center justify-between">
                    <Image
                        src={theme === 'light' ? "/contestSpherelight.png" : "/contestSpheredark.png"}
                        alt="logo"
                        width={180}
                        height={18}
                        className="object-contain"
                    />                    <span className=' text-lg text-default flex flex-col'>Good Morning <span className='text-default-2 text-sm  bg-none'>Tuesday, 12th August 2024</span></span>

                    <span className='  text-lg text-default border border-cs '>last 24 Hours</span>
                </div>

                <div className="w-full default-border border-b p-4  flex justify-between flex-row gap-2">
                    <div className="flex-1  bg-slate-800 flex flex-col rounded-lg p-4 text-center ">
                        <span className='text-4xl text-default '>{count.pendingContest}</span>
                        <span className='text-sm text-default'>contest pending approval</span>
                        <span className='text-sm text-default-2'>{count.totalContest} total contests</span>
                    </div>
                    <div className="flex-1  flex flex-col rounded-lg p-4 text-center">
                        <span className='text-4xl text-default'>{count.newReport}</span>
                        <span className='text-sm text-default'>unread reports & feedbacks</span>
                        <span className='text-sm text-default-2'>{count.totalReport} total reports & feedbacks</span>
                    </div>
                    <div className="flex-1   flex flex-col rounded-lg p-4 text-center">
                        <span className='text-4xl text-default'>{count.newUser}</span>
                        <span className='text-sm text-default'>new user</span>
                        <span className='text-sm text-default-2'>{count.totalUser} total users</span>
                    </div>


                </div>
                <div className="   p-4 flex flex-col gap-4">
                    <span className="w-full   text-center text-cs text-3xl ">Contests</span>
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
                                <div className="flex-1 default flex flex-col gap-2 w-full justify-center">Others
                                    <button onClick={() => approveReject(contestDetails.id, "On Going")} className='  min-w-72 button-primary'>Approve</button>
                                    <button onClick={() => approveReject(contestDetails.id, "Denied")} className='min-w-72 button-warning '>Reject</button>


                                </div>

                            </span>
                        </>
                    )}
                    <h1 className="w-full text-center text-cs text-3xl sticky top-0">Report and Feedback</h1>

                    <h1 className="w-full text-center text-cs text-3xl">Searchbar</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

                        {reportFeedbackList.map((reportFeedback) => (

                            <div key={reportFeedback.id} >
                                <ReportFeedbackCard reportFeedback={reportFeedback} fixed={() => fixedDismiss(reportFeedback.id, "Fixed")} dismiss={() => fixedDismiss(reportFeedback.id, "Dismiss")} />
                            </div>
                        ))}

                    </div>
                </div>

            </div>
            </>)}
        </div>
    )
}

export default page
