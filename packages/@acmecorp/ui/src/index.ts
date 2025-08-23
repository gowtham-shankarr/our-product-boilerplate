// Re-export utilities
export { cn } from "./lib/utils";

// Re-export components
export { Button, buttonVariants } from "./components/ui/button";
export type { ButtonProps } from "./components/ui/button";

// Theme provider placeholder
export const ThemeProvider = ({ children }: { children: any }) => {
  return children;
};
