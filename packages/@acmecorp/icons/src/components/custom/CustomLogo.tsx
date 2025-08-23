import * as React from "react";

interface CustomLogoProps {
  size?: number | string;
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const CustomLogo: React.FC<CustomLogoProps> = ({
  size = 24,
  className = "",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = false,
  onClick,
  style,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      onClick={onClick}
      style={style}
      {...props}
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
