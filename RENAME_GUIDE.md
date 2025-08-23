# 🚀 Package Rename Guide

This guide shows you how to easily rename all `@acmecorp` packages to your own product name in **one command**.

## 🎯 Quick Start

### Option 1: Using npm script (Recommended)

```bash
# Rename to @myapp
pnpm rename @myapp

# Rename to @mycompany
pnpm rename @mycompany

# Rename to @product
pnpm rename @product
```

### Option 2: Direct script execution

```bash
# Rename to @myapp
node scripts/rename-packages.js @myapp
```

## 📋 What Gets Renamed

The script will automatically update:

### 1. **Package Names** (in all `package.json` files)

- `@acmecorp/config` → `@myapp/config`
- `@acmecorp/ui` → `@myapp/ui`
- `@acmecorp/db` → `@myapp/db`
- `@acmecorp/env` → `@myapp/env`
- `@acmecorp/auth` → `@myapp/auth`
- `@acmecorp/users` → `@myapp/users`
- `@acmecorp/orgs` → `@myapp/orgs`
- `@acmecorp/router` → `@myapp/router`
- `@acmecorp/api` → `@myapp/api`
- `@acmecorp/icons` → `@myapp/icons`
- `@acmecorp/email` → `@myapp/email`
- `@acmecorp/payments` → `@myapp/payments`

### 2. **Directory Structure**

```
packages/@acmecorpcorp/ → packages/@myapp/
```

### 3. **Import Statements** (in all files)

```typescript
// Before
import { Button } from "@acmecorp/ui";
import { db } from "@acmecorp/db";

// After
import { Button } from "@myapp/ui";
import { db } from "@myapp/db";
```

### 4. **Configuration Files**

- `next.config.js` (webpack aliases)
- `pnpm-workspace.yaml`
- `turbo.json`
- All TypeScript configs
- All package.json dependencies

### 5. **Documentation**

- README.md
- All markdown files
- Comments in code

## 🔄 Complete Workflow

### Step 1: Rename Packages

```bash
# Choose your package name (must start with @)
pnpm rename @myapp
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Build Everything

```bash
pnpm build
```

### Step 4: Start Development

```bash
pnpm dev
```

## ✅ Verification

After renaming, verify everything works:

1. **Check package names**:

   ```bash
   ls packages/@myapp/
   ```

2. **Test imports**:

   ```bash
   # Should work without errors
   pnpm typecheck
   ```

3. **Test development**:

   ```bash
   # Should start both apps
   pnpm dev
   ```

4. **Check URLs**:
   - Main app: http://localhost:3000
   - Admin app: http://localhost:3001

## 🎨 Examples

### Example 1: Company Name

```bash
pnpm rename @acmecorpcompany
# Results in: @acmecorpcompany/ui, @acmecorpcompany/db, etc.
```

### Example 2: Product Name

```bash
pnpm rename @myproduct
# Results in: @myproduct/ui, @myproduct/db, etc.
```

### Example 3: Brand Name

```bash
pnpm rename @mybrand
# Results in: @mybrand/ui, @mybrand/db, etc.
```

## ⚠️ Important Notes

### Package Name Requirements

- **Must start with `@`** (e.g., `@myapp`, not `myapp`)
- **Use lowercase** (recommended)
- **No spaces or special characters** (except hyphens)

### After Renaming

1. **Restart your development server** if it's running
2. **Clear any caches** if you encounter issues:
   ```bash
   pnpm clean
   rm -rf node_modules
   pnpm install
   ```

### Git Considerations

- The rename script modifies many files
- Consider committing your changes before renaming
- The script preserves your code, only changing package names

## 🛠️ Troubleshooting

### Issue: "Package not found" errors

```bash
# Solution: Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Issue: TypeScript errors

```bash
# Solution: Rebuild everything
pnpm clean
pnpm build
```

### Issue: Next.js can't find packages

```bash
# Solution: Restart development server
pnpm dev
```

## 🎯 Best Practices

1. **Choose a meaningful name**: Pick something that represents your product/company
2. **Use consistent naming**: Keep the same pattern across all packages
3. **Test thoroughly**: Always verify imports and builds work after renaming
4. **Document your choice**: Update your project documentation with the new package names

## 📚 Advanced Usage

### Custom Package Names

You can also rename individual packages manually if needed:

```bash
# Rename just the UI package
cd packages/@acmecorpcorp/ui
# Edit package.json to change name
```

### Batch Renaming Multiple Projects

If you have multiple copies of this boilerplate:

```bash
# Create a script to rename all projects
for project in project1 project2 project3; do
  cd $project
  pnpm rename @myapp
  cd ..
done
```

---

**🎉 That's it! Your monorepo is now customized with your own package names!**
