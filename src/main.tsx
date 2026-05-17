import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root");
if (!root) {
  console.error("Root element not found");
} else {
  try {
    createRoot(root).render(<App />);
    console.log("App rendered successfully");
  } catch (error) {
    console.error("Failed to render app:", error);
    root.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;">
      <h2>Error rendering app:</h2>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
    </div>`;
  }
}
