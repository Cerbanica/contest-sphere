'use client';
import supabase from '@/utils/supabaseClient';
import React, { useState, useEffect } from 'react';
import { categories } from '../components/DataList';
import { useRouter } from 'next/navigation';


const Page = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [firstPrize, setFirstPrize] = useState('');
  const [deadline, setDeadline] = useState('');
  const [formError, setFormError] = useState(null);
  const router = useRouter();
  const [error, setError] = useState(null);
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !firstPrize || !deadline) {
      setFormError('Please enter all the required fields');
      return;
    }

    const { data, error } = await supabase
      .from('contests')
      .insert([{ title, category, deadline, firstPrize }]);

    if (error) {
      console.log(error);
      setFormError(`Error: ${error.message}`);
    } else  {
      
      alert("ggs");
      setTitle('');
      setCategory('');
      setFirstPrize('');
      setDeadline('');
    }

    alert("Submitted");
  };

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 mt-16 ">
      <div className="container mx-auto p-6 sm-p-12 ">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <section>
            <h1 className="text-black text-xl font-bold my-2">Add Contest</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className="mb-4">
            <label htmlFor="firstPrize" className="block text-sm font-medium text-gray-700">Main Prize:</label>
            <div className="relative mt-1">
            <span className="absolute text-white inset-y-0 p-4 flex items-center pointer-events-none rounded-md bg-black-100">
                $
              </span>
              <input
                type="number"
                id="firstPrize"
                placeholder="e.g 1000 or Drawing Tablet"
                value={firstPrize}
                onChange={(e) => setFirstPrize(e.target.value)}
                className="block w-full pl-12 p-2  border border-gray-300 rounded-md"
              />
             
            </div>
          </div>


              <div className="mb-4">
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Submission Deadline:</label>
                <input
                  type="date"
                  id="deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Add Contest
              </button>
              <a href="/" className="ml-3 bg-white text-black px-4 py-2 rounded-md border border-solid border-grey-700"> Back</a>

              {formError && <p className="text-red-500 mt-4">{formError}</p>}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
