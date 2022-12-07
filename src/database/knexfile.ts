import type { Knex } from "knex";
import config from "../config";

// Update with your config settings.

const client = config.DB_CLIENT
const host = config.DB_HOST
const database = config.DB_NAME
const user = config.DB_USER
const password = config.DB_PASSWORD


const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: client || "mysql2",
    connection: {
      host:host || "sql8.freemysqlhosting.net",
      database: database || "sql8580761",
      user: user || "sql8580761",
      password: password || "1ngVYQCKhF"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: client || "mysql2",
    connection: {
      host:host || "sql8.freemysqlhosting.net",
      database: database || "sql8580761",
      user: user || "sql8580761",
      password: password || "1ngVYQCKhF"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: client || "mysql2",
    connection: {
      host:host || "sql8.freemysqlhosting.net",
      database: database || "sql8580761",
      user: user || "sql8580761",
      password: password || "1ngVYQCKhF"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};


module.exports = knexConfig;
