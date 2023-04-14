import React from 'react';

type InputProps = {
  value: string;
  onChange: (newValue: string) => void;
};

export const Input = ({ value, onChange }: InputProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
