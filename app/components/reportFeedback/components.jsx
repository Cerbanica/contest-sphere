"use client"
import { useEffect, useState } from "react";
import { LeTextInput, LeTextArea } from "../formComponent";
import supabase from "@/utils/supabaseClient";

// ReportFeedbackCard Component
const ReportFeedbackCard = ({ reportFeedback, fixed, dismiss }) => {
  return (
    <div className='flex flex-col rounded-lg default p-4 border h-full'>
      <span className='text-xl text-default'>{reportFeedback.title} {reportFeedback.contestId!==null&&(<a href="" className="text-default-2 text-sm underline italic">View Contest</a>)}</span>

      <div className='text-sm flex flex-row gap-2'>
        <h1 className='text-red-400 font-bold'>{reportFeedback.type}</h1>
        <h1>12 Aug 2024</h1>
      </div>
      <span className='text-lg  default border-t py-2 my-2'>
        {reportFeedback.description}
      </span>
      
      <div className='flex flex-row gap-2 items-center mt-auto w-full justify-center'>
        <button onClick={() => fixed(reportFeedback.id)} className='p-2 rounded-lg min-w-72 bg-green-700 text-default text-lg font-bold'>
          Fixed
        </button>
        <button onClick={() => dismiss(reportFeedback.id)} className='min-w-72 border border-green-700 text-default text-lg font-bold p-2 rounded-lg'>
          Dismiss
        </button>
      </div>
    </div>
  );
};

// ReportFeedbackForm Component
const ReportFeedbackForm = ({ contestTitle, isOpen, onClose, contestId }) => {
  if (!isOpen) return null;

  const defaultReportForm = {
    title: '',
    description: '',
    type: 'Report',
    category: '',  // Include category if necessary
    contestId: contestId? contestId: null,
    status:"Pending",
  };
  

  const [reportDetails, setReportDetails] = useState(defaultReportForm);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('reportFeedback')
        .insert([{
          title: reportDetails.title || 'Report for '+contestTitle,
          type: reportDetails.category || "Report",
          description: reportDetails.description || "No Description",
          contestId: reportDetails.contestId || null,
          status:reportDetails.status|| "Pending"
        }]);

      if (error) throw error;

      alert("Report submitted successfully!");
      setReportDetails(defaultReportForm);  // Reset form after submission
      onClose();  // Close the modal

    } catch (error) {
      console.error("Error inserting data into Supabase:", error);
    }
  };

  const handleFormChange = (e) => {
    setReportDetails({
      ...reportDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-60 flex items-center justify-center z-50">
      <form onSubmit={handleFormSubmit} className="default flex flex-col border rounded-lg shadow-lg max-w-lg w-full">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute text-lg top-0 right-0 p-4 pt-2 text-default"
          >
            X
          </button>
          <h1 className="text-default text-2xl p-8 pb-0">
            {contestTitle ? `Reports for ${contestTitle}` : "Reports and Feedback"}
          </h1>
        </div>
        <div className="p-8 pt-0">
          <span className="text-sm text-default-2">
            Your reports and feedbacks are highly valuable. 
            <span className="italic"> I honestly dont really know what Im doing</span>
          </span>
          {!contestTitle &&(
          <>
          <LeTextInput
            title="Title"
            name="title"
            value={reportDetails.title}
            onChange={handleFormChange}
          />

         
          <label htmlFor="category" className="block text-lg text-default-2 mt-4">Category</label>
          <LeTextInput
            title="Category"
            name="category"
            value={reportDetails.category}
            onChange={handleFormChange}
          />
          </>
        )}

          {/* Description Textarea */}
          <LeTextArea
            title="Description"
            name="description"
            value={reportDetails.description}
            onChange={handleFormChange}
            rows={12}
          />

          <div className='flex flex-col mt-2 gap-2 items-center w-full justify-center'>
            <button type="submit" className='p-2 rounded-lg min-w-72 bg-green-700 text-default text-lg font-bold'>
              Submit
            </button>
            <button type="button" onClick={onClose} className='min-w-72 border border-green-700 text-default text-lg font-bold p-2 rounded-lg'>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};


export { ReportFeedbackForm, ReportFeedbackCard };
