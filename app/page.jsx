"use client";
import { useEffect,Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import supabase from "../utils/supabaseClient";
import { ContestCard, SearchBar, MyListbox, Pagination } from "./components";
import { prizeRangeList, categoriesList, sortList } from '@/app/dataList';
import Image from "next/image";
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { useAuth } from '@/utils/useAuth';

export default function Home() {
    const userAuth = useAuth(); 
    const [isAdded, setIsAdded] = useState(false);
    const [showPanel, setShowPanel] = useState(false);
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

        // Update filters state
        setFilters({
            category: searchParams.get('category') || 'All Categories',
            sort: searchParams.get('sort') || 'Latest',
            prize: searchParams.get('prize') || 0,
            searchTerm: searchParams.get('search') || '',
            selectedPrizeName: prizeRangeList[parseInt(searchParams.get('prize') || 0)].name,
        });


        const fetchContests = async () => {
            try {
                let query = supabase.from('contests').select('id, title, prizeRange, mainPrize, category, deadline,status,startdate, description, entryFee', { count: 'exact' }).range(start, end);

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
    const calculateDaysRemaining = (deadline) => {
        const currentDate = new Date();
        const deadlineDate = new Date(deadline);

        // Calculate the difference in milliseconds
        const diffInMs = deadlineDate.getTime() - currentDate.getTime();

        // Convert milliseconds to days
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        diffInDays > 14 ? status = "On Going" : status = "Ending";

        return diffInDays >= 0 ? diffInDays : 0; // Return 0 if the deadline has passed
    };
    const formatDateManual = (date1, date2) => {
        let startDate;
        const endDate = new Date(date2);
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
            'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
        ];
        if (date1 != null) {
            startDate = new Date(date1);

            const month1 = months[startDate.getMonth()];
            const day1 = startDate.getDate();
            const year1 = startDate.getFullYear();
            const month2 = months[endDate.getMonth()];
            const day2 = endDate.getDate();
            const year2 = endDate.getFullYear();

            const formattedYear1 = year1 === year2 ? '' : year1;

            return ` ${day1} ${month1} ${formattedYear1} - ${day2} ${month2} ${year2} `;
        } else {

            const month2 = months[endDate.getMonth()];
            const day2 = endDate.getDate();
            const year2 = endDate.getFullYear();

            return `Ends ${day2} ${month2} ${year2} `;

        }
    }
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

                setShowPanel(true);



            }
        }

       

        checkIfContestAdded();
        

    };
    const formatEntry = (fee) => {
        if (fee == "Free" || fee == null) {
            return "Free"
        }
        else {
            return fee;
        }

    }
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
                alert('Contest removed from list.');
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
                alert('Contest added to list.');
                setIsAdded(true); // Update UI
              }
            }
          } else {
            alert("Please login to save contest");
            router.push('/login'); // Redirect if not logged in
          }
        } catch (err) {
          alert(`Unexpected error: ${err.message}`);
        }
      };
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div className="min-h-screen bg-transparent flex flex-row  ">
            <div className=" w-0 lg:w-2/12">ADS</div>
            <div className="flex flex-col w-full lg:w-8/12 mx-auto px-2 ">

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
                                <div className="  sticky top-24 overflow-y-auto ">

                                    {showPanel ? (
                                        <div className=" border default dark:border-gray-600 border-slate-100  rounded-xl p-4">
                                            <div
                                                className="bg-cover bg-center lg:min-h-[30vh] min-h-[40vh]  min-w-[20vh] h-full w-full rounded-xl   border-0 lg:border-e-2 border-slate-100 dark:border-gray-700"
                                                style={{
                                                    backgroundImage:
                                                        "url('https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg')",
                                                }}
                                            ></div>

                                            <div className=" w-full default rounded-r-xl ">
                                                <div className="flex flex-col w-full  pt-2 lg:rounded-tr-xl">

                                                    <div className="flex w-full flex-row items-end justify-between pb-2">
                                                        <h2 className="w-9/12 font-bold text-3xl overflow-hidden">{contestDetails.title}</h2>

                                                        <div className="flex flex-col gap-1 items-end w-3/12">
                                                        {isAdded?  
                                                        <button  onClick={() => handleAddUserContest(contestDetails.id)} className="bg-cs  w-fit rounded-lg p-1 pt-2 text-white "> <BookmarkSolid className=" w-10 h-8  mb-1 cursor-pointer text-white " /> </button>
                                                        :
                                                        <button  onClick={() => handleAddUserContest(contestDetails.id)}className="border border-gray-400  w-fit rounded-lg p-1 pt-2 text-gray-400 "> <BookmarkOutline className=" w-10 h-8  mb-1 cursor-pointer  " /> </button>
                                                        }

                                                        </div>
                                                    </div>



                                                
                                                    <div className="flex flex-row justify-between"> 
                                                    <div className=' flex flex-col w-9/12 pb-2'>
                                                        <div className="flex flex-row align-middle">
                                                            <span className="self-start text-lg text-blue-400  border border-blue-400   px-2 rounded-lg">
                                                                {contestDetails.category}
                                                            </span>
                                                            <span className="text-lg text-gray-400  px-2">
                                                                {formatDateManual(contestDetails.startdate, contestDetails.deadline)}
                                                            </span>

                                                        </div>


                                                    </div>
                                                 
                                                        <span className={` text-right text-lg font-bold ${calculateDaysRemaining(contestDetails.deadline) <= 14 ? "text-red-400" : "text-green-400"}`}>
                                                            {calculateDaysRemaining(contestDetails.deadline) === 1 ? `1 day left` : `${calculateDaysRemaining(contestDetails.deadline)} days left`}
                                                        </span>
                                                   
                                                    </div>
                                                </div>


                                                <div className="w-full flex flex-col pt-1 bg-none  ">
                                                    <div className=" flex flex-row items-center justify-bottom text-center py-2  rounded-br-xl">
                                                        <div className="flex-1 ">
                                                            <div className="flex flex-col text-start   ">
                                                                <span className="text-gray-400 text-sm">Entry Fee</span>
                                                                <span className=" text-3xl  dark:text-gray-300">

                                                                    {formatEntry(contestDetails.entryFee)}
                                                                </span>
                                                            </div>

                                                        </div>



                                                        <div className="flex-1 ">
                                                            <div className="flex flex-col  px-3 justify-end ">
                                                                <span className="text-gray-400 text-sm text-end">Main Prize</span>
                                                                <div className="flex flex-row justify-end">

                                                                    <span className=" font-bold text-3xl  text-cs  ">
                                                                        {contestDetails.mainPrize}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                            <div className="overflow-y-auto  max-h-[50vh]  ">
                                                <div className=" py-4 border-t shadow-inner border-slate-200 dark:border-gray-600 ">
                                                    <span className="text-default text-lg text-justify ">{contestDetails.description}</span>
                                                </div>

                                                <div className=" py-4 border-t border-slate-200 dark:border-gray-600 ">

                                                    <h6 className=" text-default text-2xl w-full text-center font-bold">List Of Prizes</h6>

                                                    {(Array.isArray(contestDetails.prizeList) ? contestDetails.prizeList : JSON.parse(contestDetails.prizeList)).map((prize, index) => (
                                                        <div key={index} className="mt-2">
                                                            <h6 className=" text-gray-400 text-lg">{prize.label}</h6>
                                                            <span className="text-xl text-default">{prize.value}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className=" py-4 border-t border-slate-200 dark:border-gray-600 mb-96">

                                                    <h6 className=" text-default text-2xl w-full text-center font-bold">Judges</h6>

                                                    {(Array.isArray(contestDetails.judges) ? contestDetails.judges : JSON.parse(contestDetails.judges)).map((prize, index) => (
                                                        <div key={index} className="mt-2">
                                                            <h6 className=" text-gray-400 text-lg">{prize.label}</h6>
                                                            <span className="text-xl text-default">{prize.value}</span>
                                                        </div>
                                                    ))}
                                                </div>



                                            </div>
                                        </div>
                                    ) : (<h1 className="default p-20">no man</h1>)}

                                </div>
                            </div>
                        </div>
                    ) : (
                        !fetchError && (
                            <h1 className="default">No contest</h1>
                        )
                    )}
                </section>
            </div>
            <div className=" w-0 lg:w-2/12">ADS</div>

        </div>
        </Suspense>
    );
}
