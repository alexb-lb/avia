import { Client } from "https://deno.land/x/mysql/mod.ts";
import config from "../config/config.ts";

console.log(config.db);

const client = await new Client().connect({
  hostname: config.db.hostname,
  username: config.db.username,
  password: config.db.password,
  db: config.db.dbName,
  poolSize: config.db.poolSize,
});

export default client;
