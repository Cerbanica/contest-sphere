"use client"
import React, { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Checkbox } from '@headlessui/react'

import { ChevronDownIcon, StopIcon } from '@heroicons/react/20/solid';

const MyListbox = ({ items, selectedItem, onSelect }) => {
  const [selected, setSelected] = useState(selectedItem);

  const handlePrizeChange = (value) => {
    setSelected(value);
    onSelect(value); // Notify parent component of the change
  };

  return (

    <Listbox value={selected} onChange={handlePrizeChange}>
      <ListboxButton className="flex flex-row w-full text-default-2 text-sm text-left py-1.5 px-3 rounded-lg items-center justify-between ">
        <div className="w-full pr-4 flex items-center truncate">{selectedItem}</div>
        <div className="flex items-center justify-center">
          <ChevronDownIcon className="size-4" />
        </div>
      </ListboxButton>
      <ListboxOptions anchor="bottom start" className="mt-2 w-full lg:w-72 default  border text-sm text-left  rounded-2xl py-3">
        {items.map((item) => (
          <ListboxOption key={item.id} value={item} className="group flex cursor-default items-center  py-2 px-4 select-none data-[focus]:bg-slate-200 dark:data-[focus]:bg-slate-700 "
          >
            {item.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

const LeListbox = ({ items, selectedItem, onSelect }) => {
  const [selected, setSelected] = useState(selectedItem);

  const handlePrizeChange = (value) => {
    setSelected(value);
    onSelect(value); // Notify parent component of the change
  };

  return (

    <Listbox value={selected} onChange={handlePrizeChange}>
      <ListboxButton className="flex flex-row w-full bg-slate-100 dark:bg-slate-700 py-1.5 text-sm text-left  px-3 rounded-md items-center justify-between ">
        <div className="w-full text-lg items-center truncate">{selectedItem}</div>
        <div className="flex items-center justify-center">
          <ChevronDownIcon className="size-4" />
        </div>
      </ListboxButton>
      <ListboxOptions anchor="bottom start" className="mt-2 w-full lg:w-72 default  border text-sm text-left  rounded-md py-3">
        {items.map((item) => (
          <ListboxOption key={item.id} value={item} className="group flex cursor-default items-center  py-2 px-4 select-none data-[focus]:bg-slate-200 dark:data-[focus]:bg-slate-700 "
          >
            {item.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

const LeListboxCheckbox = ({ items, selected, onSelect }) => {
  const [selectedItems, setSelectedItems] = useState(selected);

  const addItem=(item)=>{
    
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.some((selectedItem) => selectedItem.id === item.id)) {
        // Item exists, so remove it

       // alert(item, selectedItems);
        return prevSelectedItems.filter((selectedItem) => selectedItem.id !== item.id);
      } else {
        // Item does not exist, so add it

        //alert(item, selectedItems);
        return [...prevSelectedItems, item];
      }
     
    });  }
  return (
    <Listbox value={selectedItems} >
      <ListboxButton className="flex flex-row w-full text-default-2 text-sm text-left py-1.5 px-3 rounded-lg items-center justify-between ">
        <div className="w-full pr-4 flex items-center truncate">
          {selectedItems.length > 0 ? `${selectedItems.length} filter(s) selected` : selectedItem}
        </div>
        <div className="flex items-center justify-center">
          <ChevronDownIcon className="size-4" />
        </div>
      </ListboxButton>
      <ListboxOptions anchor="bottom start" className="mt-2 w-full lg:w-72 default border text-sm text-left rounded-md py-3">
        {items.map((item) => (
          <ListboxOption
            key={item.id}
            value={item}
            className="group gap-2 flex cursor-default items-center py-2 px-4 select-none data-[focus]:bg-slate-200 dark:data-[focus]:bg-slate-700"
          >
            
            <button onClick={()=>addItem(item.id)} className='text-default-2 flex flex-row gap-2 items-center'>
            {selectedItems.some((selectedItem) => selectedItem.id === item.id) ? (
                <StopIcon className="size-4 text-green-400" />
              ) : (
                <StopIcon className="size-4 text-slate-300 dark:text-slate-500" />
              )}
              {item.name}</button>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

export { MyListbox, LeListbox, LeListboxCheckbox };
