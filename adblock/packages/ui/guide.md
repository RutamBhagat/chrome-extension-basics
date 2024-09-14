# Guide for Adding shadcn to a Turbo Monorepo

Follow these steps to set up shadcn in your Turbo monorepo:

## 1. Create `components.json` in packages/ui

Create a file named `components.json` in the `packages/ui` directory with the following content:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "lib/global.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/lib/components",
    "utils": "@/lib/utils",
    "ui": "@/lib/components/ui",
    "lib": "@/lib"
  }
}
```

## 2. Create `tailwind.config.ts` in packages/ui

Create a file named `tailwind.config.ts` in the `packages/ui` directory with the following content:

```typescript
import baseConfig from '@extension/tailwindcss-config';
export default baseConfig;
```

## 3. Update `tsconfig.json` in packages/ui

Add the following configuration to the `tsconfig.json` file in the `packages/ui` directory:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 4. Update `package.json` in packages/ui

Add the following dependencies to the `package.json` file in the `packages/ui` directory:

```json
{
  "devDependencies": {
    "@extension/tailwindcss-config": "workspace:*",
    "@extension/vite-config": "workspace:*",
    "@extension/hmr": "workspace:*"
  }
}
```

## 5. Install dependencies

Run the following command from the root of your project:

```bash
pnpm install
```

## 6. Add shadcn components

Finally, run this command from the root of your project to add the button component:

```bash
pnpm dlx shadcn@latest add button -c ./packages/ui
```

This will add the shadcn button component to your UI package.

Remember to adjust any paths or package names if your project structure differs from the assumed layout in this guide.