import { INTERNAL_ERROR } from "../helpers/status.js";

export default () => {
  return async (ctx: any, next: () => void) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.set("Content-Type", "application/json");
      ctx.body = {
        status: err.status || INTERNAL_ERROR,
        message: err.message,
      };

      ctx.app.emit("error", err, ctx);
    }
  };
};
