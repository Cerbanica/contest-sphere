import React from 'react';

const LeTextInput = ({ title,name,value, onChange }) => {
  return (
    <div className="space-y-2 default">
      <label htmlFor={title} className="block text-lg font-medium">
        {title}
      </label>
      <input
        type="text"
        id={title}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full default px-4 py-2 border border-gray-300 rounded-md"
      />
    </div>
  );
};

const LeDateInput = ({ title,name,value, onChange }) => {
    return (
      <div className="space-y-2 default">
        <label htmlFor={title} className="block text-lg font-medium">
          {title}
        </label>
        <input
          type="date"
          id={title}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 default border border-gray-300 rounded-md"
        />
      </div>
    );
  };

const LeTextArea = ({ title,name,value, onChange,rows }) => {
    return (
      <div className="space-y-2 default">
        <label htmlFor={title} className="block text-lg font-medium">
          {title}
        </label>
        <textarea
          type="text"
          id={title}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className="w-full px-4 py-2 default border border-gray-300 rounded-md"
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
          <div key={index} className="space-y-2 default">
            <label className="block text-lg font-medium mt-2">
              {item.label}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="flex-1 px-4 py-2 default border border-gray-300 rounded-md"
                placeholder={item.label}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
  
        <button
          type="button"
          onClick={addItem}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Add {itemType}
        </button>
      </div>
    );
  };

export { LeTextInput, LeTextArea, LeDynamicInputList, LeDateInput};