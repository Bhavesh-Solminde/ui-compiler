import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import archiver from "archiver";
import type { DesignSystemTokens } from "@resumer/shared-types";
import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { modifyButtonAst } from "./compiler.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const compileDesignSystem = asyncHandler(async (req, res) => {
  const tokens = req.body as DesignSystemTokens;

  // Validate tokens
  if (typeof tokens.radius !== "number" || !Number.isFinite(tokens.radius)) {
    throw new AppError("Invalid radius: must be a finite number", 400);
  }

  if (tokens.radius < 0 || tokens.radius > 4) {
    throw new AppError("Invalid radius: must be between 0 and 4", 400);
  }

  if (typeof tokens.primaryColor !== "string" || tokens.primaryColor.trim() === "") {
    throw new AppError("Invalid primaryColor: must be a non-empty string", 400);
  }

  // Read the base button component
  const basePath = path.resolve(__dirname, "base", "button.tsx");
  let baseSource: string;

  try {
    baseSource = await fs.readFile(basePath, "utf-8");
  } catch {
    throw new AppError("Base button component not found", 500);
  }

  // Run AST modification
  const modifiedSource = modifyButtonAst(baseSource, tokens);

  // Create ZIP archive in memory and stream response
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="custom-ui.zip"'
  );

  const archive = archiver("zip", { zlib: { level: 6 } });

  archive.on("error", (err) => {
    throw new AppError(`Archive error: ${err.message}`, 500);
  });

  archive.pipe(res);

  // Append mutated button component
  archive.append(modifiedSource, { name: "components/ui/button.tsx" });

  await archive.finalize();
});
