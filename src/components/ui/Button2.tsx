import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button2: React.FC<ButtonProps> = function () {
  return <button>Hello</button>;
};

export default Button2;
