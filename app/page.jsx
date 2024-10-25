"use client";
import { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import supabase from "../utils/supabaseClient";
import { ContestCard, ContestDetailsCard, SearchBar, MyListbox, Pagination, ReportFeedbackForm, LeListbox } from "./components";
import { prizeRangeList, categoriesList, sortList, loremIpsum, defaultFormData } from '@/app/dataList';
import Image from "next/image";
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { useAuth } from '@/utils/useAuth';
import { ShareIcon } from '@heroicons/react/24/solid'
import {
    EmailShareButton,
    FacebookShareButton,
    GabShareButton,
    HatenaShareButton,
    InstapaperShareButton,
    LineShareButton,
    LinkedinShareButton,
    LivejournalShareButton,
    MailruShareButton,
    OKShareButton,
    PinterestShareButton,
    PocketShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    ViberShareButton,
    VKShareButton,
    WhatsappShareButton,
    WorkplaceShareButton,
} from "react-share";
import {
    EmailIcon,
    FacebookIcon,
    FacebookMessengerIcon,
    GabIcon,
    HatenaIcon,
    InstapaperIcon,
    LineIcon,
    LinkedinIcon,
    LivejournalIcon,
    MailruIcon,
    OKIcon,
    PinterestIcon,
    PocketIcon,
    RedditIcon,
    TelegramIcon,
    TumblrIcon,
    TwitterIcon,
    ViberIcon,
    VKIcon,
    WeiboIcon,
    WhatsappIcon,
    WorkplaceIcon,
    XIcon,
} from "react-share";

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
    const [showIcons,setShowIcons]=useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const userAuth = useAuth();
    const [isAdded, setIsAdded] = useState(false);
    const [showDetailsCard, setShowDetailsCard] = useState(false);
    const [showDetailsCardMobile, setShowDetailsCardMobile] = useState(false);
    const [showContestList, setShowContestList] = useState(true);

    const [contestDetails, setContestDetails] = useState(defaultFormData);
    const [contestList, setContestList] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        sort: '',
        prize: '',
        searchTerm: ''
    });
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPage] = useState(1);
    const searchParams = useSearchParams();
    const router = useRouter();
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const itemsPerPage = 12;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;
    let contestCount = -1000;
    // Helper function to update URL params, key=filter type, value is value la
    const updateURLParams = (key, value) => {

        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        router.push(`/?${params.toString()}`, { shallow: true })
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

        fetchContests();

    }, [searchParams, start, end]);
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
    }, [isMobile, contestList]);

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


    };
    const shareUrl = () => {
        const currentUrl = `https://contest-sphere.vercel.app/?=${contestDetails.title}&contestId=${contestDetails.id}`;
        return currentUrl;
        // Get the current URL
        /*   alert(currentUrl);
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(currentUrl)}`;
          window.open(whatsappUrl, '_blank'); */ // Open WhatsApp link in a new tab
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


    return (
        <div className="min-h-screen bg-transparent flex flex-row ">
            <div className=" hidden lg:block w-0 lg:w-2/12">L</div>

            <div className="flex flex-col w-full lg:w-8/12 mx-auto px-0 ">
                <ReportFeedbackForm contestTitle={contestDetails.title} isOpen={isModalOpen} onClose={handleCloseModal} contestId={contestDetails.id} />

                {showDetailsCard && !isModalOpen && (
                    <div className=" fixed default border  bottom-0 top-0  lg:hidden   z-50 ">
                        <div className="w-full py-3 px-8 default border-b flex justify-between text-default-2 text-xl  ">

                            <button onClick={() => [setShowDetailsCard(false),setShowIcons(false)]} className='  '> X </button>
                            {showIcons ? (
                                <div className="default-border flex flex-row items-center p-1 rounded-full gap-2 border">
                                    <WhatsappShareButton url={shareUrl} >   <WhatsappIcon size={32} round />
                                    </WhatsappShareButton>
                                    <TelegramShareButton
                                        url={shareUrl}
                                        title={contestDetails.title}
                                        className=""
                                    >
                                        <TelegramIcon size={32} round />
                                    </TelegramShareButton>
                                </div>
                            ):(
                                <button
                                    onClick={()=>setShowIcons(true)}
                                    className=" flex flex-row text-lg w-fit rounded-lg p-1 pt-2 text-default-2">
                                    Share Contest<ShareIcon className="w-10 h-8 mb-1 cursor-pointer  text-default-2" />
                                </button>

                            ) }


                            {/*  <button 
              
              className=" flex flex-row text-lg w-fit rounded-lg p-1 pt-2 text-default-2">
              Share Contest<ShareIcon className="w-10 h-8 mb-1 cursor-pointer  text-default-2" />
            </button> */}

                        </div>

                        <ContestDetailsCard
                            contestDetails={contestDetails}
                            isAdded={isAdded}
                            handleAddUserContest={handleAddUserContest}
                            report={handleOpenModal}


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
                                        <div className="flex-1"> <MyListbox
                                            items={sortList}
                                            selectedItem={"Filters"}
                                            onSelect={handleSortChange}
                                        /></div>

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
                                        <div className=" flex flex-col   gap-2  w-full  ">

                                            {contestList.map((contest) => (

                                                <div key={contest.id} >
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
