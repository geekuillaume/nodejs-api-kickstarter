import { decamelize } from 'humps';
import { keys, pickBy } from 'lodash';

export const joiToSQLFields = (joiSchema, tableName) =>
  keys(pickBy(
    joiSchema.describe().children,
    (val) => !(val.meta && val.meta[0].notInDb),
  ))
    .map((columnName) => `${tableName}.${decamelize(columnName)}`);

