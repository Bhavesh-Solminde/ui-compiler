import { Project, SyntaxKind } from "ts-morph";
import type { DesignSystemTokens } from "@resumer/shared-types";
import { AppError } from "../../utils/AppError.js";

export function modifyButtonAst(
  sourceCode: string,
  tokens: DesignSystemTokens
): string {
  const project = new Project({ useInMemoryFileSystem: true });

  const sourceFile = project.createSourceFile("button.tsx", sourceCode);

  // Find the cva() call expression
  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  );

  const cvaCall = callExpressions.find(
    (call) => call.getExpression().getText() === "cva"
  );

  if (!cvaCall) {
    throw new AppError("CVA definition not found in button component", 500);
  }

  const args = cvaCall.getArguments();
  if (args.length === 0) {
    throw new AppError("CVA call has no arguments", 500);
  }

  const firstArg = args[0];

  // The first argument should be a string literal (base classes)
  if (firstArg.getKind() !== SyntaxKind.StringLiteral) {
    throw new AppError(
      "CVA first argument is not a string literal",
      500
    );
  }

  const stringLiteral = firstArg.asKindOrThrow(SyntaxKind.StringLiteral);
  const currentValue = stringLiteral.getLiteralValue();

  // Split into classes array
  const classes = currentValue.split(/\s+/).filter(Boolean);

  // Remove existing rounded-* classes
  const filteredClasses = classes.filter(
    (cls) => !cls.startsWith("rounded-")
  );

  // Append new rounded class with token value
  filteredClasses.push(`rounded-[${tokens.radius}rem]`);

  // Set the new value via AST
  stringLiteral.setLiteralValue(filteredClasses.join(" "));

  return sourceFile.getFullText();
}
