# 99Tech Code Challenge

A collection of coding problems and solutions demonstrating TypeScript proficiency, React development, and software architecture skills.

---

## 📋 Overview

| Problem | Title | Type | Stack |
|---------|-------|------|-------|
| [Problem 1](#problem-1-sum-to-n) | Sum to N | Algorithm | TypeScript |
| [Problem 2](#problem-2-currency-swap-form) | Currency Swap Form | Frontend | React, TypeScript, Tailwind |
| [Problem 3](#problem-3-code-review--refactoring) | Code Review & Refactoring | Analysis | TypeScript, React |

---

## Prerequisites

### Install Node.js

Download from [nodejs.org](https://nodejs.org/) (v18+ recommended)

```bash
node --version  # Verify installation
```

### Install pnpm (Package Manager)

```bash
# Using npm
npm install -g pnpm

# Or using Homebrew (macOS)
brew install pnpm

# Verify installation
pnpm --version
```

### Install Bun (Optional, for Problem 2)

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version
```

---

## 🚀 Quick Start

### Install all dependencies

```bash
pnpm install
```

### Run tests

```bash
# Run all tests
pnpm test

# Run specific problem tests
pnpm test:1   # Problem 1 tests
```

---

## Problem 1: Sum to N

**Task**: Provide 3 unique implementations of the sum function `sum_to_n(n)` that returns the sum of integers from 1 to n.

**Location**: `problem1/`

### Implementations

| Method | Approach | Time Complexity | Space Complexity |
|--------|----------|-----------------|------------------|
| `sum_to_n_a` | Mathematical formula | O(1) | O(1) |
| `sum_to_n_b` | Iterative (for loop) | O(n) | O(1) |
| `sum_to_n_c` | Recursive | O(n) | O(n) |

### Run

```bash
pnpm problem1      # Execute solution
pnpm test:1        # Run tests
```

### Code

```typescript
// Mathematical formula: n * (n + 1) / 2
function sum_to_n_a(n: number): number {
  return n * (n + 1) / 2;
}

// Iterative approach
function sum_to_n_b(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// Recursive approach
function sum_to_n_c(n: number): number {
  if (n === 0) return 0;
  return n + sum_to_n_c(n - 1);
}
```

---

## Problem 2: Currency Swap Form

**Task**: Build a fancy currency swap form with real-time exchange rates.

**Location**: `problem2/`

### Features

- 🔄 Token swap with real-time exchange rates
- 💰 Wallet balance display with USD conversion
- ✅ Form validation using React Hook Form + Yup
- 🎨 Beautiful UI with Tailwind CSS and animations
- 📊 Data from [Switcheo API](https://interview.switcheo.com/prices.json)

### Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Rsbuild | Build Tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Zustand | State Management |
| React Hook Form | Form Handling |
| Yup | Schema Validation |

### Run

```bash
cd problem2
pnpm install
pnpm dev          # Start dev server at http://localhost:3000
```

Or from root:

```bash
pnpm problem2        # Start dev server
pnpm problem2:build  # Build for production
pnpm problem2:serve  # Preview production build
```

### Preview

![Currency Swap Form](problem2/preview.png)

See [problem2/README.md](problem2/README.md) for detailed documentation.

---

## Problem 3: Code Review & Refactoring

**Task**: Analyze a React component for computational inefficiencies and anti-patterns, then provide a refactored version.

**Location**: `problem3/`

### Issues Identified

| Category | Issues Found |
|----------|--------------|
| **Type Safety** | Missing interface properties, `any` type usage |
| **Logic Errors** | Undefined variables, inverted filter logic, missing sort return |
| **Performance** | Functions recreated on render, wrong memoization deps |
| **Anti-Patterns** | Array index as key, unused destructured variables |

### Key Improvements

| Original | Refactored |
|----------|------------|
| `any` type | Proper `Blockchain` union type |
| Function inside component | Moved outside (constant) |
| Partial memoization | Complete with correct deps |
| Array index as key | Unique `currency` identifier |
| Multiple passes | Single chain: filter → sort → format |

See [problem3/README.md](problem3/README.md) for full analysis and refactored code.

---

## 📁 Project Structure

```
test-code-99techteam/
├── problem1/
│   ├── index.ts          # Sum implementations
│   └── index.test.ts     # Tests
├── problem2/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── store/        # Zustand store
│   │   └── App.tsx       # Main app
│   ├── public/icons/     # Token icons
│   └── README.md
├── problem3/
│   ├── code-sample.txt   # Original code
│   └── README.md         # Analysis & refactored code
├── package.json          # Root package config
├── pnpm-workspace.yaml   # pnpm workspace config
├── tsconfig.json         # TypeScript config
├── vitest.config.ts      # Test config
└── README.md             # This file
```

---

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) for testing.

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run specific problem tests
pnpm test:1
```

---

## 📝 License

This project is created for 99Tech code challenge assessment.

---

## Author

Submitted for 99Tech Team technical evaluation.
