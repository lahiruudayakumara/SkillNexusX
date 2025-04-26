const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  error,
  pattern,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  pattern?: RegExp;
}) => (
  <div className="mb-3">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={(e) => {
        if (e.target.value === "" || !pattern || pattern.test(e.target.value)) {
          onChange(e);
        }
      }}
      className={`w-full p-2 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded`}
      title={label}
      placeholder={`Enter ${label.toLowerCase()}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default TextAreaField;
