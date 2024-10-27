"use client";
import { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import supabase from "../utils/supabaseClient";
import { ContestCard, ShareCard, ContestDetailsCard, SearchBar, MyListbox, Pagination, ReportFeedbackForm, LeListboxCheckbox } from "./components";
import { prizeRangeList, categoriesList, sortList, loremIpsum, defaultFormData } from '@/app/dataList';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Checkbox } from '@headlessui/react'
import { ChevronDownIcon, StopIcon } from '@heroicons/react/20/solid';

import { useAuth } from '@/utils/useAuth';
import { ShareIcon, XMarkIcon } from '@heroicons/react/24/solid'

import { Helmet } from 'react-helmet';

export default function Home() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShareCardOpen, setIsShareCardOpen] = useState(false);
    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
    const [showIcons, setShowIcons] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleCloseShare = () => setIsShareCardOpen(false);
    const userAuth = useAuth();
    const [isAdded, setIsAdded] = useState(false);
    const [showDetailsCard, setShowDetailsCard] = useState(false);
    const [showDetailsCardMobile, setShowDetailsCardMobile] = useState(false);
    const [showContestList, setShowContestList] = useState(true);

    const [contestDetails, setContestDetails] = useState(defaultFormData);
    const [shareUrl, setShareUrl] = useState(`https://contest-sphere.vercel.app/?contestId=${contestDetails.id}`);
    const [contestList, setContestList] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        sort: '',
        prize: '',
        searchTerm: '',
        freeEntry: false,
        noRestrictions: false,
    });
    const filterItems = [
        { id: 1, name: 'Free entry' },
        { id: 2, name: 'No eligibility restrictions' },
        { id: 3, name: 'Option 3' },
        { id: 4, name: 'Option 4' },
    ];
    const [selectedFilterItems, setSelectedFilterItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPage] = useState(1);
    const searchParams = useSearchParams();
    const router = useRouter();
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const itemsPerPage = 12;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;
    let contestCount = -1000;
    const textshareUrl = `https://contest-sphere.vercel.app/?title=${encodeURIComponent(contestDetails.title)}&contestId=${encodeURIComponent(contestDetails.id)}`;
    const discordShareText = `Check out this contest: ${textshareUrl}`;
    const [copied, setCopied] = useState(false);
    // Helper function to update URL params, key=filter type, value is value la
    const updateURLParams = (key, value) => {

        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        router.push(`/?${params.toString()}`, undefined, { shallow: true })
    };
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    // Use effect to handle URL parameter changes
    useEffect(() => {

        // Update filters stateSs
        setFilters({
            category: searchParams.get('category') || 'All Categories',
            sort: searchParams.get('sort') || 'Sort By Latest',
            prize: searchParams.get('prize') || 0,
            searchTerm: searchParams.get('search') || '',
            selectedPrizeName: prizeRangeList[parseInt(searchParams.get('prize') || 0)].name,
            contestId: searchParams.get('contestId') || null,
            freeEntry: searchParams.get('freeEntry') || false,
            noRestrictions: searchParams.get('noRestrictions') || false,

        });


        const fetchContests = async () => {

            try {
                let query = supabase.from('contests').select('id, title, linkToThumbnail, prizeRange, mainPrize, category, deadline,status,startdate, description, entryFee', { count: 'exact' }).range(start, end);

                // Filter by category
                if (filters.category && filters.category != "All Categories") {
                    query = query.eq('category', filters.category);
                }

                // Filter by search term
                if (filters.searchTerm) {
                    query = query.or(`title.ilike.%${filters.searchTerm}%,category.ilike.%${filters.searchTerm}%`);
                }

                // Sort by main prize if specified
                if (filters.prize != '') {

                    query = query.gte('prizeRange', filters.prize).lte('prizeRange', 5);
                }

                if (filters.sort === 'Sort By Ending') {
                    query = query.order('deadline', { ascending: true });
                }


                if (filters.sort !== 'Sort By Ending') {


                    query = query.order('created_at', { ascending: false });
                }
                if (filters.contestId !== undefined && filters.contestId !== null) {
                    console.log(filters.contestId);
                    let SharedContestQuery = supabase.from('contests').select('id, title, linkToThumbnail, prizeRange, mainPrize, category, deadline,status,startdate, description, entryFee', { count: 'exact' }).eq('id', filters.contestId);
                    const { data, error, } = await SharedContestQuery;

                    setContestList(data);
                }
                if (filters.freeEntry === "true") {

                    query = query.eq('entryFee', 'Free');

                }
                if (filters.noRestrictions === "true") {
                    query = query.eq('eligibility', "No");

                }

                const { data, error, count } = await query;



                if (filters.contestId !== undefined && filters.contestId !== null) {
                    setContestList((prevContestList) => {
                        // Assuming each item has a unique 'id' property
                        const existingIds = new Set(prevContestList.map((item) => item.id));

                        // Filter out items in newData that already exist in prevContestList
                        const filteredNewData = data.filter((item) => !existingIds.has(item.id));

                        // Combine prevContestList with filteredNewData
                        return [...prevContestList, ...filteredNewData];
                    });
                } else {
                    setContestList(data);
                }

                /*    
                     */


                setFetchError(null);
                setTotalItems(count);
                setTotalPage(Math.ceil(count / itemsPerPage));
            } catch (error) {
                setFetchError('Couldn\'t fetch contest data');
                setContestList([]);
            }

        };
        console.log('Filters:', filters); // Debugging line

        fetchContests();

    }, [start, end, searchParams]);
    // Function to handle window resize
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    // Effect to listen for resize events and update width
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    // Determine if the screen is mobile-sized
    const isMobile = width <= 768;
    useEffect(() => {
        if (!isMobile && contestList && contestList.length > 0) {
            viewContestDetails(contestList[0].id);


        }

    }, [isMobile, contestList, selectedFilterItems]);

    // Handle search change
    const handleSearchChange = (searchTerm) => {
        setFilters((prevFilters) => ({ ...prevFilters, searchTerm }));
        updateURLParams('search', searchTerm);


    };

    // Handle category change
    const handleCategoryChange = (category) => {
        setFilters((prevFilters) => ({ ...prevFilters, category: category.value }));
        updateURLParams('category', category.value);

    };

    // Handle sort change
    const handleSortChange = (sort) => {
        setFilters((prevFilters) => ({ ...prevFilters, sort: sort.value }));
        updateURLParams('sort', sort.value);

    };

    // Handle prize change
    const handlePrizeChange = (prize) => {
        setFilters((prevFilters) => ({ ...prevFilters, prize: prize.value }));
        updateURLParams('prize', prize.value);
    };


    const handlePageChange = (selectedPage) => {
        updateURLParams('page', selectedPage);
    };

    const viewContestDetails = (contestId) => {

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
            fetchContest();
        }
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

                setShowDetailsCard(true);




            }
        }



        checkIfContestAdded();
        console.log("eligibility", contestDetails.eligibility)


    };

    const handleAddUserContest = async (contestId) => {
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
                        alert(`Error: ${error.message}`);
                    } else {

                        setIsAdded(false); // Update UI
                    }
                } else {
                    // Add contest
                    const { error } = await supabase
                        .from('user_contests')
                        .insert([{ email: userAuth.email, contest_id: contestId }]);

                    if (error) {
                        alert(`Error: ${error.message}`);
                    } else {

                        setIsAdded(true); // Update UI
                    }
                }
            } else {

                router.push('/login'); // Redirect if not logged in
            }
        } catch (err) {
            alert(`Unexpected error: ${err.message}`);
        }
    };

    const addItem = (item) => {

        if (item.id == 1) {
            setSelectedFilterItems((prevItems) => {
                if (prevItems.some((i) => i.id === item.id)) {

                    setFilters((prevFilters) => ({ ...prevFilters, freeEntry: "false" }));
                    updateURLParams("freeEntry", false);
                    // If item exists (by id), remove it
                    return prevItems.filter((i) => i.id !== item.id);
                } else {



                    setFilters((prevFilters) => ({ ...prevFilters, freeEntry: "true" }));
                    updateURLParams("freeEntry", true);

                    // If item does not exist, add it

                    return [...prevItems, item];
                }
            });


        }
        if (item.id == 2) {
            setSelectedFilterItems((prevItems) => {
                if (prevItems.some((i) => i.id === item.id)) {

                    setFilters((prevFilters) => ({ ...prevFilters, noRestrictions: "false" }));
                    updateURLParams("noRestrictions", false);
                    // If item exists (by id), remove it
                    return prevItems.filter((i) => i.id !== item.id);
                } else {



                    setFilters((prevFilters) => ({ ...prevFilters, noRestrictions: "true" }));
                    updateURLParams("noRestrictions", true);

                    // If item does not exist, add it

                    return [...prevItems, item];
                }
            });

        }



    }




    return (

        <div className="min-h-screen bg-transparent flex flex-row ">
            <div className=" hidden lg:block w-0 lg:w-2/12">L</div>

            <div className="flex flex-col w-full lg:w-8/12 mx-auto px-0 ">
                <Helmet>
                    <meta property="og:title" content={contestDetails.title} />
                    <meta property="og:description" content={contestDetails.description} />
                    <meta property="og:image" content={contestDetails.linkToThumbnail} />
                    <meta property="og:url" content={shareUrl} />
                    <meta property="og:type" content="website" />
                </Helmet>

                <ReportFeedbackForm contestTitle={contestDetails.title} isOpen={isModalOpen} onClose={handleCloseModal} contestId={contestDetails.id} />
                <ShareCard contestDetails={contestDetails} isOpen={isShareCardOpen} onClose={handleCloseShare} />
                {/*                 //mobile contest details card
 */}                {showDetailsCard && !isModalOpen && !isShareCardOpen && (
                    <div className=" fixed default border  bottom-0 top-0  lg:hidden   z-50 ">
                        <div className="w-full py-4 default border-b items-center flex justify-end text-default-2 text-xl  ">



                            <button
                                onClick={() => setIsShareCardOpen(true)}
                                className=" flex flex-row default-2 items-center px-2 p-1 gap-2 text-lg w-fit rounded-lg  text-default-2">
                                <ShareIcon className="w-6 h-6  cursor-pointer  text-default-2" /> Share
                            </button>
                            <button onClick={() => [setShowDetailsCard(false), setShowIcons(false)]} className='  '> <XMarkIcon className="w-10 h-8 mb-1 cursor-pointer  text-default-2" /> </button>




                        </div>

                        <ContestDetailsCard
                            contestDetails={contestDetails}
                            isAdded={isAdded}
                            handleAddUserContest={handleAddUserContest}
                            report={handleOpenModal}
                            showShareCard={() => setIsShareCardOpen(true)}


                        />
                    </div>)}
                {showContestList && (
                    <div className="lg:px-2">
                        <div className="flex flex-col text-center bg-[url('/contestbg.png')] bg-cover bg-center text-4xl lg:text-6xl p-2 lg:p-8 pb-2  ">
                            <div className="font-bold text-white"> <h1>Thousands of Contests</h1><h1>All in One Place</h1></div>
                            <section className="mt-8">
                                <div className="default border rounded-2xl lg:w-1/2 sm:w-full md:w-5/6 flex flex-col justify-center items-center space-y-2 mt-2 mx-auto ">
                                    <SearchBar onSearchChange={handleSearchChange} initialSearchTerm={filters.searchTerm} />

                                    <div className="flex flex-col lg:flex-row w-full justify-between gap-2">
                                        <div className="flex-1 "> <MyListbox
                                            items={categoriesList}
                                            selectedItem={filters.category}
                                            onSelect={handleCategoryChange}
                                        /></div>
                                        <div className="flex-1 ">
                                            <MyListbox
                                                items={prizeRangeList}
                                                selectedItem={filters.selectedPrizeName}
                                                onSelect={handlePrizeChange}
                                            /></div>
                                        <div className="flex-1">
                                            <Listbox value={filterItems} >
                                                <ListboxButton className="flex flex-row w-full text-default-2 text-sm text-left py-1.5 px-3 rounded-lg items-center justify-between ">
                                                    <div className="w-full pr-4 flex items-center truncate">
                                                        {selectedFilterItems.length > 0 ? `${selectedFilterItems.length} filter(s) selected` : "Filters"}
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <ChevronDownIcon className="size-4" />
                                                    </div>
                                                </ListboxButton>
                                                <ListboxOptions anchor="bottom start" className="mt-2 w-full lg:w-72 default border text-sm text-left rounded-md py-3">
                                                    {filterItems.map((item) => (
                                                        <ListboxOption
                                                            key={item.id}
                                                            value={item}
                                                            className="group gap-2 flex cursor-default items-center py-2 px-4 select-none data-[focus]:bg-slate-200 dark:data-[focus]:bg-slate-700"
                                                        >

                                                            <button onClick={() => addItem(item)} className='text-default-2 flex flex-row gap-2 items-center'>
                                                                {selectedFilterItems.some((selectedItem) => selectedItem.id === item.id) ? (
                                                                    <StopIcon className="size-4 text-green-400" />
                                                                ) : (
                                                                    <StopIcon className="size-4 text-slate-300 dark:text-slate-500" />
                                                                )}
                                                                {item.name}</button>
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                            </Listbox>












                                        </div>

                                    </div>
                                </div>
                            </section>
                        </div>


                        <section>
                            {/*   <div className="w-full flex  justify-center items-center">
                                <hr className="border-t-1 border-cs w-full lg:w-1/2 mb-4" />
                            </div> */}

                            {contestList.length > 0 ? (
                                <div className="flex flex-row gap-4 mt-4">


                                    <div className="flex-1 ">
                                        <div className="flex flex-row w-full justify-between  pb-2 px-2  ">


                                            <span className=" flex gap-2 items-center justify-center text-default-2 text-sm   ">
                                                <span className="text-lg text-default">{totalItems}</span>
                                                Contests found</span>
                                            <div className="flex text-default-2 ">
                                                <MyListbox
                                                    items={sortList}
                                                    selectedItem={filters.sort}
                                                    onSelect={handleSortChange}
                                                />
                                            </div>







                                        </div>
                                        <div className=" flex flex-col  gap-0 lg:gap-2  w-full  ">

                                            {contestList.map((contest) => (

                                                <div className="bg-slate-300 dark:bg-slate-950 p-2 lg:bg-transparent lg:pb-0" key={contest.id} >
                                                    <ContestCard contest={contest} onClick={viewContestDetails} />
                                                </div>
                                            ))}
                                        </div>

                                        <Pagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
                                    </div>

                                    <div className="flex-1 hidden lg:block   ">
                                        {/*                                     <div className="sticky top-24 overflow-y-auto default  rounded-2xl border " style={{ height: "calc(95vh - 6rem)" }}>
 */}

                                        {showDetailsCard ? (
                                            <>
                                                <ContestDetailsCard
                                                    contestDetails={contestDetails}
                                                    isAdded={isAdded}
                                                    handleAddUserContest={handleAddUserContest}
                                                    report={handleOpenModal}
                                                    showShareCard={() => setIsShareCardOpen(true)}

                                                />
                                            </>
                                        ) : (<div className="default  rounded-2xl  border h-full p-20">Place holder</div>)}

                                    </div>


                                    {/*                                     </div>
 */}                                </div>
                            ) : (
                                !fetchError && (
                                    <h1 className="default">No contest</h1>
                                )
                            )}
                        </section>
                    </div>)}
            </div>
            <div className=" hidden lg:block w-0 lg:w-2/12">R</div>

        </div>

    );
}
