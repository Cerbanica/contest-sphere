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
      <h6 className="text-default text-xl lg:text-2xl w-full text-center font-bold">{title}</h6>
      {items!==null&&(Array.isArray(items) ? items : JSON.parse(items)).map((item, index) => (
        <div key={index} className="mt-2">
          <h6 className="text-default-2 text-md lg:text-lg">{item.label}</h6>
          <span className="text-lg lg:text-xl text-default">{item.value}</span>
        </div>
      ))}
    </div>
  );



  const CategoryLink = ({category}) =>{
    
    const selectedCategory = categoriesList.find(list => list.name === category) || { colour: ' bg-teal-400 border-teal-400 text-teal-400'};
    
    return(
    
      <a 
      href={`/?category=${category}`}
      className={` border whitespace-nowrap font-bold bg-opacity-20 text-sm p-1  px-2 min-w-fit rounded-lg ${
        selectedCategory.colour }`}
    >
      {category}
    </a>
  )};


  const BookmarkButton = ({ isAdded, onClick }) => {
    return (
      <div className="flex flex-col gap-1  w-fit ">
        {isAdded ? (
          <button
            onClick={onClick}
            className=" w-fit rounded-lg p-1 pt-2 text-default-2"
          >
            <BookmarkSolid className="button-icon " />
          </button>
        ) : (
          <button
            onClick={onClick}
            className="w-fit rounded-lg p-1 pt-2 text-default-2"
          >
            <BookmarkOutline className="button-icon" />
          </button>
        )}
      </div>
    );
  };

  const RemainingDays =({deadline})=>{
    const daysRemaining = calculateDaysRemaining(deadline);
    return(
        
          <span
          className={`text-right px-3 text-md lg:text-lg font-bold w-full ${daysRemaining <= 14 ? "text-red-400" : "text-green-400 "}`}>
            {daysRemaining == 0 ? "Ends Today" : daysRemaining === -1 ? " Closed" :  daysRemaining + " days left"}
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