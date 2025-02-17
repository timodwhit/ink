import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { route as rootRoute } from "./routes/root.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from './lib/theme';

const router = createBrowserRouter([rootRoute]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>,
);
