import React from 'react';

interface Option {
  value: string;
  name: string;
}

interface SelectDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  id: string;
  className?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ options, value, onChange, id, className }) => {
  return (
    <select
      id={id}
      title="Select an option"
      className={`p-2 border outline-0 cursor-pointer border-gray-400 rounded-md ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className='cursor-pointer'>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default SelectDropdown;
