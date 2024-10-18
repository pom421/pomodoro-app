# Pomodo timer with Claude sonnet 3.5

Pomodoro in Vite React-ts, with shadcn/tailwind. Generated by Claude.ai.

<img width="1709" alt="image" src="https://github.com/user-attachments/assets/93acb9da-2b66-4e45-8cd7-3a0a7d46a208">

Prompt : https://claude.site/artifacts/ba7e380f-c812-415b-9852-3197c88994eb

<details>
  <summary>Commands to install vite, tailwind and shadcn</summary>

  <p>

    ```shell
    yarn create vite pomodoro-app --template react-ts
    yarn install -D tailwindcss postcss autoprefixer @types/node
    npx tailwindcss init -p
    ```

    Edit tsconfig.json :

    ```json
    {
      "files": [],
      "references": [
        {
          "path": "./tsconfig.app.json"
        },
        {
          "path": "./tsconfig.node.json"
        }
      ],
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          "@/*": ["./src/*"]
        }
      }
    }
    ```

    Edit tsconfig.app.json file

    ```json
    {
      "compilerOptions": {
        // ...
        "baseUrl": ".",
        "paths": {
          "@/*": ["./src/*"]
        },
        // ...
      }
    }
    ```

    Edit vite.config.ts

    ```ts
    import path from "path";
    import react from "@vitejs/plugin-react";
    import { defineConfig } from "vite";

    export default defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      base: "/pomodoro-app/", // needed for deployment on GitHub pages
    });
    ```

    Edit tailwind.config.js

    ```js
    /** @type {import('tailwindcss').Config} */
    export default {
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
      theme: {
        extend: {},
      },
      plugins: [],
    };
    ```

    Edit index.css

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

    npx shadcn@latest init

    Answer to shadcn prompt :

    ```shell
    Which style would you like to use? › New York
    Which color would you like to use as base color? › Zinc
    Do you want to use CSS variables for colors? › no / yes
    ```

    npx shadcn@latest add card
    npx shadcn@latest add input
    npx shadcn@latest add label
    npx shadcn@latest add button
    npx shadcn@latest add checkbox

  </p>

</details>

<details>
  <summary>Deploying to GitHub pages</summary>

  <p>see https://vite.dev/guide/static-deploy#github-pages.</p>
  
  <p>Previously, I have used this repo, [vite-deploy](https://github.com/ErickKS/vite-deploy) but it has error in .yml and there is a 404 error. On the README, it forwards to a video which make a redirect which is not a robust solution.</p>

  The solution is 

  - to use the commands on the vite documentation (see up). 
  - to rewrite the .yml to use yarn instead of npm
  - to go to GitHub settings > Environments > github-pages > and changing the allowed branch (it was github-pages, it should be main) ([ref](https://github.com/orgs/community/discussions/39054))
</details>

## Build

```shell
yarn install
yarn preview # local
# or
npx http-server dist/
```

## Run

```shell
yarn dev
```


