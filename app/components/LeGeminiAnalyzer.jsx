"use client";
import React, { useState } from 'react';
import { PlusCircleIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const LeGeminiAnalyzer = ({ handleSubmit }) => {
  const [files, setFiles] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setTextInput(''); // Clear text input when files are uploaded
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    setFiles([...droppedFiles]);
    setTextInput(''); // Clear text input when files are dropped
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ files, textInput });
  };

  return (
    <div className="flex flex-col default">
      <h1 className="text-3xl  font-bold text-cs  text-center">
        Create Contest 
      </h1>
      <p className="text-default-2 text-md ">
        Enter the contest details as images or texts, and our unpaid interns will auto-fill the forms. 
        Click the autofill button again if the interns didn't do a good job, we will reduce their allowances.
      </p>
      <form className="space-y-6 mt-8" onSubmit={onSubmit}>
        <div className="flex flex-col lg:flex-row w-full gap-4">
          <div className="flex-1">
            <label className="block text-lg text-center mb-2"> Images </label>
            {/* Custom File Input with Drag and Drop */}
            <div
              className={`relative image-picker space-y-2 py-10 default p-4 border rounded-md cursor-pointer min-h-72 ${
                isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-600'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex justify-center text-white ">
                <PlusCircleIcon className="w-16 bg-cs rounded-full" />
              </div>

              {/* The file input */}
              <input
                id="fileInput"
                type="file"
                multiple
                className="absolute inset-0 w-full default  h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />

              <div className="text-center">
                {files.length > 0 ? (
                  <h1 className="text-default text-lg">
                    {files.length} file(s) selected
                  </h1>
                ) : (
                  <p className="text-sm text-gray-400">
                    Drag and drop images here, or{' '}
                    <span className="text-blue-400 underline">click to browse</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {/* Text Input Area */}
            <label htmlFor="textInput" className="block text-lg text-center mb-2">
              Texts
            </label>
            <textarea
              id="textInput"
              name="textInput"
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
                setFiles([]); // Clear the files when text is inputted
              }}
              className="w-full default text-sm px-4 py-2 border  min-h-72 rounded-md"
              rows="12"
              placeholder="Enter contest details for AI analysis"
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-cs text-white font-semibold rounded-md"
          >
            Click to Autofill
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeGeminiAnalyzer;
