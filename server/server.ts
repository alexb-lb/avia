import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import config from "./config/config.ts";
import errorMW from "./middleware/error.ts";
import checkDbConnected from "./db/checkDbConnected.ts";

const app = new Application();
const router = new Router();

// import serve from "koa-static";
// import send from "koa-send";

// import config from "./config/config.js";
// import apiRouter from "./routes/rootRouter.js";

// import passport from "koa-passport";

const start = async () => {
  app.addEventListener(
    "error",
    (error) => console.error("Koa app error: ", error),
  );

  app.use(errorMW());
  app.use(
    oakCors({ origin: `${config.protocol}://${config.domain}:${config.port}` }),
  );
  app.use(router.allowedMethods());
  app.use(router.routes());
  app.use(async (context, next) => {
    try {
      await context.send({
        root: `${Deno.cwd()}/../public/`,
        index: `index.html`,
      });
    } catch {
      next();
    }
  });

  app.listen({ port: config.port });

  try {
    await checkDbConnected();
  } catch (error) {
    console.error("DB initialization failed: ", error);
    throw error;
  }

  console.info(
    `Listening on ${config.protocol}://${config.domain}:${config.port}`,
  );
};

start()
  .then(() => console.info("Server start done"))
  .catch((error) => {
    console.error("Server start failed: ", error);
    Deno.exit(-1);
  });
