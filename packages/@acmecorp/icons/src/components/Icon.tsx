import React from "react";
import { IconName } from "./registry";
import { iconRegistry } from "./registry";

export interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = "",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = false,
  onClick,
  style,
  ...props
}) => {
  const IconComponent = iconRegistry[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  const iconProps = {
    size,
    className,
    "aria-label": ariaLabel,
    "aria-hidden": ariaHidden,
    onClick,
    style,
    ...props,
  };

  return <IconComponent {...iconProps} />;
};
