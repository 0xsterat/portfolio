import fs from "node:fs";
import path from "node:path";

/** Shared JSON file reader for data-slice loaders (Metrics, Projects, Newsletter Issues). */
export function readJson<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), "src", relativePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}
