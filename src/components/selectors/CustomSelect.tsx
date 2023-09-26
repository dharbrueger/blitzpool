import React, { type ChangeEvent, useState, useEffect } from 'react';

type CustomSelectProps = {
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  className?: string;
  optionsClassName?: string;
  ref?: React.ForwardedRef<HTMLSelectElement>;
};

export default function CustomSelect({ options, onChange, className, optionsClassName, ref }: CustomSelectProps) {
  const [selectedValue, setSelectedValue] = useState(options[0]?.value ?? '');

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (onChange && options.length > 0) {
      onChange(options[0]?.value ?? '');
    }
  }, [options, onChange]);

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
