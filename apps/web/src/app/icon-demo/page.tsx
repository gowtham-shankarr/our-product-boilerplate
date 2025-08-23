import { Icon, type IconName } from "@acmecorp/icons";

const lucideIcons: IconName[] = [
  "home",
  "user",
  "settings",
  "search",
  "mail",
  "bell",
  "heart",
  "star",
  "plus",
  "minus",
  "check",
  "x",
  "arrow-right",
  "arrow-left",
  "chevron-down",
  "chevron-up",
  "menu",
  "edit",
  "trash2",
  "download",
  "upload",
  "eye",
  "eye-off",
  "lock",
  "unlock",
  "calendar",
  "clock",
  "map-pin",
  "phone",
  "globe",
  "link",
  "external-link",
  "copy",
  "share",
  "more-horizontal",
  "more-vertical",
  "filter",
  "sort-asc",
  "sort-desc",
  "refresh-cw",
  "rotate-ccw",
  "zap",
  "shield",
  "alert-circle",
  "alert-triangle",
  "info",
  "help-circle",
  "check-circle",
  "x-circle",
  "minus-circle",
  "plus-circle",
];

const fontAwesomeIcons: IconName[] = [
  "github",
  "twitter",
  "linkedin",
  "facebook",
  "instagram",
  "youtube",
  "discord",
  "slack",
  "stack-overflow",
  "reddit",
];

const simpleIcons: IconName[] = [
  "typescript",
  "javascript",
  "react",
  "nextjs",
  "tailwindcss",
  "prisma",
  "postgresql",
  "vercel",
  "npm",
];

const customIcons: IconName[] = ["custom-logo"];

export default function IconDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Icon System Demo</h1>

      <div className="space-y-12">
        {/* Lucide Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Lucide Icons</h2>
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {lucideIcons.map((iconName) => (
              <div
                key={iconName}
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon name={iconName} size={24} className="mb-2" />
                <span className="text-xs text-gray-600 text-center">
                  {iconName}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FontAwesome Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">FontAwesome Icons</h2>
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {fontAwesomeIcons.map((iconName) => (
              <div
                key={iconName}
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon name={iconName} size={24} className="mb-2" />
                <span className="text-xs text-gray-600 text-center">
                  {iconName}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Simple Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Simple Icons</h2>
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {simpleIcons.map((iconName) => (
              <div
                key={iconName}
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon name={iconName} size={24} className="mb-2" />
                <span className="text-xs text-gray-600 text-center">
                  {iconName}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Custom Icons</h2>
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {customIcons.map((iconName) => (
              <div
                key={iconName}
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon name={iconName} size={24} className="mb-2" />
                <span className="text-xs text-gray-600 text-center">
                  {iconName}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Icon name="home" size={20} className="text-blue-500" />
              <span>Home icon with custom color</span>
            </div>
            <div className="flex items-center space-x-4">
              <Icon name="user" size={32} className="text-green-500" />
              <span>User icon with larger size</span>
            </div>
            <div className="flex items-center space-x-4">
              <Icon
                name="settings"
                size={24}
                className="text-gray-600 hover:text-blue-500 cursor-pointer transition-colors"
              />
              <span>Settings icon with hover effect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Icon
                name="github"
                size={28}
                className="text-gray-800"
                aria-label="GitHub"
              />
              <span>GitHub icon with accessibility label</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
