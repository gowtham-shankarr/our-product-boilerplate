import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: process.env.NODE_ENV === "production",
  splitting: false,
  sourcemap: process.env.NODE_ENV === "production",
  clean: true,
  external: [
    "react",
    "react-dom",
    "@radix-ui/react-slot",
    "@radix-ui/react-separator",
    "@radix-ui/react-tooltip",
    "@radix-ui/react-collapsible",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-avatar",
    "@radix-ui/react-label",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lucide-react",
  ],
  esbuildOptions(options) {
    options.alias = {
      "@/lib/utils": "./src/lib/utils",
      "@/hooks/use-mobile": "./src/hooks/use-mobile",
      "@/components/ui/button": "./src/components/ui/button",
      "@/components/ui/input": "./src/components/ui/input",
      "@/components/ui/separator": "./src/components/ui/separator",
      "@/components/ui/sheet": "./src/components/ui/sheet",
      "@/components/ui/skeleton": "./src/components/ui/skeleton",
      "@/components/ui/tooltip": "./src/components/ui/tooltip",
      "@/components/ui/breadcrumb": "./src/components/ui/breadcrumb",
      "@/components/ui/collapsible": "./src/components/ui/collapsible",
      "@/components/ui/dropdown-menu": "./src/components/ui/dropdown-menu",
      "@/components/ui/avatar": "./src/components/ui/avatar",
      "@/components/ui/card": "./src/components/ui/card",
      "@/components/ui/label": "./src/components/ui/label",
      "@/components/login-form": "./src/components/login-form",
    };
  },
});
