"use client"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useState } from 'react';

interface TabProps {
  id: number;
  name: string;
  content?: string; // Optional content property
}
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }
function Tabs({ tabsData }: { tabsData: TabProps[] }) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <TabGroup selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
      <TabList className="flex w-full ">
        {tabsData.map((tab) => (
          <Tab
            key={tab.id}
            className={({ selected }) =>
                classNames(
                  'w-72 py-3 text-lg  rounded-xl mx-1 outline-none',
                 
                  selected ? '  default rounded-xl' : ' dark:text-gray-400 dark:bg-gray-700 text-gray-500 bg-gray-300'
                )
              }
            >
            {tab.name}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="default p-4 rounded-xl border-2 mt-4 dark:border-slate-500 border-gray-300">
        {tabsData.map((tab) => (
          <TabPanel key={tab.id}>
            <div className='p-4'>{tab.content}</div>
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}

export default Tabs;