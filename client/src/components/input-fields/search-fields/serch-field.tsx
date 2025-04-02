import React, { useMemo, useState } from "react";

interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  validation?: (value: string) => string | null;
  className?: string;
}

const SearchField: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Search...",
  validation,
  className = "",
}) => {
  const [error, setError] = useState<string | null>(null);

  const validateInput = useMemo(() => validation, [validation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (validateInput) {
      setError(validateInput(newValue));
    }
  };

  const handleBlur = () => {
    if (validateInput) {
      setError(validateInput(value));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor="search-field" className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id="search-field"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label={label || "Search input"}
        aria-describedby={error ? "error-text" : undefined}
        className={`px-4 py-2 border outline-0 rounded-md outline-none transition ${error ? "border-red-500" : "border-gray-300"} ${className}`}
      />
      {error && <p id="error-text" className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default SearchField;
