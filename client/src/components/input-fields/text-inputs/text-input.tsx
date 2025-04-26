interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  pattern?: RegExp;
  width?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  pattern,
  width = "w-full",
  placeholder,
  disabled = false,
  required = false,
  autoFocus = false,
  className = "",
}) => (
  <div className={`mb-3 ${className}`} style={{ width }}>
    <label
      htmlFor={name}
      className="block text-sm font-medium mb-1"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      title={label}
      value={value}
      onChange={(e) => {
        if (e.target.value === "" || !pattern || pattern.test(e.target.value)) {
          onChange(e);
        }
      }}
      className={`w-full p-2 border outline-0 ${error ? "border-red-500" : "border-gray-300"} rounded`}
      disabled={disabled}
      required={required}
      autoFocus={autoFocus}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default TextField;
