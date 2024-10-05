"use client";
import React, { useState, useEffect } from "react";

const DynamicForm = ({ contestDetails = [], contestPrizeList = [], contestJudges = [] }) => {
  const [formData, setFormData] = useState({});
  const [details, setDetails] = useState(contestDetails);
  const [prizes, setPrizes] = useState(contestPrizeList);
  const [judges, setJudges] = useState(contestJudges);

  // Set initial form data on component mount
  useEffect(() => {
    const initialData = {
      details: contestDetails.reduce((acc, detail, index) => {
        acc[index] = detail || "";
        return acc;
      }, {}),
      contestPrizeList: contestPrizeList.reduce((acc, prize, index) => {
        acc[index] = prize || "";
        return acc;
      }, {}),
      contestJudges: contestJudges.reduce((acc, judge, index) => {
        acc[index] = judge || "";
        return acc;
      }, {}),
    };
    setFormData(initialData);
    
  }, [contestDetails, contestPrizeList, contestJudges]);

  // Handle dynamic list inputs (for details, prizes, and judges)
  const handleDynamicInputChange = (listName, index, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [listName]: {
        ...prevData[listName],
        [index]: value,
      },
    }));
  };

  // Add a new detail input field
  const addDetail = () => {
    setDetails([...details, { id: `detail${details.length + 1}`, label: `Detail ${details.length + 1}`, input: "" }]);
    setFormData((prevData) => ({
      ...prevData,
      details: {
        ...prevData.details,
        [details.length]: "",
      },
    }));
  };

  // Remove a detail input field
  const removeDetail = (index) => {
    setDetails(details.filter((_, i) => i !== index));
    const updatedDetails = { ...formData.details };
    delete updatedDetails[index];
    setFormData((prevData) => ({
      ...prevData,
      details: updatedDetails,
    }));
  };

  // Add a new prize input field
  const addPrize = () => {
    setPrizes([...prizes, { id: `prize${prizes.length + 1}`, label: `Prize ${prizes.length + 1}`, input: "" }]);
    setFormData((prevData) => ({
      ...prevData,
      contestPrizeList: {
        ...prevData.contestPrizeList,
        [prizes.length]: "",
      },
    }));
  };

  // Remove a prize input field
  const removePrize = (index) => {
    setPrizes(prizes.filter((_, i) => i !== index));
    const updatedPrizes = { ...formData.contestPrizeList };
    delete updatedPrizes[index];
    setFormData((prevData) => ({
      ...prevData,
      contestPrizeList: updatedPrizes,
    }));
  };

  // Add a new judge input field
  const addJudge = () => {
    setJudges([...judges, `Judge ${judges.length + 1}`]);
    setFormData((prevData) => ({
      ...prevData,
      contestJudges: {
        ...prevData.contestJudges,
        [judges.length]: "",
      },
    }));
  };

  // Remove a judge input field
  const removeJudge = (index) => {
    setJudges(judges.filter((_, i) => i !== index));
    const updatedJudges = { ...formData.contestJudges };
    delete updatedJudges[index];
    setFormData((prevData) => ({
      ...prevData,
      contestJudges: updatedJudges,
    }));
  };
  // Check if the label contains "date" to render a date picker
  const isDateField = (id) => id.toLowerCase().includes("date");
  const formatDate = (dateString) => {
    // If the date is in DD/MM/YYYY format, convert it to YYYY-MM-DD
    const [day, month, year] = dateString.split("/");
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateString; // Return as-is if it's already in YYYY-MM-DD format
  };
  return (
    <form className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg">
      {/* Contest Details (Dynamic) */}
      {details.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Contest Details</h3>
          {details.map((field, index) => (
            <div key={index} className="mb-4 flex items-center">
              <div className="flex-1">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  {field.label}:
                </label>
                {isDateField(field.label) ? (
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                    value={formatDate(formData.details?.[index].value || field.value || "")}
                    onChange={(e) => handleDynamicInputChange("details", index, e.target)}
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                    value={formData.details?.[index].value || ""}
                    onChange={(e) => handleDynamicInputChange("details", index, e.target)}
                  />
                )}
              </div>
              
            </div>
          ))}
          
        </div>
      )}

      {/* Contest Prize List */}
      {prizes.length > 0 && (
        <div>
            <div className="flex">
          <h3 className="text-xl w-10/12 font-semibold mb-4 text-gray-700">Contest Prize List</h3>
          <button
            type="button"
            onClick={addPrize}
            className="w-2/12 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:bg-blue-600 transition duration-200"
          >
            +
          </button>
          </div>
          {prizes.map((field, index) => (
            <div key={index} className="mb-4 flex items-center">
              <div className="flex-1">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  {field.label}:
                </label>
                <div className="flex">
                <input
                  type="text"
                  className="w-10/12 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                  value={formData.contestPrizeList?.[index].value || ""}
                  onChange={(e) => handleDynamicInputChange("contestPrizeList", index, e.target)}
                />
                  <button
                type="button"
                onClick={() => removePrize(index)}
                className="ml-4 px-3 w-2/12 py-1 bg-red-500 text-white rounded-lg"
              >
                -
              </button>
              </div>
              </div>
            
            </div>
          ))}
         
        </div>
      )}

      {/* Contest Judges */}
      {judges.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Contest Judges</h3>
          {judges.map((_, index) => (
            <div key={index} className="mb-4 flex items-center">
              <div className="flex-1">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  {`Judge ${index+1}:`}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                  value={formData.contestJudges?.[index].value || ""}
                  onChange={(e) => handleDynamicInputChange("contestJudges", index, e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeJudge(index)}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addJudge}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:bg-blue-600 transition duration-200"
          >
            Add Judge
          </button>
        </div>
      )}

      {/* Submit button */}
      <button
        type="button"
        onClick={() => alert(JSON.stringify(formData))}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:bg-green-600 transition duration-200 mt-4"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
