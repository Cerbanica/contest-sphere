"use client"
import React, { Suspense, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'
const SearchBar = ({ onSearchChange, initialSearchTerm = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleInputChange = (event) => {
    const searchTerm = event.target.value;
    console.log("search query : " + searchTerm);
    setSearchTerm(searchTerm);
  };

  const handleSearch = () => {
    onSearchChange(searchTerm);// Notify parent component of the change
    console.log("search query2 : " + searchTerm);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className=" w-full  flex flex-col justify-center items-center ">
      <div className="flex w-full flex-row text-lg text-left default rounded-2xl justify-center items-center ">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search contests..."
          className="default w-full pr-12 ml-4 outline-none mr-2"
        />
        <div className="p-1">
          <button
             onClick={() => handleSearch(searchTerm)} 
            className={`  w-24 bg-cs rounded-xl p-1 flex items-center justify-center`}>
            <MagnifyingGlassIcon className="size-8 fill-white" />
          </button>
        </div>
        
      </div>
    </div>
    </Suspense>
  );
};

export default SearchBar;
