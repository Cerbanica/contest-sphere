"use client"
import React, { useEffect } from 'react';
// Import the necessary icons or components
import { FlagIcon } from '@heroicons/react/24/outline'

import { formatDateManual, formatEntry, calculateDaysRemaining } from '@/utils/contestUtils';
import { BookmarkButton, CategoryLink, ListSection, MainPrizeEntryFee, RemainingDays } from './contestDetailsCard/components';

const ContestDetailsCard = ({
  contestDetails,
  isAdded,
  handleAddUserContest, report

}) => {



  return (
    <div className="border border-t-0 lg:border-t default  lg:rounded-xl  p-0 lg:pr-2">
      <div className="overflow-y-auto max-h-[100vh] border-0 ">
        {/* Image Section */}
        <div
          className="bg-cover bg-center lg:min-h-[30vh] min-h-[30vh] min-w-[20vh] h-full w-full rounded-xl lg:rounded-b-none "
          style={{
            backgroundImage: `url('${contestDetails.linkToThumbnail || 'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg'}')`,
          }}
        ></div>
        <div className='p-4 pt-0'>
          {/* Content Section */}
          <div className="w-full  rounded-r-xl">
            <div className="flex flex-col w-full pt-2  sticky top-0  border-b  border-t lg:border-t-0  default">

              {/* Title and Bookmark */}
              <div className="flex w-full flex-row items-end justify-between pb-2   ">
                <div className='w-9/12 flex flex-col'>
                  <span className=" font-bold text-3xl overflow-hidden m-0">
                    {contestDetails.title}
                  </span>
                  <a href={"/?search=" + contestDetails.organizer} className='text-lg text-blue-400 -mt-2 underline'>{contestDetails.organizer}</a>
                </div>
                <BookmarkButton isAdded={isAdded} onClick={() => handleAddUserContest(contestDetails.id)} />

               

              </div>

              {/* Category, Date, and Deadline */}
              <div className="flex flex-row justify-between">
                <div className="flex flex-col w-full pb-2">
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

            {/* Prize List */}
            <ListSection title={"List of Prizes"} items={contestDetails.prizeList} />

            {/* Judges List */}
            <ListSection title={"List of Judges"} items={contestDetails.judges} />

          </div>
        </div>
      </div>
      <div className='m-8'>
      <button
      onClick={report}
                
                className="border flex flex-row stick bottom-0 text-lg default-2 w-fit rounded-lg p-1 pt-2 text-slate-600"
              >
                Report Contest <FlagIcon className="w-10 h-8 mb-1 cursor-pointer text-default-2" />
              </button>
      </div>
      
    </div>
  );
};

export default ContestDetailsCard;
