"use client";
import { useEffect,Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import supabase from "../utils/supabaseClient";
import { ContestCard, ContestDetailsCard,SearchBar, MyListbox, Pagination } from "./components";
import { prizeRangeList, categoriesList, sortList, loremIpsum } from '@/app/dataList';
import Image from "next/image";
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { useAuth } from '@/utils/useAuth';

export default function Home() {
    const userAuth = useAuth(); 
    const [isAdded, setIsAdded] = useState(false);
    const [showDetailsCard, setShowDetailsCard] = useState(false);
    const [showDetailsCardMobile, setShowDetailsCardMobile] = useState(false);
    const [showContestList, setShowContestList]= useState(true);
  
    const defaultFormData = {
        id:'',
        title: '',
        category: '',
        description: '',
        startdate: null,
        mainPrize: '',
        deadline: null,
        prizeList: [null],
        judgeList: [null],
        winnerAnnouncement: null,
        entryFee: '',
        eligibility: '',
        submission: '',
        linkToPost: '',
        prizeRange: 0,
    }
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

    // Helper function to update URL params, key=filter type, value is value la
    const updateURLParams = (key, value) => {

        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        router.push(`/?${params.toString()}`, { shallow: true })
    };

    // Use effect to handle URL parameter changes
    useEffect(() => {   

        // Update filters stateSs
        setFilters({
            category: searchParams.get('category') || 'All Categories',
            sort: searchParams.get('sort') || 'Latest',
            prize: searchParams.get('prize') || 0,
            searchTerm: searchParams.get('search') || '',
            selectedPrizeName: prizeRangeList[parseInt(searchParams.get('prize') || 0)].name,
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

                if (filters.sort === 'Ending') {
                    query = query.order('deadline', { ascending: true });
                }

                if (filters.sort === '' || filters.sort === 'Latest') {
                    query = query.order('created_at', { ascending: false });
                }

                const { data, error, count } = await query;

                if (error) throw error;

                setContestList(data);
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
              //toggleDetailsCardMobile();
                setShowDetailsCard(true);
             



            }
        }

       

        checkIfContestAdded();
       

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
        <Suspense fallback={<div>Loading...</div>}>
        <div className="min-h-screen bg-transparent flex flex-row  ">
            <div className=" hidden lg:block w-0 lg:w-2/12">ADS</div>
            
            <div className="flex flex-col w-full lg:w-8/12 mx-auto px-0 ">
            {showDetailsCard && (
            <div className=" fixed bg-gray-200 dark:bg-gray-800 border  border-white dark:border-gray-700 top-[20vh]  lg:hidden rounded-2xl h-[100vh]  z-50 ">
             <button  onClick={() => setShowDetailsCard(false)}  className='  w-full py-3 text-center text-xl rounded-lg gap-2'> Close </button>
            
             <ContestDetailsCard 
                                      contestDetails={contestDetails}
                                      isAdded={isAdded}
                                      handleAddUserContest={handleAddUserContest}
                                      
                                    />                     
                           </div>)}
          {showContestList &&(
                    <div className="px-2">
                <section>
                    <div className="lg:w-1/2 sm:w-full md:w-5/6 mb-4 flex flex-col justify-center items-center space-y-2 mt-2 mx-auto">
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
                                selectedItem={filters.sort}
                                onSelect={handleSortChange}
                            /></div>
                            <div className="flex-1 "> <MyListbox
                                items={sortList}
                                selectedItem={filters.sort}
                                onSelect={handleSortChange}
                            /></div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="w-full flex  justify-center items-center">
                        <hr className="border-t-1 border-cs w-full lg:w-1/2 mb-4" />
                    </div>

                    {contestList.length > 0 ? (
                        <div className="flex flex-row gap-4">


                            <div className="flex-1 ">
                                <div className=" flex flex-col   gap-2  w-full  ">
                                    {contestList.map((contest) => (

                                        /*                                         <div key={contest.id} className="rounded-2xl transition-transform transform hover:translate-y-[-10px] hover:shadow-xl hover:drop-shadow-xl dark:shadow-slate-700">
                                         */
                                        <div key={contest.id} >
                                            <ContestCard contest={contest} onClick={viewContestDetails} />
                                        </div>
                                    ))}
                                </div>

                                <Pagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
                            </div>
                          
                            <div className="flex-1 hidden lg:block mb-4 rounded-2xl ">
                                <div className="  sticky bottom-24  top-24 overflow-y-auto ">

                                    {showDetailsCard ? (
                                      <ContestDetailsCard 
                                      contestDetails={contestDetails}
                                      isAdded={isAdded}
                                      handleAddUserContest={handleAddUserContest}
                                      
                                    />
                                    
                                    ) : (<div className="default  rounded-2xl  border h-screen p-20">Place holder</div>)}

                                </div>
                                
                            </div>
                        </div>
                    ) : (
                        !fetchError && (
                            <h1 className="default">No contest</h1>
                        )
                    )}
                </section>
                </div>)}
            </div>
            <div className=" hidden lg:block w-0 lg:w-2/12">ADS</div>

        </div>
        </Suspense>
    );
}
