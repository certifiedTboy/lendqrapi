import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.hasTable("verificationData").then(async (exists) => {
        if(!exists) {
            await knex.schema
            .createTable("verificationData", async (table) => {
                table.increments("id").primary();
                table.string('email')
                table.string('phoneNumber')
                table.string("bvn")
                table.integer("OTP")
            })
           .then(() => {
                console.log("verification data Table created Successfully")
            })
            .catch((err) => console.log(err))
        }
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('verificationData')
}
