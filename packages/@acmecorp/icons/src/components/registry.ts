import * as React from "react";
import {
  Home,
  User,
  Users,
  Settings,
  Search,
  Mail,
  Bell,
  Heart,
  Star,
  Plus,
  Minus,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Menu,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Globe,
  Link,
  ExternalLink,
  Copy,
  Share,
  MoreHorizontal,
  MoreVertical,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  RotateCcw,
  Zap,
  Shield,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  CheckCircle,
  XCircle,
  MinusCircle,
  PlusCircle,
  Activity,
  CreditCard,
  TrendingUp,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Terminal,
  Folder,
  Forward,
  ChevronsUpDown,
  BadgeCheck,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaDiscord,
  FaSlack,
  FaStackOverflow,
  FaReddit,
} from "react-icons/fa";

import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiPrisma,
  SiPostgresql,
  SiVercel,
  SiNpm,
} from "react-icons/si";

// Import custom SVG icons
import { CustomLogo } from "./custom/CustomLogo";

// Define icon names as a union type for type safety
export type IconName =
  // Lucide icons
  | "home"
  | "user"
  | "users"
  | "settings"
  | "search"
  | "mail"
  | "bell"
  | "heart"
  | "star"
  | "plus"
  | "minus"
  | "check"
  | "x"
  | "arrow-right"
  | "arrow-left"
  | "chevron-down"
  | "chevron-up"
  | "chevron-right"
  | "menu"
  | "edit"
  | "trash2"
  | "download"
  | "upload"
  | "eye"
  | "eye-off"
  | "lock"
  | "unlock"
  | "calendar"
  | "clock"
  | "map-pin"
  | "phone"
  | "globe"
  | "link"
  | "external-link"
  | "copy"
  | "share"
  | "more-horizontal"
  | "more-vertical"
  | "filter"
  | "sort-asc"
  | "sort-desc"
  | "refresh-cw"
  | "rotate-ccw"
  | "zap"
  | "shield"
  | "alert-circle"
  | "alert-triangle"
  | "info"
  | "help-circle"
  | "check-circle"
  | "x-circle"
  | "minus-circle"
  | "plus-circle"
  | "activity"
  | "credit-card"
  | "trending-up"
  | "audio-waveform"
  | "book-open"
  | "bot"
  | "command"
  | "frame"
  | "gallery-vertical-end"
  | "map"
  | "pie-chart"
  | "settings2"
  | "terminal"
  | "folder"
  | "forward"
  | "chevrons-up-down"
  | "badge-check"
  | "log-out"
  | "sparkles"
  // FontAwesome icons
  | "github"
  | "twitter"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "youtube"
  | "discord"
  | "slack"
  | "stack-overflow"
  | "reddit"
  // Simple Icons
  | "typescript"
  | "javascript"
  | "react"
  | "nextjs"
  | "tailwindcss"
  | "prisma"
  | "postgresql"
  | "vercel"
  | "npm"
  // Custom icons
  | "custom-logo";

// Map icon names to their components
export const iconRegistry: Record<IconName, React.ComponentType<any>> = {
  // Lucide icons
  home: Home,
  user: User,
  users: Users,
  settings: Settings,
  search: Search,
  mail: Mail,
  bell: Bell,
  heart: Heart,
  star: Star,
  plus: Plus,
  minus: Minus,
  check: Check,
  x: X,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  "chevron-right": ChevronRight,
  menu: Menu,
  edit: Edit,
  trash2: Trash2,
  download: Download,
  upload: Upload,
  eye: Eye,
  "eye-off": EyeOff,
  lock: Lock,
  unlock: Unlock,
  calendar: Calendar,
  clock: Clock,
  "map-pin": MapPin,
  phone: Phone,
  globe: Globe,
  link: Link,
  "external-link": ExternalLink,
  copy: Copy,
  share: Share,
  "more-horizontal": MoreHorizontal,
  "more-vertical": MoreVertical,
  filter: Filter,
  "sort-asc": SortAsc,
  "sort-desc": SortDesc,
  "refresh-cw": RefreshCw,
  "rotate-ccw": RotateCcw,
  zap: Zap,
  shield: Shield,
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  info: Info,
  "help-circle": HelpCircle,
  "check-circle": CheckCircle,
  "x-circle": XCircle,
  "minus-circle": MinusCircle,
  "plus-circle": PlusCircle,
  activity: Activity,
  "credit-card": CreditCard,
  "trending-up": TrendingUp,
  "audio-waveform": AudioWaveform,
  "book-open": BookOpen,
  bot: Bot,
  command: Command,
  frame: Frame,
  "gallery-vertical-end": GalleryVerticalEnd,
  map: Map,
  "pie-chart": PieChart,
  settings2: Settings2,
  terminal: Terminal,
  folder: Folder,
  forward: Forward,
  "chevrons-up-down": ChevronsUpDown,
  "badge-check": BadgeCheck,
  "log-out": LogOut,
  sparkles: Sparkles,
  // FontAwesome icons
  github: FaGithub,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
  discord: FaDiscord,
  slack: FaSlack,
  "stack-overflow": FaStackOverflow,
  reddit: FaReddit,
  // Simple Icons
  typescript: SiTypescript,
  javascript: SiJavascript,
  react: SiReact,
  nextjs: SiNextdotjs,
  tailwindcss: SiTailwindcss,
  prisma: SiPrisma,
  postgresql: SiPostgresql,
  vercel: SiVercel,
  npm: SiNpm,
  // Custom icons
  "custom-logo": CustomLogo,
};
