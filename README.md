# React + Vite

## Week 10 authentication app

Run the frontend and API in separate terminals:

```bash
npm run dev
```

The app starts at `http://localhost:5173`; set `VITE_API_URL` in `.env` when the API is hosted elsewhere. The app restores the HTTP-only JWT session through `/api/me`, redirects signed-out visitors to `/login`, and sends credentials with every API request.

After admin login, the navigation exposes **Users** and **Audit log**. Every signed-in user can open **Change password**. Item requests use the assignment URL `/api/item` and remain protected by the backend.

For the assignment's Vercel deployment, import this repository as a Vite project, set the `VITE_API_URL` environment variable to the deployed API URL, and use `npm run build` as the build command with `dist` as the output directory. `vercel.json` keeps React Router routes working on direct refreshes. The API itself must be deployed separately as a Vercel Next.js project.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
