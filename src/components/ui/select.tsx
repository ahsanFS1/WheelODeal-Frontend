export const Select: React.FC<{
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    children: React.ReactNode;
  }> = ({ value, onChange, className, children }) => {
    return (
      <select
        value={value}
        onChange={onChange}
        className={`px-4 py-2 rounded bg-[#1B1B21] text-[#C33AFF] border border-[#C33AFF] focus:outline-none focus:ring focus:ring-[#C33AFF]/50 ${className}`}
      >
        {children}
      </select>
    );
  };
  
  export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({
    value,
    children,
  }) => {
    return <option value={value}>{children}</option>;
  };
  