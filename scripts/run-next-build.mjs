#!/usr/bin/env node

import { spawn } from "node:child_process";

const memoryLimitMb = process.env.NEXT_BUILD_MEMORY_MB?.trim() || "1024";
const existingNodeOptions = process.env.NODE_OPTIONS?.trim() || "";
const memoryFlag = `--max-old-space-size=${memoryLimitMb}`;
const nodeOptions = existingNodeOptions.includes("--max-old-space-size")
  ? existingNodeOptions
  : `${existingNodeOptions} ${memoryFlag}`.trim();

const child = spawn(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", "build"],
  {
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      NODE_OPTIONS: nodeOptions,
      NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED || "1",
    },
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

