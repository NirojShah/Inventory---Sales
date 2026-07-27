import http from "http";
import app from "./app";
import connectDatabase from "./utility/db.connection";

const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    const dbUrl = process.env.DB_URL || "";
    await connectDatabase(dbUrl);

    server.listen(PORT, () => {
      console.log(`SERVER STARTED ON - ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();