import type { RLinkProps } from "./types";
import { toHref } from "./href";

/**
 * Get the href and props for a typed link
 * Use this to create your own Link component
 */
export function getLinkProps<TParams = any, TSearch = any>({
  to,
  prefetch = true,
  className,
  activeClassName,
  scroll = true,
  ...props
}: Omit<RLinkProps<TParams, TSearch>, "children">) {
  const href = toHref(to);

  return {
    href,
    prefetch,
    className,
    scroll,
    ...props,
  };
}

/**
 * Typed Link component that accepts route descriptors and props
 * This is a placeholder - will be properly implemented in Next.js apps
 */
export function RLink<TParams = any, TSearch = any>({
  to,
  prefetch = true,
  className,
  activeClassName,
  scroll = true,
  children,
  ...props
}: RLinkProps<TParams, TSearch>) {
  const linkProps = getLinkProps({
    to,
    prefetch,
    className,
    activeClassName,
    scroll,
    ...props,
  });

  // Return a simple object that can be used by the consuming app
  return {
    type: "RLink",
    props: linkProps,
    children,
  } as any;
}

/**
 * Typed button component for programmatic navigation
 * This is a placeholder - will be properly implemented in Next.js apps
 */
export function RNavButton<TParams = any, TSearch = any>({
  to,
  onClick,
  children,
  ...props
}: RLinkProps<TParams, TSearch> & {
  onClick?: (e: any) => void;
}) {
  const href = toHref(to);

  return {
    type: "RNavButton",
    props: { onClick, ...props },
    href,
    children,
  } as any;
}
