// Re-export utilities
export { cn } from "./lib/utils";

// Re-export hooks
export { useIsMobile } from "./hooks/use-mobile";

// Re-export components
export { Button, buttonVariants } from "./components/ui/button";
export type { ButtonProps } from "./components/ui/button";

// Sidebar components
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./components/ui/sidebar";

// Other UI components
export { Separator } from "./components/ui/separator";
export {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
export { Skeleton } from "./components/ui/skeleton";
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
export { Input } from "./components/ui/input";
export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
export {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./components/ui/collapsible";
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
export { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
export { Label } from "./components/ui/label";

// Form components - moved to web app

// Theme provider placeholder
export const ThemeProvider = ({ children }: { children: any }) => {
  return children;
};
