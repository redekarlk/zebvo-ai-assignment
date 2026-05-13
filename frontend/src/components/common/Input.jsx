'use client';

export default function Input({ type = 'text', placeholder = '', value = '', onChange, required = false }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="input"
    />
  );
}
