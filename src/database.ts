import { Knex, knex as KnexSetup } from "knex";
import { env } from "./_env/schema";

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_CLIENT ? {
        filename: env.DATABASE_URL,
    } : env.DATABASE_URL, 
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./db/migrations"
    }
}
export const knex = KnexSetup(config)