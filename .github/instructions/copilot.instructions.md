# 🤖 Project Instructions — AI Development Rules

You are an expert AI developer working on a **TypeScript monorepo resume platform**.
The system consists of a **React + Vite frontend** and a **Node.js + Express backend**, with shared types across packages.

Produce **rigorous, production-grade, architecture-first solutions**.
Focus on maintainability, strict typing, modular design, and predictable execution.

---

# 0. Core Architectural Principles (MANDATORY)

### Rule #1: Strict Monorepo Separation

Respect the boundaries between packages:

1. **Frontend (`/frontend`)**
   React 18 + Vite application responsible for UI, routing, and client state.

2. **Backend (`/backend`)**
   Express API responsible for authentication, resume generation, and analysis.

3. **Shared Types (`/packages/shared-types`)**
   Centralized TypeScript type definitions shared between frontend and backend.

The frontend must **never duplicate backend interfaces**. Always import shared types.

---

# 1. Repository Structure

Follow this directory layout strictly.

```
resumer/
├── frontend/                 # React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── components/       # UI components (Shadcn + Aceternity)
│   │   │   ├── ui/           # Base UI primitives
│   │   │   ├── analyze/      # Analysis feature components
│   │   │   ├── builder/      # Resume builder components
│   │   │   └── profile/      # User profile components
│   │   ├── pages/            # Route pages
│   │   ├── store/            # Zustand state management
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utilities & axios instance
│   └── ...
│
├── backend/                  # Express + TypeScript (ES Modules)
│   ├── src/
│   │   ├── modules/          # Feature-based architecture
│   │   ├── passport/         # OAuth strategies
│   │   ├── utils/            # Async handlers, error classes
│   │   └── lib/              # DB connection & Cloudinary setup
│   └── ...
│
├── packages/
│   └── shared-types/         # Shared TypeScript types
│
└── pnpm-workspace.yaml       # Monorepo configuration
```

---

# 2. Package Management

The project uses **npm-based workspace tooling**.

Rules:

* Use **npm workspaces** for dependency management.
* Shared packages must be referenced via workspace aliases.

Example import:

```ts
import { UserProfile } from "@resumer/shared-types";
```

Do not duplicate shared interfaces across services.

---

# 3. 🚫 Critical Tech Restrictions

### Language

* **TypeScript ONLY**
* Strict Mode enabled
* Must use `interface` or `type` for all objects.

Never use `any`.

---

### Module System

Use **ES Modules everywhere**.

Correct:

```ts
import express from "express";
```

Forbidden:

```ts
const express = require("express");
```

---

### Backend Import Rules

Local imports **must include `.js` extension**.

Example:

```ts
import ENV from "../env.js";
import { AppError } from "../utils/AppError.js";
```

This ensures compatibility with compiled ES modules.

---

### Framework Rules

Frontend must use:

* **Vite**
* **React 18**
* **React Router**

❌ Forbidden:

```
next/*
```

Never import from Next.js.

---

### Routing

Use React Router hooks only.

Examples:

```ts
useNavigate()
useParams()
useLocation()
```

---

# 4. 🎨 Frontend Architecture (React + Vite)

### UI System

Use **Tailwind CSS v4** for styling.

Utility class merging must use:

```ts
cn()
```

Implementation:

```
clsx + tailwind-merge
```

---

### Component System

UI is divided into layers.

#### Base UI

```
@/components/ui
```

Contains Shadcn primitives.

Examples:

* Button
* Input
* Dialog
* Sheet
* Tabs

---

#### Feature Components

```
@/components/analyze
@/components/builder
@/components/profile
```

Feature components orchestrate UI primitives and business logic.

---

### Layout Components

Complex animated layouts may use **Aceternity UI** components.

These should remain composable and reusable.

---

### State Management

Global state uses **Zustand**.

Undo / redo functionality uses **Zundo** temporal middleware.

Example store pattern:

```ts
const useBuilderStore = create(
  temporal((set) => ({
    resumeData: {},
    updateField: (key, value) =>
      set((state) => ({
        resumeData: { ...state.resumeData, [key]: value }
      }))
  }))
);
```

---

### API Communication

Frontend must use the **axios instance** defined in:

```
@/lib/axios
```

Rules:

* `withCredentials: true`
* Centralized interceptors
* No raw `fetch()` calls.

Example:

```ts
import axiosInstance from "@/lib/axios";

await axiosInstance.post("/auth/login", data);
```

---

### Shared Types

Always import types from the shared package.

Correct:

```ts
import { Resume } from "@resumer/shared-types";
```

Incorrect:

```ts
interface Resume { ... }
```

---

# 5. ⚙️ Backend Architecture (Node + Express)

Backend follows **feature-based modular architecture**.

Structure:

```
modules/
  auth/
  resume/
  analyze/
```

Each module contains:

```
controller.ts
service.ts
model.ts
routes.ts
```

Controllers must remain thin and delegate business logic to services.

---

# 6. Controller Rules (MANDATORY)

All controllers must be wrapped using `asyncHandler`.

Example:

```ts
import asyncHandler from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {

    const body: RegisterBody = req.body;

    // business logic here

    res.status(201).json({
      success: true
    });
  }
);
```

Never use raw async controllers without this wrapper.

---

# 7. Error Handling System

Backend must use **class-based error handling**.

Example base class:

```ts
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

Usage example:

```ts
throw new AppError("User already exists", 400);
```

Centralized error middleware must handle all thrown errors.

---

# 8. Validation Strategy

Current validation approach:

* **Manual validation**
* Interfaces + Regex checks

Example:

```ts
if (!emailRegex.test(email)) {
  throw new AppError("Invalid email", 400);
}
```

Future goal:

Migrate validation into shared schemas within `@resumer/shared-types`.

---

# 9. Database Layer

Database uses **MongoDB + Mongoose**.

Rules:

* Every Schema must have a matching TypeScript Interface.
* Interfaces must represent the exact schema shape.

Example:

```ts
interface User {
  email: string;
  password: string;
}
```

Schema:

```ts
const UserSchema = new Schema<User>({
  email: String,
  password: String
});
```

---

# 10. Environment Configuration

Environment variables must be accessed via a central `ENV` object.

Correct:

```ts
import ENV from "../env.js";

const dbUrl = ENV.MONGO_URI;
```

Forbidden:

```
process.env inside services/controllers
```

---

# 11. Authentication

Authentication handled using **Passport.js strategies**.

Location:

```
backend/src/passport/
```

Possible strategies:

* Google OAuth
* GitHub OAuth
* Local auth

Sessions and cookies must support `withCredentials`.

---

# 12. Editing Strategy

### Root Cause Policy

Do not patch symptoms.

If a bug occurs:

1. Identify the architectural layer responsible.
2. Fix the source logic.

Never add fragile workarounds.

---

### Minimal Changes

Implement the smallest change that solves the issue.

Avoid refactoring unrelated modules unless explicitly required.

---

# 13. Code Quality Requirements

All code must satisfy:

* Strict TypeScript typing
* Modular architecture
* Clear separation of concerns
* Predictable execution paths
* Reusable components

Avoid:

* Large controllers
* Business logic inside routes
* Duplicate types
* Implicit typing
* Side effects inside components

---

# 14. Expected Output Format for AI Tasks

When implementing features or fixes, responses should follow:

### 1. Plan

Brief description of architectural flow.

### 2. Implementation

Exact TypeScript code.

### 3. Verification

How the feature or fix should be tested.

---
