"use client"
import React, { useEffect } from 'react';
// Import the necessary icons or components
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { formatDateManual, formatEntry, calculateDaysRemaining } from '@/utils/contestUtils';
import { categoriesList } from '@/app/dataList';



// Reusable ListSection Component
const ListSection = ({ title, items }) => (
    <div className="py-4 border-t default">
      <h6 className="text-default text-2xl w-full text-center font-bold">{title}</h6>
      {items!==null&&(Array.isArray(items) ? items : JSON.parse(items)).map((item, index) => (
        <div key={index} className="mt-2">
          <h6 className="text-default-2 text-lg">{item.label}</h6>
          <span className="text-xl text-default">{item.value}</span>
        </div>
      ))}
    </div>
  );



  const CategoryLink = ({ category}) =>{
 
    
    const selectedCategory = categoriesList.find(list => list.name === category) || { colour: 'bg-purple-400', name: 'Unknown' };

    return(
    
    <a 
      href={`/?category=${category}`}
      className={`self-start bg-opacity-40  font-bold  text-sm  p-1 px-2 rounded-lg ${
        selectedCategory.colour ? `text-${selectedCategory.colour} bg-${selectedCategory.colour}` : 'bg-purple-400 text-purple-400'  }`}>
                {category}
              </a>
  )};


  const BookmarkButton = ({ isAdded, onClick }) => {
    return (
      <div className="flex flex-col gap-1 items-end w-3/12 pr-2">
        {isAdded ? (
          <button
            onClick={onClick}
            className="bg-cs w-fit rounded-lg p-1 pt-2 text-white"
          >
            <BookmarkSolid className="w-10 h-8 mb-1 cursor-pointer text-white" />
          </button>
        ) : (
          <button
            onClick={onClick}
            className="border default-2 w-fit rounded-lg p-1 pt-2 text-slate-600"
          >
            <BookmarkOutline className="w-10 h-8 mb-1 cursor-pointer" />
          </button>
        )}
      </div>
    );
  };

  const RemainingDays =({deadline})=>{
    const daysRemaining = calculateDaysRemaining(deadline);
    return(
        
          <span
          className={`text-right px-3 text-lg font-bold w-3/12  ${daysRemaining <= 14 ? "text-red-400" : "text-green-400 "}`}>
            {daysRemaining == 0 ? "Ends Today" : daysRemaining === -1 ? " Closed" : "Ends in " + daysRemaining + " days"}
          </span>
    )
  }

  const MainPrizeEntryFee =({mainPrize, entryFee})=>{

    return(
        <div className="w-full flex flex-col pt-1 bg-none">
          <div className="flex flex-row items-center justify-between text-center py-2 rounded-br-xl">
            <div className="flex-1">
              <div className="flex flex-col text-start">
                <span className="text-default-2 text-sm">Entry Fee</span>
                <span className="text-3xl text-default">
                  {formatEntry(entryFee)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col px-3 justify-end">
                <span className="text-default-2 text-sm text-end">Main Prize</span>
                <div className="flex flex-row justify-end">
                  <span className="font-bold text-3xl text-cs">
                    {mainPrize}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }

  export{ListSection, CategoryLink,BookmarkButton,RemainingDays, MainPrizeEntryFee};