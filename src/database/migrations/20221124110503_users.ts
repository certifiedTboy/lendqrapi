import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.hasTable("users").then(async (exists) => {
    if (!exists) {
      await knex.schema
        .createTable("users", async (table) => {
          table.increments("userId").primary();
          table.string("surnName").notNullable();
          table.string("firstName").notNullable();
          table.string("email").notNullable();
          table.string("phoneNumber").notNullable();
          table.string("role").notNullable().defaultTo("USER");
          table.dateTime("dateOfBirth")
          table.string("gender").notNullable()
          table.string("imageUrl");
          table.date("lastLoginAt");
          table.string("bvn");
          table.string("passCode");
          table.string("transactionId");
        })
        .createTable("verificationStatus", async (table) => {
          table.increments("verificationId").primary();
          table.boolean("emailIsVerified").defaultTo("false");
          table.boolean("phoneNumberIsVerified").defaultTo("false");
          table.boolean("bvnIsVerified").defaultTo("false");
          table.integer("userId").unsigned().references("users.userId");
        })
        .createTable("userSession", async (table) => {
          table.increments("sessionId").primary();
          table.string("token");
          table.string("ipAddress");
          table.string("platform");
          table.date("expiresAt");
          table.integer("userId").unsigned().references("users.userId");
        })
        .createTable("bankDetails", async (table) => {
          table.increments("bankId").primary();
          table.string("bankName").notNullable();
          table.string("accountSurname").notNullable();
          table.string("accountFirstName").notNullable();
          table.bigInteger("accountNumber").notNullable();
          table.integer("userId").unsigned().references("users.userId");
        })
        .createTable("cardDetails", async (table) => {
          table.increments("cardId").primary();
          table.string("cardName").notNullable();
          table.string("cardType").notNullable();
          table.integer("cardPin").notNullable();
          table.bigInteger("cardNumber").notNullable();
          table.integer("CVV2").notNullable();
          table.integer("userId").unsigned().references("users.userId");
        })
        .createTable("userWallet", async (table) => {
          table.increments("walletId").primary();
          table.bigInteger("walletBalance").defaultTo(0);
          table.integer("userId").unsigned().references("users.userId");
        })
        .createTable("userTransactions", async (table) => {
          table.increments("transactionId").primary();
          table.string("title");
          table.string("description");
          table.bigInteger("amount");
          table.integer("userId").unsigned().references("users.userId");
        })
        .createTable("loanDetails", async (table) => {
          table.increments("loanId").primary();
          table.string("purpose").notNullable();
          table.string("status").defaultTo("PENDING");
          table.string("guarantorName").notNullable();
          table.string("guarantorPhoneNumber").notNullable();
          table.bigInteger("amount").notNullable();
          table.bigInteger("interest").notNullable()
          table.integer("days")
          table.dateTime("payday")
          table.integer("userId").unsigned().references("users.userId");
        })
        .then(() => {
          console.log("users Table created Successfully");
        })
        .catch((err) => console.log(err));
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
