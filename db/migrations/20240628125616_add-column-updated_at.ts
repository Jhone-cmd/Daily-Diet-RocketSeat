import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meals', (table) => {
        table.timestamp('updated_at').after('created_at').notNullable().defaultTo(knex.fn.now())
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meals', (table) => {
        table.dropColumn('updated_at')
    });
}

