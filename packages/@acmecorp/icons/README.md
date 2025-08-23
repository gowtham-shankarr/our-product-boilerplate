# @acmecorp/icons

A centralized icon system for the SaaS Toolkit that supports Lucide, React Icons, and custom SVG icons.

## Features

- **Unified API**: Single `<Icon />` component for all icon types
- **Type Safety**: TypeScript support with autocomplete for icon names
- **Multiple Sources**: Lucide, React Icons (FontAwesome, Simple Icons), and custom SVG
- **Tree Shaking**: Only imports the icons you use
- **Accessibility**: Built-in ARIA support
- **Customizable**: Size, color, and styling through props

## Usage

### Basic Usage

```tsx
import { Icon } from "@acmecorp/icons";

// Lucide icon
<Icon name="home" size={24} />

// FontAwesome icon
<Icon name="github" size={20} className="text-gray-800" />

// Simple Icons
<Icon name="typescript" size={28} />

// Custom icon
<Icon name="custom-logo" size={32} />
```

### With Accessibility

```tsx
<Icon
  name="settings"
  size={24}
  aria-label="Settings"
  className="hover:text-blue-500 cursor-pointer"
/>
```

### Direct Icon Imports

You can also import icons directly for better tree-shaking:

```tsx
import { Home, User, Settings } from "@acmecorp/icons";

<Home size={24} className="text-blue-500" />
<User size={20} />
<Settings size={28} />
```

## Available Icons

### Lucide Icons (Default)

- `home`, `user`, `settings`, `search`, `mail`, `bell`
- `heart`, `star`, `plus`, `minus`, `check`, `x`
- `arrow-right`, `arrow-left`, `chevron-down`, `chevron-up`
- `menu`, `edit`, `trash2`, `download`, `upload`
- `eye`, `eye-off`, `lock`, `unlock`, `calendar`, `clock`
- `map-pin`, `phone`, `globe`, `link`, `external-link`
- `copy`, `share`, `more-horizontal`, `more-vertical`
- `filter`, `sort-asc`, `sort-desc`, `refresh-cw`, `rotate-ccw`
- `zap`, `shield`, `alert-circle`, `alert-triangle`
- `info`, `help-circle`, `check-circle`, `x-circle`
- `minus-circle`, `plus-circle`

### FontAwesome Icons

- `github`, `twitter`, `linkedin`, `facebook`, `instagram`
- `youtube`, `discord`, `slack`, `stack-overflow`, `reddit`

### Simple Icons

- `typescript`, `javascript`, `react`, `nextjs`, `tailwindcss`
- `prisma`, `postgresql`, `vercel`, `npm`

### Custom Icons

- `custom-logo` (example custom SVG)

## Adding New Icons

### Adding Lucide Icons

1. Import the icon in `src/components/registry.ts`:

```tsx
import { NewIcon } from "lucide-react";
```

2. Add to the `IconName` type:

```tsx
export type IconName =
  // ... existing icons
  "new-icon";
```

3. Add to the registry:

```tsx
export const iconRegistry = {
  // ... existing icons
  "new-icon": NewIcon,
};
```

### Adding React Icons

1. Import from the appropriate package in `src/components/registry.ts`:

```tsx
import { FaNewIcon } from "react-icons/fa"; // FontAwesome
import { SiNewIcon } from "react-icons/si"; // Simple Icons
```

2. Add to the `IconName` type and registry as above.

### Adding Custom SVG Icons

1. Create your SVG component in `src/components/custom/`:

```tsx
// src/components/custom/MyCustomIcon.tsx
import React from "react";

interface MyCustomIconProps {
  size?: number | string;
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const MyCustomIcon: React.FC<MyCustomIconProps> = ({
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
      {/* Your SVG paths here */}
    </svg>
  );
};
```

2. Import and add to registry:

```tsx
import { MyCustomIcon } from "./custom/MyCustomIcon";

export type IconName =
  // ... existing icons
  "my-custom-icon";

export const iconRegistry = {
  // ... existing icons
  "my-custom-icon": MyCustomIcon,
};
```

## Props

### Icon Component Props

| Prop          | Type               | Default | Description                     |
| ------------- | ------------------ | ------- | ------------------------------- |
| `name`        | `IconName`         | -       | The name of the icon (required) |
| `size`        | `number \| string` | `24`    | Size of the icon                |
| `className`   | `string`           | `""`    | CSS classes to apply            |
| `aria-label`  | `string`           | -       | Accessibility label             |
| `aria-hidden` | `boolean`          | `false` | Hide from screen readers        |
| `onClick`     | `() => void`       | -       | Click handler                   |
| `style`       | `CSSProperties`    | -       | Inline styles                   |

## Demo

Visit `/icon-demo` in your web app to see all available icons in action.

## Best Practices

1. **Use the Icon component** for consistent styling and behavior
2. **Import directly** for better tree-shaking when using many icons
3. **Provide aria-label** for icons that convey meaning
4. **Use semantic icon names** that describe the action or content
5. **Keep custom icons simple** and consistent with the design system
