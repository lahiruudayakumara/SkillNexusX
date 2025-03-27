import React, { useState } from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  validation?: (value: string) => string | null;
  className?: string;
}

const SearchField: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
  validation,
  className,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (validation) {
      const errorMessage = validation(newValue);
      setError(errorMessage);
    } else {
      setError(null);
    }
  };

  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={`px-4 py-2 border border-gray-400 outline-0 rounded-md ${className}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SearchField;
