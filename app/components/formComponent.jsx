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
          className="mt-4 px-4 py-2 mx-auto bg-green-500 text-white rounded-md"
        >
          Add {itemType}
        </button>
      </div>
    );
  };

export { LeTextInput, LeTextArea, LeDynamicInputList, LeDateInput};