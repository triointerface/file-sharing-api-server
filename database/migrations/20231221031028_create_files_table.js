/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('files', function(table) {
    table.bigIncrements('id').primary();
    table.uuid('public_key').unique().notNullable();
    table.uuid('private_key').unique().defaultTo(knex.fn.uuid());
    table.bigInteger('created_by').notNullable();
    // .references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('file_name', 255).notNullable();
    table.string('mime_type', 50).notNullable();
    table.text('url').notNullable();
    table.enu('provider', ['local', 'google']).defaultTo('local');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('files');
}
