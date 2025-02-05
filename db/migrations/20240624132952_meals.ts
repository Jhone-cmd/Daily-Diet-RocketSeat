import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id'),
        table.text('name').notNullable(),
        table.text('description').notNullable(),
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now()),
        table.boolean('diet').notNullable()
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals');
}

