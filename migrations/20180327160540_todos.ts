import Knex from 'knex';

exports.up = (knex: Knex) => knex.schema.createTable('todos', (table) => {
  table.increments('id');
  table.text('name').notNullable();
  table.text('comment');
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.integer('creator_id').unsigned().notNullable();
  table.foreign('creator_id').references('user.id');
});

exports.down = (knex: Knex) => knex.schema.dropTable('todos');
