import React from "react";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  title?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  title,
}) => {
  return (
    <div className="flex flex-col">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`px-4 py-2 border cursor-pointer border-gray-400 outline-0 rounded-md ${className}`}
        title={title}
      />
    </div>
  );
};

export default DateInput;
