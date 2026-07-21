import React from 'react';

export type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
};

export function InputField({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  helperText,
  className = '',
  ...props
}: InputFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full min-h-[44px] px-4 py-2.5 bg-white dark:bg-slate-900 border ${
          error
            ? 'border-red-500 focus:ring-red-500/30'
            : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-500/30'
        } rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 transition-all ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400 font-medium">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-helper`} className="text-xs text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default InputField;
