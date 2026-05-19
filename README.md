# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Backend Setup

A new backend has been added in `backend/` using Node.js, Express, MongoDB Atlas, Mongoose, bcrypt, JWT, and Cloudinary for public image hosting.

Steps to run the backend:

1. Copy `backend/.env.example` to `backend/.env`.
2. Fill in `MONGO_URI`, `JWT_SECRET`, and `PORT` in the `.env` file.
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

The frontend will send requests to the backend on the configured port, typically `http://localhost:5001` when using `backend/.env` or `http://localhost:5000` if no port is configured.

## Password Reset

This project now supports a password reset flow:

- `POST /api/auth/forgot-password` sends an email with a reset link
- `POST /api/auth/reset-password` updates the password using a secure token
- Reset tokens are hashed and expire after 1 hour

## Deployment Notes

To deploy this project publicly:

1. Use a hosted frontend service such as Vercel or Netlify.
2. Use a hosted backend service such as Railway, Render, or any Node-compatible host.
3. Use MongoDB Atlas for the database and configure the connection string in `backend/.env`.
4. Set `FRONTEND_URL` in `backend/.env` to your deployed frontend URL (for example, `https://your-app.vercel.app`).
5. Configure email credentials in `backend/.env` to enable password reset emails:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
6. Configure Cloudinary credentials in `backend/.env` to make uploaded images publicly visible:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
7. If you want admin management on the backend, set `ADMIN_EMAILS` in `backend/.env` or make the first registered user an admin.

### Example backend `.env`

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=strong_jwt_secret
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.example.com
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-app-password
```

### Making it public for everyone

- Don’t commit `.env` or secrets to git.
- Make sure the `backend/.env` file is present only on the server.
- Add `backend/.env` and `.env` to `.gitignore`.

### Recommended production flow

- Deploy frontend to Vercel or Netlify.
- Deploy backend to Railway, Render, or Heroku.
- Keep MongoDB Atlas credentials secure and monitor usage.
- Use Cloudinary for image hosting if you need more reliable global visibility.
