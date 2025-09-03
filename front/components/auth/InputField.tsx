import { forwardRef, InputHTMLAttributes, useState } from 'react';
import ErrMsg from './ErrMsg';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  hasError?: boolean;
  helpMessage?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function Inputfield({ label, hasError, helpMessage, ...props }, ref) {
    const [focused, setFocused] = useState(false);

    const labelColor = hasError
      ? 'text-red-500'
      : focused
        ? 'text-sky-900'
        : '';

    return (
      <div className="flex flex-col gap-2 w-full">
        {label ? (
          <label htmlFor={props.id} className="text-xs text-gray-500">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          aria-invalid={hasError}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
          className="rounded px-4 py-2 border border-gray-200 text-black"
        />

        {helpMessage ? <ErrMsg color={labelColor} msg={helpMessage} /> : null}
      </div>
    );
  },
);

export default InputField;
