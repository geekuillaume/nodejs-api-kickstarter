import * as Knex from 'knex';

exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.createTable('user', (table) => {
    table.uuid('id').notNullable().primary();
    table.text('email').notNullable();
    table.boolean('active').defaultTo(false);

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
  await knex.schema.createTable('auth', (table) => {
    table.uuid('id').notNullable().primary();
    table.uuid('userId').notNullable();
    table.enum('type', ['email']).notNullable();
    table.boolean('active').defaultTo(false);
    table.text('identifier').notNullable();
    table.text('secret');

    // There should only be one type-identifier unique couple allowed
    table.unique(['type', 'identifier']);
    table.foreign('userId', 'user.id');

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.dropTable('auth');
  await knex.schema.dropTable('user');
};
