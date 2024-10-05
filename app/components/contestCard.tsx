'use client'

import { ContestProps } from '@/types';
import Image from 'next/image'
import React, { useState } from 'react'
import CustomButton from './customButton';
import  Link  from 'next/link';
import { TrophyIcon} from '@heroicons/react/24/solid'

interface ContestCardProps{
    contest:ContestProps;
    onClick: (id:string) => void;
}


const ContestCard = ({contest, onClick} : ContestCardProps) => {
    const{id,title, category,  mainPrize,  deadline, entryFee,startdate, description}=contest;
    let status;

   const formatDateManual = (date1: string | number | Date, date2: string | number | Date) => {
    let startDate;
    const endDate = new Date(date2);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
       'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
     ];
    if(date1!=null){
      startDate = new Date(date1);
   
      const month1 = months[startDate.getMonth()];
      const day1 = startDate.getDate();
      const year1 = startDate.getFullYear();
      const month2 = months[endDate.getMonth()];
      const day2 = endDate.getDate();
      const year2 = endDate.getFullYear();

      const formattedYear1 = year1 === year2 ? '' : year1;
  
        return ` ${day1} ${month1} ${formattedYear1} - ${day2} ${month2} ${year2} `;
    }else{

      const month2 = months[endDate.getMonth()];
      const day2 = endDate.getDate();
      const year2 = endDate.getFullYear();

      return `Ends ${day2} ${month2} ${year2} `;

    }
  }

  const formatEntry = (fee: string)=>{
    if(fee=="Free"||fee==null){
      return "Free"
    }
    else{
      return fee;
    }

  }

    const calculateDaysRemaining = (deadline: string | Date) => {
      const currentDate = new Date();
      const deadlineDate = new Date(deadline);
    
      // Calculate the difference in milliseconds
      const diffInMs = deadlineDate.getTime() - currentDate.getTime();
    
      // Convert milliseconds to days
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      diffInDays>14 ? status="On Going" : status="Ending";
    
      return diffInDays >= 0 ? diffInDays : 0; // Return 0 if the deadline has passed
    };
      
   
    const daysRemaining = calculateDaysRemaining(deadline) === 1 ? `1 day left` : `${calculateDaysRemaining(deadline)} days left`;
    
  const viewContest=()=>{
    onClick(id);
  }

  return (
    <div onClick={viewContest}  className='w-full rounded-xl flex lg:flex-row  flex-col  cursor-pointer bg-none min-h-[20vh] border border-slate-100  dark:border-gray-700 focus:ring-2 focus:ring-blue-500'>
     
    <div className="relative">
      {/* Image */}
      <div
        className="bg-cover bg-center lg:min-h-[20vh] min-h-[20vh]  min-w-[20vh] h-full w-full rounded-t-xl lg:rounded-t-none lg:rounded-l-xl  border-0 lg:border-e-2 border-slate-100 dark:border-gray-700"
        style={{backgroundImage:
            "url('https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg')",
        }}
      ></div>
    </div>

    <div className=" w-full bg-gray-100 dark:bg-transparent rounded-r-xl ">
      <div className="bg-white dark:bg-gray-700 pt-2 lg:rounded-tr-xl">
        
        <div className="flex flex-row items-center justify-bottom ">
          <h2 className="px-3  w-9/12 font-bold text-xl overflow-hidden">{title}</h2>
          <h2 className={`text-right px-3 text-sm font-bold w-3/12  ${ status === "Ending" ? "text-red-400" : "text-green-400 "}`}>
          {daysRemaining}</h2> 
        </div>


      
      <div className='px-3   flex flex-col w-9/12 pb-2'>
        <div  className="flex flex-row align-middle">
          <span className="self-start text-sm text-blue-400  border border-blue-400  p-1 px-2 rounded-lg">
            {category}
          </span>
          <span className="text-sm text-gray-400 p-1 px-2">
            {formatDateManual(startdate, deadline)}
          </span>
         
        </div>
       
        </div>
        </div>
      
      
      <div className="w-full flex flex-col pt-1 bg-none">
      <span className='text-sm mt-1 text-justify line-clamp-4 dark:text-gray-300  px-3 '>{description}</span>
      <div className=" flex flex-row items-center justify-bottom text-center py-2  rounded-br-xl">
      <div className="flex-1 ">
      <div className="flex flex-col text-start  px-3 ">
         <span className="text-gray-400 text-sm">Entry Fee</span>
          <span className=" text-2xl  dark:text-gray-300">
           
           {formatEntry(entryFee)}
          </span>
        </div>

      </div>

      

      <div className="flex-1 ">
      <div className="flex flex-col  px-3 justify-end ">
      <span className="text-gray-400 text-sm text-end">Main Prize</span>
      <div className="flex flex-row justify-end">

          <span className=" font-bold text-2xl  text-cs  ">
            {mainPrize}
          </span>
        </div>
        </div>

      </div>
      </div>
      </div>
    </div>
 


   </div>

  )
}

export default ContestCard
