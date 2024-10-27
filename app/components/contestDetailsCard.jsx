"use client"
import React from 'react';
// Import the necessary icons or components
import { FlagIcon } from '@heroicons/react/24/outline'
import { ShareIcon } from '@heroicons/react/24/solid'

import { formatDateManual, formatEntry, calculateDaysRemaining } from '@/utils/contestUtils';
import { BookmarkButton, CategoryLink, ListSection, MainPrizeEntryFee, RemainingDays } from './contestDetailsCard/components';

const ContestDetailsCard = ({
  contestDetails,
  isAdded,
  handleAddUserContest, report, showShareCard

}) => {



  return (

    <div className=" sticky lg:top-24  default   border  overflow-y-auto  border-t-0 lg:border-t default  w-full lg:rounded-xl  p-0 lg:pr-2 h-[calc(100vh-4rem)] lg:h-[calc(95vh-4rem)]"  >

      {/* Image Section */}
      <div
        className="bg-cover bg-center lg:h-[30vh] h-[30vh] min-w-[20vh]  lg:rounded-xl lg:rounded-b-none "
        style={{
          backgroundImage: `url('${contestDetails.linkToThumbnail || 'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg'}')`,
        }}
      ></div>
      <div className='p-4 pt-0'>
        {/* Content Section */}
        <div className="w-full  rounded-r-xl">
          <div className="flex flex-col w-full pt-2  sticky top-0  border-b   default">

            {/* Title and Bookmark */}
            <div className="flex w-full flex-row items-center justify-between pb-2 mb-2  ">
              <div className=' flex flex-col'>
                <span className=" font-bold text-lg lg:text-3xl overflow-hidden m-0">
                  {contestDetails.title}
                </span>
                <a href={"/?search=" + contestDetails.organizer} className='text-lg text-blue-400 -mt-2 underline'>{contestDetails.organizer}</a>
              </div>
              <div className='flex-row flex gap-0  justify-end'>

                <div className=' hidden lg:block '>

                  <BookmarkButton isAdded={isAdded} onClick={() => handleAddUserContest(contestDetails.id)} />

                </div>

                <button onClick={showShareCard}

                  className=" hidden lg:block  flex-row text-lg  rounded-lg p-1 pt-2 text-default-2">
                  <ShareIcon className="w-10 h-8 mb-1 cursor-pointer  text-default-2" />
                </button>

              </div>


            </div>

            {/* Category, Date, and Deadline */}
            <div className="flex flex-row  justify-between items-center pb-2">
              <div className="flex gap-2 flex-row   ">
                <CategoryLink category={contestDetails.category} />
                <span className="  text-md  lg:text-lg text-gray-400 ">

                  {formatDateManual(contestDetails.startdate, contestDetails.deadline)}
                </span>
              </div>


              {/* Days Remaining */}
              <div className='flex '>
                <RemainingDays deadline={contestDetails.deadline} />
              </div>
            </div>
          </div>



          <MainPrizeEntryFee mainPrize={contestDetails.mainPrize} entryFee={contestDetails.entryFee} />
          <div className="py-4 border-t shadow-inner default">
            <span className="text-default-2  text-md lg:text-lg text-justify">
              {contestDetails.description}
            </span>

          </div>
          {contestDetails.howToEnter &&
            <div className="py-4 border-t shadow-inner default">
              <h1 className='text-default text-center text-md lg:text-lg font-bold'>How To Enter</h1>
              <span className="text-default-2 text-md lg:text-lg text-justify">
                {contestDetails.howToEnter}
              </span>

            </div>}

          {/* Prize List */}
          <ListSection title={"List of Other Prizes"} items={contestDetails.prizeList} />

          {/* Judges List */}
          <ListSection title={"List of Judges"} items={contestDetails.judges} />
          <div className=' relative  p-4 default-border border-t lg:block'>
            <div className='flex flex-row gap-2'>
            <button
              onClick={report}
              className="border-green-400 border text-center  w-8/12  text-lg bg-green-600  rounded-lg p-1 pt-2 text-white">
              Submit Contest
            </button>
            <button
              onClick={report}
              className="border flex flex-row text-lg default-2 w-fit rounded-lg p-1 pt-2 text-slate-600">
              Report <FlagIcon className="w-10 h-8 mb-1 cursor-pointer text-default-2" />
            </button>
            
            </div>
          </div>

        </div>
      </div>
    </div>



  );
};

export default ContestDetailsCard;
