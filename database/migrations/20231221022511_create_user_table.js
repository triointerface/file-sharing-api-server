/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.bigIncrements('id').primary();
    table.string('first_name', 200).notNullable();
    table.string('last_name', 200).notNullable();
    table.string('email', 200).unique().notNullable();
    table.string('password', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('users');
}
