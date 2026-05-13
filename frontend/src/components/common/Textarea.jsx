'use client';

export default function Textarea({ placeholder = '', value = '', onChange, rows = 4 }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className="textarea"
    />
  );
}
