"use client"
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage   
 < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageChange   
 = (selectedPage) => {
    onPageChange(selectedPage);
  };

  const visiblePages = 5;
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages >= visiblePages) {
    startPage = Math.max(currentPage - 2, 1);
    endPage = Math.min(currentPage + 2, totalPages);

    if (currentPage <= 3) {
      startPage = 1;
      endPage = Math.min(visiblePages, totalPages);
    } else if (currentPage + 2 >= totalPages) {
      startPage = Math.max(totalPages - visiblePages + 1, 1);
      endPage = totalPages;
    }
  }

  return (
    <div className="flex flex-row w-full justify-center mx-auto  lg:m-2">
    <div className="w-auto p-2 rounded-2xl default border flex items-center justify-center">
      {/* Render previous button only if it's not disabled */}
      {currentPage > 1 && (
        <button
          className=" w-6"
          onClick={handlePrevPage}
        >
            <ChevronLeftIcon className="w-6 " />
        </button>
      )}
  
      {Array.from({ length: totalPages }, (_, index) => {
        if (index + 1 >= startPage && index + 1 <= endPage) {
          return (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-12 text-center text-md font-bold mx-1 rounded-lg ${
                index + 1 === currentPage ? 'bg-cs text-white ' : 'default bg-red-400'
              }`}
            >
              {index + 1}
            </button>
          );
        }
        return null;
      })}
  
      {/* Render next button only if it's not disabled */}
      {currentPage < totalPages && (
        <button
          className="w-6"
          onClick={handleNextPage}
        >
          <ChevronRightIcon className="w-6 " />
        </button>
      )}
    </div>
  </div>
  
  );
};

export default Pagination;