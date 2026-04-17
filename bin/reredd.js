#!/usr/bin/env node
"use strict";

const { execFileSync } = require("child_process");
const { join } = require("path");

const PLATFORMS = {
  "darwin-arm64": "reredd-darwin-arm64",
  "darwin-x64":   "reredd-darwin-x64",
  "linux-x64":    "reredd-linux-x64",
  "win32-x64":    "reredd-windows-x64",
};

const key = `${process.platform}-${process.arch}`;
const pkgName = PLATFORMS[key];

if (!pkgName) {
  console.error(`reredd: unsupported platform: ${key}`);
  process.exit(1);
}

let binPath;
try {
  const isWindows = process.platform === "win32";
  const binaryName = isWindows ? "reredd.exe" : "reredd";
  
  try {
    // 1. Try standard installation path (node_modules)
    binPath = require.resolve(`${pkgName}/${binaryName}`);
  } catch {
    // 2. Fallback for local development: check sibling directories in packages/
    binPath = join(__dirname, "..", "..", pkgName, binaryName);
    const fs = require("fs");
    if (!fs.existsSync(binPath)) {
      throw new Error("Binary not found");
    }
  }
} catch {
  console.error(
    `reredd: could not find binary for ${key}. \n` +
    `Tried looking in node_modules and sibling packages.\n` +
    `Try reinstalling: npm install -g reredd`
  );
  process.exit(1);
}

try {
  execFileSync(binPath, process.argv.slice(2), { stdio: "inherit" });
} catch (e) {
  process.exit(e.status || 1);
}
