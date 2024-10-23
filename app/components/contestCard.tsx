'use client'

import { ContestProps } from '@/types';
import Image from 'next/image'
import React, { useState } from 'react'
import CustomButton from './customButton';
import Link from 'next/link';
import { TrophyIcon } from '@heroicons/react/24/solid'
import { formatDateManual, formatEntry, calculateDaysRemaining } from '@/utils/contestUtils';
import { CategoryLink } from './contestDetailsCard/components';


interface ContestCardProps {
  contest: ContestProps;
  onClick: (id: string) => void;
}


const ContestCard = ({ contest, onClick }: ContestCardProps) => {
  const { id, title, category, mainPrize, deadline, entryFee, startdate, description, linkToThumbnail } = contest;
  const daysRemaining = calculateDaysRemaining(deadline);

  const viewContest = () => {
    onClick(id);
  }

  return (
    <button onClick={viewContest} className='w-full rounded-xl   default min-h-[20vh] border  dark:hover:border-slate-500 hover:border-slate-400 focus:border-slate-400 dark:focus:border-slate-500  transition-colors duration-100'>
      <div className='flex lg:flex-row  flex-col'>
      <div className="relative">
        {/* Image */}
        <div
          className="bg-cover bg-center lg:min-h-[20vh] min-h-[20vh]  min-w-[20vh] h-full w-full rounded-t-xl lg:rounded-r-none lg:rounded-l-xl border-0 lg:border-e-2 border-slate-100 dark:border-gray-700"
          style={{
            backgroundImage: `url('${linkToThumbnail || 'https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg'}')`,

          }}
        ></div>
      </div>

      <div className=" w-full  rounded-r-xl ">
        <div className="pt-2 lg:rounded-tr-xl">

          <div className="flex flex-row items-center justify-bottom ">
            <h2 className="px-3  w-full font-bold text-xl text-left overflow-hidden">{title}</h2>
          
          </div>



          <div className='px-3   flex flex-col w-full pb-2'>
            <div className="flex flex-row align-middle">
            <CategoryLink category={category} />
             
              <span className={`ml-auto text-sm font-bold py-1  ${daysRemaining <= 14 ? "text-red-400" : "text-green-400 "}`}>
              {daysRemaining == 0 ? "Ends Today" : daysRemaining === -1 ? " Closed" :   daysRemaining + " days left"}</span>

            </div>

          </div>
        </div>


        <div className="w-full flex flex-col pt-1 border-t rounded-br-2xl default-border text-default-2">
          <span className='text-sm mt-1 text-justify line-clamp-4   px-3 '>{description}</span>
          <div className=" flex flex-row items-center justify-bottom text-center py-2  rounded-br-xl">
            <div className="w-4/12 ">
              <div className="flex flex-col text-start  px-3 ">
                <span className="text-sm  -mb-2">Entry Fee</span>
                <span className="text-default text-2xl ">

                  {formatEntry(entryFee)}
                </span>
              </div>

            </div>



            <div className="w-8/12 ">
              <div className="flex flex-col  px-3 justify-end">
                <span className=" text-sm text-end -mb-2">Main Prize</span>
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


    </button>

  )
}

export default ContestCard
