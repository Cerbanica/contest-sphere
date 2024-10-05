'use client'
import supabase from '@/utils/supabaseClient';
import { error } from 'console';
import { sourceMapsEnabled } from 'process';
import React, { useState } from 'react'

const AddContest = () => {
    const [title,setTitle] = useState('');
    const [category,setCategory] = useState('');
    const [firstPrize,setFirstPrize] = useState('');
    const [deadline,setDeadline] = useState('');
    const [formError, setFormError] = useState<string | null>(null);


    const handleSubmit = async (e: { preventDefault: () => void; }) =>{

       
        if(!title || !category || !firstPrize || !deadline){
            setFormError('Please enter data')
            return
        }
        console.log(title, category, deadline, firstPrize);

       const { data, error} = await supabase
       .from('contests')
       .insert([{title, category, deadline, firstPrize}])


       if(error){
            console.log(error)
            setFormError("erorr siak : "+ error)
       }
       if(data){
            console.log(data)
            setFormError("succeeed")


       }
    } 
    return (
    <div className='text-dark'>
       <h1 className="text-black text-xl font-bold my-2">Add Contest</h1>
       <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title :</label>
        <input type="text" id='title' value={title} onChange={(e) =>setTitle(e.target.value)} />

        <label htmlFor="category">Category :</label>
        <input type="text" id='category' value={category} onChange={(e) =>setCategory(e.target.value)} />

        <label htmlFor="firstPrize">Grand Prize :</label>
        <input type="number" id='firstPrize' value={firstPrize} onChange={(e) =>setFirstPrize(e.target.value)} />

        
        <label htmlFor="deadline">Submission Deadline :</label>
        <input type="date" id='deadline' value={deadline} onChange={(e) =>setDeadline(e.target.value)} />

        <button>Add Contest</button>

        {formError && <p className='error'>{formError}</p>}
       </form>

    </div>
  )
}

export default AddContest
