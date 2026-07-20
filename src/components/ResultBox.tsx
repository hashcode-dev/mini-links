import React from 'react';

interface ResultBoxProps {
  label: string;
  value: string | number;
  colorClass: string;
}

export default function ResultBox({ label, value, colorClass }: ResultBoxProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <div className={`text-2xl font-bold ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}
