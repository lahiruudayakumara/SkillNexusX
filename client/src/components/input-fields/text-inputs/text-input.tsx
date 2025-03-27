const TextField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    pattern,
  }: {
    label: string;
    name: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    pattern?: RegExp;
  }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={`Enter ${label.toLowerCase()}`}
        title={label}
        value={value}
        onChange={(e) => {
          if (e.target.value === "" || !pattern || pattern.test(e.target.value)) {
            onChange(e);
            console.log(e.target.value);
          }
        }}
        className={`w-full p-2 border ${error ? "border-red-500" : "border-gray-300"} rounded`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
  

export default TextField;