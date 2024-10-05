"use client"
import React, { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

import { ChevronDownIcon } from '@heroicons/react/20/solid';

const MyListbox = ({ items, selectedItem, onSelect }) => {
  const [selected, setSelected] = useState(selectedItem);

  const handlePrizeChange = (value) => {
    setSelected(value);
    onSelect(value); // Notify parent component of the change
  };

  return (
   
      <Listbox value={selected} onChange={handlePrizeChange}>
      <ListboxButton className="flex flex-row w-full default text-sm text-left py-1.5 px-3 rounded-xl items-center justify-between">
  <div className="w-full pr-4 flex items-center truncate">{selectedItem}</div>
  <div className="flex items-center justify-center">
    <ChevronDownIcon className="size-4" />
  </div>
</ListboxButton>
      <ListboxOptions anchor="bottom start" className="mt-2 w-full lg:w-72 default-2  text-sm text-left  rounded-2xl py-3">
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

export default MyListbox;
