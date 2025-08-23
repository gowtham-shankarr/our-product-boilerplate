#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the new package name from command line argument
const newPackageName = process.argv[2];

if (!newPackageName) {
  console.error("❌ Please provide a new package name!");
  console.log("Usage: node scripts/rename-packages.js <new-package-name>");
  console.log("Example: node scripts/rename-packages.js @myapp");
  process.exit(1);
}

// Validate package name format
if (!newPackageName.startsWith("@")) {
  console.error("❌ Package name must start with @ (e.g., @myapp)");
  process.exit(1);
}

const oldPackageName = "@acmecorp";
const oldPackageDir = "packages/@acmecorpcorp";
const newPackageDir = `packages/${newPackageName}`;

console.log(
  `🚀 Renaming packages from ${oldPackageName} to ${newPackageName}...`
);

// Function to recursively find all files
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // Skip node_modules and dist directories
      if (!["node_modules", "dist", ".next", ".git"].includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      // Only process specific file types
      const ext = path.extname(file);
      if (
        [
          ".js",
          ".ts",
          ".tsx",
          ".jsx",
          ".json",
          ".yaml",
          ".yml",
          ".md",
          ".prisma",
        ].includes(ext)
      ) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Function to replace content in a file
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Replace @acmecorp with new package name
    if (content.includes(oldPackageName)) {
      content = content.replace(
        new RegExp(oldPackageName.replace("@", "\\@"), "g"),
        newPackageName
      );
      modified = true;
    }

    // Replace directory paths
    if (content.includes(oldPackageDir)) {
      content = content.replace(
        new RegExp(oldPackageDir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        newPackageDir
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Function to rename directories
function renameDirectories() {
  try {
    // Rename the packages directory
    if (fs.existsSync(oldPackageDir)) {
      fs.renameSync(oldPackageDir, newPackageDir);
      console.log(`✅ Renamed directory: ${oldPackageDir} → ${newPackageDir}`);
    }

    // Rename individual package directories
    const packages = [
      "config",
      "env",
      "db",
      "api",
      "auth",
      "users",
      "orgs",
      "router",
      "ui",
      "icons",
      "email",
      "payments",
    ];

    packages.forEach((pkg) => {
      const oldPath = path.join(newPackageDir, pkg);
      const newPath = path.join(newPackageDir, pkg);

      if (fs.existsSync(oldPath)) {
        // Update package.json name in each package
        const packageJsonPath = path.join(oldPath, "package.json");
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, "utf8")
          );
          packageJson.name = `${newPackageName}/${pkg}`;

          // Update dependencies
          if (packageJson.dependencies) {
            Object.keys(packageJson.dependencies).forEach((dep) => {
              if (dep.startsWith(oldPackageName)) {
                const newDep = dep.replace(oldPackageName, newPackageName);
                packageJson.dependencies[newDep] =
                  packageJson.dependencies[dep];
                delete packageJson.dependencies[dep];
              }
            });
          }

          fs.writeFileSync(
            packageJsonPath,
            JSON.stringify(packageJson, null, 2)
          );
          console.log(`✅ Updated package.json: ${packageJsonPath}`);
        }
      }
    });
  } catch (error) {
    console.error("❌ Error renaming directories:", error.message);
  }
}

// Main execution
try {
  console.log("📁 Scanning files...");
  const allFiles = getAllFiles(".");

  console.log(`📝 Processing ${allFiles.length} files...`);

  // Process all files
  allFiles.forEach(replaceInFile);

  // Rename directories
  renameDirectories();

  console.log("\n🎉 Package rename completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Run: pnpm install");
  console.log("2. Run: pnpm build");
  console.log("3. Run: pnpm dev");
  console.log("\n⚠️  Note: You may need to restart your development server");
} catch (error) {
  console.error("❌ Error during rename process:", error.message);
  process.exit(1);
}
