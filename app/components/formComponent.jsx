import React from 'react';

const LeTextInput = ({ title,name,value, onChange }) => {
  return (
    <div className=" default mt-4">
      <label htmlFor={title} className="default-input-label ">
        {title}
      </label>
      <input
        type="text"
        id={title}
        name={name}
        value={value}
        onChange={onChange}
        className="default-input"
      />
    </div>
  );
};

const LeDateInput = ({ title,name,value, onChange }) => {
    return (
      <div className="default mt-4">
        <label htmlFor={title} className="default-input-label">
          {title}
        </label>
        <input
          type="date"
          id={title}
          name={name}
          value={value}
          onChange={onChange}
          className="default-input "
        />
      </div>
    );
  };

const LeTextArea = ({ title,name,value, onChange,rows }) => {
    return (
      <div className="mt-4 default">
        <label htmlFor={title} className="default-input-label">
          {title}
        </label>
        <textarea
          type="text"
          id={title}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className="default-input"
        />
      </div>
    );
  };





  ///////////////////////////////////////////////////////////////////////////////////
  const LeDynamicInputList = ({ items, setItems, itemType }) => {
    const handleInputChange = (index, value) => {
      const updatedItems = [...items];
      updatedItems[index].value = value;
      setItems(updatedItems);
    };
  
    const addItem = () => {
      setItems([...items, { label: `${itemType} ${items.length + 1}`, value: '' }]);
    };
  
    const removeItem = (index) => {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    };
  
    return (
      <div>
        {items.map((item, index) => (
          <div key={index} className="mt-4 default">
            <label className="default-input-label">
              {item.label}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="flex-1 default-input"
                placeholder={item.label}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
  
        <button
          type="button"
          onClick={addItem}
          className="button-primary"
        >
          Add {itemType}
        </button>
      </div>
    );
  };
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
            <button type="submit" className='button-primary min-w-72'>
              Submit
            </button>
            <button type="button" onClick={onClose} className='min-w-72 border button-secondary'>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export { LeTextInput, LeTextArea, LeDynamicInputList, LeDateInput};