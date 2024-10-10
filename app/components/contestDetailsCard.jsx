"use client"
import React from 'react';
// Import the necessary icons or components
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';

const ContestDetailsCard = ({
  contestDetails,
  isAdded,
  handleAddUserContest,
  formatDateManual,
  formatEntry,
  calculateDaysRemaining,
}) => {
  return (
    <div className="border default dark:border-gray-600 border-slate-100 rounded-xl p-4 pr-0">
      <div className="overflow-y-auto max-h-[80vh] border-t border-slate-200 dark:border-gray-600 pr-4">
      {/* Image Section */}
      <div
        className="bg-cover bg-center lg:min-h-[30vh] min-h-[30vh] min-w-[20vh] h-full w-full rounded-xl border-0 lg:border-e-2 border-slate-100 dark:border-gray-700"
        style={{
          backgroundImage: `url('${contestDetails.image || 'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg'}')`,
        }}
      ></div>

      {/* Content Section */}
      <div className="w-full default rounded-r-xl">
        <div className="flex flex-col w-full pt-2 lg:rounded-tr-xl sticky top-0 default border-b  border-slate-200 dark:border-gray-600">

          {/* Title and Bookmark */}
          <div className="flex w-full flex-row items-end justify-between pb-2 ">
            <h2 className="w-9/12 font-bold text-3xl overflow-hidden">
              {contestDetails.title}
            </h2>
            <div className="flex flex-col gap-1 items-end w-3/12">
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
                  className="border border-gray-400 w-fit rounded-lg p-1 pt-2 text-gray-400"
                >
                  <BookmarkOutline className="w-10 h-8 mb-1 cursor-pointer" />
                </button>
              )}
            </div>
          </div>

          {/* Category, Date, and Deadline */}
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-9/12 pb-2">
              <div className="flex flex-row align-middle">
                <span className="self-start text-lg text-blue-400 border border-blue-400 px-2 rounded-lg">
                  {contestDetails.category}
                </span>
                <span className="text-lg text-gray-400 px-2">
                  {formatDateManual(contestDetails.startdate, contestDetails.deadline)}
                </span>
              </div>
            </div>

            {/* Days Remaining */}
            <span
              className={`text-right text-lg font-bold ${
                calculateDaysRemaining(contestDetails.deadline) <= 14
                  ? 'text-red-400'
                  : 'text-green-400'
              }`}
            >
              {calculateDaysRemaining(contestDetails.deadline) === 1
                ? '1 day left'
                : `${calculateDaysRemaining(contestDetails.deadline)} days left`}
            </span>
          </div>
        </div>

       

        {/* Description */}
       
             {/* Entry Fee and Main Prize */}
        <div className="w-full flex flex-col pt-1 bg-none">
          <div className="flex flex-row items-center justify-between text-center py-2 rounded-br-xl">
            <div className="flex-1">
              <div className="flex flex-col text-start">
                <span className="text-gray-400 text-sm">Entry Fee</span>
                <span className="text-3xl dark:text-gray-300">
                  {formatEntry(contestDetails.entryFee)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col px-3 justify-end">
                <span className="text-gray-400 text-sm text-end">Main Prize</span>
                <div className="flex flex-row justify-end">
                  <span className="font-bold text-3xl text-cs">
                    {contestDetails.mainPrize}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
          <div className="py-4 border-t shadow-inner border-slate-200 dark:border-gray-600">
            <span className="text-default text-lg text-justify">
              {contestDetails.description}
            </span>
          </div>

          {/* Prize List */}
          <div className="py-4 border-t border-slate-200 dark:border-gray-600">
            <h6 className="text-default text-2xl w-full text-center font-bold">
              List Of Prizes
            </h6>
            {(Array.isArray(contestDetails.prizeList)
              ? contestDetails.prizeList
              : JSON.parse(contestDetails.prizeList)
            ).map((prize, index) => (
              <div key={index} className="mt-2">
                <h6 className="text-gray-400 text-lg">{prize.label}</h6>
                <span className="text-xl text-default">{prize.value}</span>
              </div>
            ))}
          </div>

          {/* Judges List */}
          <div className="py-4 border-t border-slate-200 dark:border-gray-600 mb-96">
            <h6 className="text-default text-2xl w-full text-center font-bold">
              Judges
            </h6>
            {(Array.isArray(contestDetails.judges)
              ? contestDetails.judges
              : JSON.parse(contestDetails.judges)
            ).map((judge, index) => (
              <div key={index} className="mt-2">
                <h6 className="text-gray-400 text-lg">{judge.label}</h6>
                <span className="text-xl text-default">{judge.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestDetailsCard;
