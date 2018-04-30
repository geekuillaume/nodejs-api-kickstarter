import Knex from 'knex';

exports.up = (knex: Knex) => knex.schema.createTable('todos', (table) => {
  table.uuid('id').notNullable().primary();
  table.text('name').notNullable();
  table.text('comment');
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.uuid('creator_id').notNullable();
  table.foreign('creator_id').references('users.id');
});

exports.down = (knex: Knex) => knex.schema.dropTable('todos');
