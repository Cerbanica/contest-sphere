"use client"
import React, { useEffect } from 'react';
// Import the necessary icons or components
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { formatDateManual, formatEntry, calculateDaysRemaining } from '@/utils/contestUtils';
import { categoriesList } from '../dataList';

const ContestDetailsCard = ({
  contestDetails,
  isAdded,
  handleAddUserContest
 
}) => {
  const daysRemaining = calculateDaysRemaining(contestDetails.deadline);
  const selectedCategory = categoriesList.find(category => category.name === contestDetails.category) || { colour: 'bg-purple-400', name: 'Unknown' };
 

  
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
        <div className="flex flex-col w-full pt-2  sticky top-0  border-b shadow-lg border-t lg:border-t-0  default">

          {/* Title and Bookmark */}
          <div className="flex w-full flex-row items-end justify-between pb-2   ">
            <div className='w-9/12 flex flex-col'>
            <span className=" font-bold text-3xl overflow-hidden m-0">
              {contestDetails.title}
            </span>
            <a href={"/?search="+contestDetails.organizer} className='text-lg text-blue-400 -mt-2 underline'>{contestDetails.organizer}</a>
            </div>
            <div className="flex flex-col gap-1 items-end w-3/12 pr-2">
              {isAdded ? (
                <button
                  onClick={() => handleAddUserContest(contestDetails.id)}
                  className="bg-cs w-fit rounded-lg p-1 pt-2 text-white"
                >
                  <BookmarkSolid className="w-10 h-8 mb-1 cursor-pointer text-white" />
                </button>
              ) : ( 
                <button
                  onClick={() => handleAddUserContest(contestDetails.id)}
                  className="border default-2 w-fit rounded-lg p-1 pt-2 text-slate-600"
                >
                  <BookmarkOutline className="w-10 h-8 mb-1 cursor-pointer" />
                </button>
              )}
            </div>
          </div>

          {/* Category, Date, and Deadline */}
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-9/12 pb-2">
              <div className="flex   flex-row align-middle">
                <a href={`/?category=${contestDetails.category}`}className={`self-start bg-opacity-40  font-bold  text-sm  p-1 px-2 rounded-lg ${
          selectedCategory.colour ? `text-${selectedCategory.colour} bg-${selectedCategory.colour}` : 'bg-purple-400 text-purple-400'  }`}>
                  {contestDetails.category}
                </a>
                <span className="text-lg text-gray-400 px-2">
                  {formatDateManual(contestDetails.startdate, contestDetails.deadline)}
                </span>
              </div>
            </div>

            {/* Days Remaining */}
            <span
            className={`text-right px-3 text-lg font-bold w-3/12  ${daysRemaining <= 14 ? "text-red-400" : "text-green-400 "}`}>
              {daysRemaining == 0 ? "Ends Today" : daysRemaining === -1 ? " Closed" : "Ends in " + daysRemaining + " days"}
            </span>
          </div>
        </div>

       

        {/* Description */}
       
             {/* Entry Fee and Main Prize */}
        <div className="w-full flex flex-col pt-1 bg-none">
          <div className="flex flex-row items-center justify-between text-center py-2 rounded-br-xl">
            <div className="flex-1">
              <div className="flex flex-col text-start">
                <span className="text-default-2 text-sm">Entry Fee</span>
                <span className="text-3xl text-default">
                  {formatEntry(contestDetails.entryFee)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col px-3 justify-end">
                <span className="text-default-2 text-sm text-end">Main Prize</span>
                <div className="flex flex-row justify-end">
                  <span className="font-bold text-3xl text-cs">
                    {contestDetails.mainPrize}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
          <div className="py-4 border-t shadow-inner default">
            <span className="text-default-2  text-lg text-justify">
              {contestDetails.description}
            </span>
          </div>

          {/* Prize List */}
          <div className="py-4 border-t default">
            <h6 className="text-default text-2xl w-full text-center font-bold">
              List Of Prizes
            </h6>
            {contestDetails.prizeList!=null&&(Array.isArray(contestDetails.prizeList)
              ? contestDetails.prizeList
              : JSON.parse(contestDetails.prizeList)
            ).map((prize, index) => (
              <div key={index} className="mt-2">
                <h6 className="text-default-2 text-lg">{prize.label}</h6>
                <span className="text-xl text-default">{prize.value}</span>
              </div>
            ))}
          </div>

          {/* Judges List */}
          <div className="py-4 border-t default pb-64">
            <h6 className="text-default text-2xl w-full text-center font-bold">
              Judges
            </h6>
            {contestDetails.judges!=null&&(Array.isArray(contestDetails.judges)
              ? contestDetails.judges
              : JSON.parse(contestDetails.judges)
            ).map((judge, index) => (
              <div key={index} className="mt-2">
                <h6 className="text-default-2 text-lg">{judge.label}</h6>
                <span className="text-xl text-default">{judge.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContestDetailsCard;
