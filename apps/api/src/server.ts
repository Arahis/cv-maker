import { env } from "./config/env.js";
import { createServer } from "./createServer.js";

const server = createServer();

const start = async () => {
  try {
    await server.listen({
      port: env.port,
      host: "0.0.0.0",
    });
    server.log.info(`Server listening at http://localhost:${env.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
