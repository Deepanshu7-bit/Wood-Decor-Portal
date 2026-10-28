import { app } from "./app.js";
import { ENV } from "./config/env.js";

// Start HTTP Server
const server = app.listen(ENV.PORT, () => {
  console.log(`\n=================================================`);
  console.log(`  🌲 Woods Decor Backend API running!`);
  console.log(`  🚀 Port: http://localhost:${ENV.PORT}`);
  console.log(`  🩺 Health: http://localhost:${ENV.PORT}/api/v1/health`);
  console.log(`  🌍 Mode: ${ENV.NODE_ENV}`);
  console.log(`=================================================\n`);
});

// Handle graceful shutdown on Ctrl+C or process kill
process.on("SIGINT", () => {
  console.log("Shutting down Woods Decor API gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
