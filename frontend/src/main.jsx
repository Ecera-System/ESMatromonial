import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Readable, Writable, Duplex } from "readable-stream";

window.global = window;
window.process = window.process || {};
window.process.nextTick =
  window.process.nextTick ||
  function (cb) {
    setTimeout(cb, 0);
  };

// Polyfill for simple-peer/stream-browserify
window.ReadableStream = window.ReadableStream || Readable;
window.WritableStream = window.WritableStream || Writable;
window.DuplexStream = window.DuplexStream || Duplex;

import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { SocketProvider } from "./contexts/Chat/SocketContext";
import { AuthProvider } from "./contexts/Chat/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
