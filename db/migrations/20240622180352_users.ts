import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary(),
        table.uuid('session_id'),
        table.string('name').notNullable(),
        table.string('email').notNullable().unique(),
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
}

