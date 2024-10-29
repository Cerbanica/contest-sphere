"use client";
import { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import supabase from '@/utils/supabaseClient';
import { ContestCard, ShareCard, ContestDetailsCard, SearchBar, MyListbox, Pagination, ReportFeedbackForm, LeListboxCheckbox, BookmarkButton } from "../components";
import { prizeRangeList, categoriesList, sortList, loremIpsum, defaultFormData } from '@/app/dataList';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Checkbox } from '@headlessui/react'
import { ChevronDownIcon, StopIcon } from '@heroicons/react/20/solid';
import { TrashIcon} from '@heroicons/react/24/solid'

import { useAuth } from '@/utils/useAuth';
import { ShareIcon, XMarkIcon } from '@heroicons/react/24/solid'



const Page = () => {
  const [user, setUser] = useState(null); // State to store user information
  const [contests, setContests] = useState([]); // State to store contests
  const [loading, setLoading] = useState(true); // Loading state

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const [showIcons, setShowIcons] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseShare = () => setIsShareCardOpen(false);
  const userAuth = useAuth(); 
  const [isAdded, setIsAdded] = useState(true);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [showContestList, setShowContestList] = useState(true);

  const [contestDetails, setContestDetails] = useState(defaultFormData);
  const [shareUrl, setShareUrl] = useState(`https://contest-sphere.vercel.app/?contestId=${contestDetails.id}`);
  const [contestList, setContestList] = useState([]);
  const [contestList2, setContestList2] = useState([]);
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
    router.push(`myContest/?${params.toString()}`, undefined, { shallow: true })
  };
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }


  useEffect(() => {
    if (userAuth) {
      setUser(userAuth);
      fetchUserContests(userAuth.email);
    }
  }, [userAuth,  page]); // Depend on `userAuth`, `filters`, and `page`
  
  // Use effect to handle URL parameter changes
 
    const fetchUserContests = async (email) => {
      // Update filters stateSs
    setFilters({
      
      sort: searchParams.get('sort') || 'Sort By Latest',
      

    });


      try {
        let query = supabase
        .from('user_contests')
        .select('contest_id, contests(id, title, linkToThumbnail, prizeRange, mainPrize, category, deadline,status,startdate, description, created_at ,entryFee)')
        .eq('email', email);
        
       /*  if (filters.sort === 'Sort By Ending') {
          query = query.order('deadline', { ascending: true });
      }


      if (filters.sort !== 'Sort By Ending') {


          query = query.order('created_at', { ascending: false });
      } */
   
       

        const { data, error, count } = await query;


      

        setContestList(data.map((item) => ({ ...item.contests, id: item.contest_id })));
        setContestList2(data.map((item) => item.contests.id)); // Assuming contests is an object and you want the id property directly
        console.log("Fetched contest IDs:", contestList2);
        console.log('Current sort filter:', filters.sort);

       
      
        setFetchError(null);
       
        
      } catch (error) {
        setFetchError('Couldn\'t fetch contest data');
        setContestList([]);
      }

    };
    

    

   
 
  
  // Function to handle window resize
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
   


  useEffect(() => {
    console.log("saved contests id", contestList2);
    console.log("filters", filters.sort);

    const fetchContest2 = async () => {
        if (!contestList2 || contestList2.length === 0) {
            console.warn("contestList2 is empty or undefined, skipping fetch.");
            return; // Exit early if contestList2 is empty or undefined
        }

        let query = supabase
            .from('contests') // Replace 'contests' with your table name
            .select('*')
            .in('id', contestList2);






            if (filters.sort === 'Sort By Ending') {
              query = query.order('deadline', { ascending: true });
          }


          if (filters.sort !== 'Sort By Ending') {


              query = query.order('created_at', { ascending: false });
          }
            

        const { data: newdata, error } = await query;

        if (error) {
            console.error("Error fetching contests:", error);
        } else {
            console.log("newdata", newdata);
            setContestList(newdata);
        }
    }

    fetchContest2();

    setTotalItems(contestList2.length);
    setTotalPage(Math.ceil(totalItems / itemsPerPage));
}, [ contestList2, filters.sort]);






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
      setContestList(contestList.filter(contest => contest.id !== contestId));
    }
  };

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



  // Handle sort change
  const handleSortChange = (sort) => {
    setFilters((prevFilters) => ({ ...prevFilters, sort: sort.value }));
    updateURLParams('sort', sort.value);

  };



  const handlePageChange = (selectedPage) => {
    updateURLParams('page', selectedPage);
  };

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

        setShowDetailsCard(true);




      }
    }



    fetchContest();


  };









  return (

    <div className="min-h-screen bg-transparent flex flex-row ">
      <div className=" hidden lg:block w-0 lg:w-2/12">L</div>

      <div className="flex flex-col w-full lg:w-8/12 mx-auto px-0 ">


        <ReportFeedbackForm contestTitle={contestDetails.title} isOpen={isModalOpen} onClose={handleCloseModal} contestId={contestDetails.id} />
        <ShareCard contestDetails={contestDetails} isOpen={isShareCardOpen} onClose={handleCloseShare} />
        {/*                 //mobile contest details card
*/}                {showDetailsCard && !isModalOpen && !isShareCardOpen && (
          <div className=" fixed default border  bottom-0 top-0  lg:hidden   z-50 ">
            <div className="w-full py-4 default border-b items-center flex justify-end text-default-2 text-xl  ">
              <div className="flex flex-row default-2 rounded-xl">
                <BookmarkButton isAdded={isAdded} onClick={handleRemoveContest} />

                <button
                  onClick={() => setIsShareCardOpen(true)}
                  className=" flex flex-row  items-center px-2 p-1 gap-2 text-lg w-fit rounded-lg  text-default-2">
                  <ShareIcon className="w-6 h-6  cursor-pointer  text-default-2" /> Share
                </button>
              </div>
              <button onClick={() => [setShowDetailsCard(false), setShowIcons(false)]} className=' ml-4 '> <XMarkIcon className="w-10 h-8 mb-1 cursor-pointer  text-default-2" /> </button>




            </div>

            <ContestDetailsCard
              contestDetails={contestDetails}


              showShareCard={() => setIsShareCardOpen(true)}


            />
          </div>)}
        {showContestList && (
          <div className="lg:px-2">
            <div className="flex flex-col text-center bg-[url('/contestbg.png')] bg-cover bg-center text-4xl lg:text-6xl p-2 lg:p-8 pb-2  ">
              <div className="font-bold text-white"> <h1>Thousands of Contests</h1><h1>All in One Place</h1></div>
              <section className="mt-8">
                <div className="default border rounded-2xl lg:w-1/2 sm:w-full md:w-5/6 flex flex-col justify-center items-center space-y-2 mt-2 mx-auto ">
                  <h1 className="default-2">Tabs</h1>
                </div>
              </section>
            </div>


            <section>
              {/*   <div className="w-full flex  justify-center items-center">
                              <hr className="border-t-1 border-cs w-full lg:w-1/2 mb-4" />
                          </div> */}

              {contestList.length > 0 ? (
                <div className="flex flex-row gap-4 mt-4  p-1">


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

                          <div key={contest.id} className=" rounded-2xl bg-gray-100 dark:bg-transparent dark:border dark:border-gray-700">
                            <div className="relative  rounded-2xl">

                              {/* Button on top left */}
                              <button
                                className="absolute z-10 top-2 left-2 default-2 items-center text-default-invert px-4 py-2 rounded-lg "
                                onClick={() => handleRemoveContest(contest.id)}
                              >
                                <TrashIcon className="w-6 fill-red-400 " />
                              </button>
                              <ContestCard contest={contest} onClick={viewContestDetails} />


                            </div>
                          </div>                                              
                          </div>
                      ))}
                    </div>

                    <Pagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
                  </div>

                  <div className="flex-1  hidden lg:block   ">
                    {/*                                     <div className="sticky top-24 overflow-y-auto default  rounded-2xl border " style={{ height: "calc(95vh - 6rem)" }}>
*/}

                    {showDetailsCard ? (
                      <>
                        <ContestDetailsCard
                          contestDetails={contestDetails}
                          isAdded={isAdded}
                          handleAddUserContest={handleRemoveContest}
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

export default Page;
