import Knex from 'knex';

exports.up = (knex: Knex) => knex.schema.createTable('todos', (table) => {
  table.increments('id');
  table.text('name').notNullable();
  table.text('comment');
});

exports.down = (knex: Knex) => knex.schema.dropTable('todos');
