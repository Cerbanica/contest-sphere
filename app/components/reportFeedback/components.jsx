"use client"
import { useEffect, useState } from "react";
import { LeTextInput, LeTextArea } from "../formComponent";
import supabase from "@/utils/supabaseClient";
import { StopIcon } from "@heroicons/react/24/solid";



// ReportFeedbackCard Component
const ReportFeedbackCard = ({ reportFeedback, fixed, dismiss }) => {
  return (
    <div className='flex flex-col rounded-lg default p-4 border h-full'>
      <span className='text-xl text-default'>{reportFeedback.title} {reportFeedback.contestId !== null && (<a href="" className="text-blue-400 text-sm underline ml-2">View</a>)}</span>

      <div className='text-sm text-default-2 flex flex-row gap-2 items-center'>
        <h1 className={reportFeedback.type === 'Feedback' ?  'bg-opacity-20 bg-green-400 text-green-400 border border-green-400 px-2 p-1 rounded-lg font-bold' : 
          'text-red-400 border border-red-400 px-2 p-1 rounded-lg font-bold bg-opacity-20 bg-red-400 ' }>
          {reportFeedback.type}
        </h1>
        <h1>12 Aug 2024</h1>
      </div>
      <span className='text-lg  text-default-2 default border-t py-2 my-2'>
        {reportFeedback.description}
      </span>

      <div className='flex flex-row gap-2 items-center mt-auto w-full justify-center'>
        <button onClick={() => fixed(reportFeedback.id)} className='button-primary min-w-72 '>
          Fixed
        </button>
        <button onClick={() => dismiss(reportFeedback.id)} className='min-w-72 button-warning'>
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
    type: 'Feedback',
    category: '',  // Include category if necessary
    contestId: contestId ? contestId : null,
    status: "Pending",
  };


  const [reportDetails, setReportDetails] = useState(defaultReportForm);
  const [isFeedback, setIsFeedback] = useState(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (contestId) {
      setReportDetails({
        ...reportDetails,
        type: 'Report',
      });
    }
    try {
      const { data, error } = await supabase
        .from('reportFeedback')
        .insert([{
          title: reportDetails.title || 'Report for ' + contestTitle,
          type: reportDetails.type || "Report",
          description: reportDetails.description || "No Description",
          contestId: reportDetails.contestId || null,
          status: reportDetails.status || "Pending"
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
  const toggleType = (val) => {
    alert("bool:", val);
    if (val == 1) {
      setIsFeedback(true);
    } else {

      setIsFeedback(false);
    }


    if (isFeedback) {
      setReportDetails({
        ...reportDetails,
        type: 'Feedback',
      });
      console.log("IS feedback true:", isFeedback)
    } else {
      setReportDetails({
        ...reportDetails,
        type: 'Report',
      });
      console.log("IS feedback false :", isFeedback)
    }

  }
  return (
    <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-60 flex items-center justify-center z-50">
      <form onSubmit={handleFormSubmit} className="overflow-y-auto max-h-[90vh] default m-4 flex flex-col border rounded-lg shadow-lg max-w-lg w-full">
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
          {!contestTitle && (
            <>
              <LeTextInput
                title="Title"
                name="title"
                value={reportDetails.title}
                onChange={handleFormChange}
              />


              <label htmlFor="category" className="block text-lg text-default-2 mt-4">Category</label>
              <div onClick={() => [setIsFeedback(true), setReportDetails({
                ...reportDetails,
                type: 'Feedback',
              })]} className="text-default-2 flex flex-row gap-2 items-center">
                {isFeedback ? (
                  <StopIcon className="size-8 text-green-400" />
                ) : (
                  <StopIcon className="size-8 text-slate-300 dark:text-slate-500" />
                )}
                Feedback
              </div>

              <div onClick={() => [setIsFeedback(false), setReportDetails({
                ...reportDetails,
                type: 'Report ',
              })]} className="text-default-2 flex flex-row gap-2 items-center">
                {!isFeedback ? (
                  <StopIcon className="size-8 text-red-400" />
                ) : (
                  <StopIcon className="size-8 text-slate-300 dark:text-slate-500" />
                )}
                Errors or Bugs
              </div>

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
            <button type="submit" className='min-w-72 button-primary'>
              Submit
            </button>
            <button type="button" onClick={onClose} className='min-w-72 button-secondary'>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};


export { ReportFeedbackForm, ReportFeedbackCard };
