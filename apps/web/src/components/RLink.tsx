import React from "react";
import Link from "next/link";
import { href } from "@acmecorp/router";
import type { HrefInput } from "@acmecorp/router";

interface RLinkProps<TParams = any, TSearch = any> {
  to: HrefInput<TParams, TSearch>;
  params?: TParams;
  search?: TSearch;
  hash?: string;
  prefetch?: boolean;
  className?: string;
  activeClassName?: string;
  scroll?: boolean;
  children: React.ReactNode;
}

export function RLink<TParams = any, TSearch = any>({
  to,
  params,
  search,
  hash,
  children,
  className,
  prefetch,
  scroll,
  ...props
}: RLinkProps<TParams, TSearch>) {
  // Generate the href using the router package
  const linkHref = href(to, { params, search, hash });

  return (
    <Link
      href={linkHref as any}
      className={className}
      prefetch={prefetch}
      scroll={scroll}
      {...props}
    >
      {children}
    </Link>
  );
}
