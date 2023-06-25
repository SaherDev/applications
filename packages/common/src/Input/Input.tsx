import React from 'react';

type InputProps = {
  value: string;
  onChange: (newValue: string) => void;
  class?: string;
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
