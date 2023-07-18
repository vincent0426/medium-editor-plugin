import React from 'react';

type ButtonProps = {
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
};
const Button = ({ className, onClick, children }: ButtonProps) => {
  const defaultClassName = 'border-prime-400 rounded-full border p-1';
  const mergedClassName = `${defaultClassName} ${className}`;

  return (
    <button className={mergedClassName} onClick={onClick}>
      {children}
    </button>
  );
};
  
export default Button;