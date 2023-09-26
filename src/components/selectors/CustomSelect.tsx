import React, { type ChangeEvent, useState } from 'react';

type CustomSelectProps = {
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  className?: string;
  optionsClassName?: string;
  ref?: React.ForwardedRef<HTMLSelectElement>;
};

export default function CustomSelect({ options, onChange, className, optionsClassName, ref }: CustomSelectProps) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <select value={selectedValue} onChange={handleSelectChange} className={className} ref={ref}>
      {options.map((option) => (
        <option key={option.value} className={optionsClassName} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
