import { createServer } from "./createServer.js";
import "dotenv/config";

const server = createServer();

const start = async () => {
  try {
    await server.listen({
      port: parseInt(process.env.PORT || "4000"),
      host: "0.0.0.0",
    });
    server.log.info(`Server listening at http://localhost:4000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
