import * as swaggerJSDoc from 'swagger-jsdoc';
import * as glob from 'glob';
import * as j2s from 'joi-to-swagger';
import { join } from 'path';
import { assign, mapKeys, mapValues } from 'lodash';
import * as spectacle from 'spectacle-docs';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import * as config from 'config';


const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: config.get('docInfo'),
  },
  apis: glob.sync('**/*.ts'),
});

const schemasFiles = glob.sync('**/*Schema.ts');
const schemas = mapKeys(
  assign(
    {},
    ...schemasFiles.map((file) =>
      require(join(process.cwd(), file))), // eslint-disable-line
  ),
  (value, schemaName) => /(.*?)(Schema)?$/.exec(schemaName)[1],
);

const swaggerDefinition = mapValues(schemas, (schema) => j2s(schema).swagger);

swaggerSpec.definitions = swaggerDefinition;

const tempSwaggerDefinitionFile = join(tmpdir(), 'swaggerDefinition.json');

writeFileSync(tempSwaggerDefinitionFile, JSON.stringify(swaggerSpec));

spectacle({
  specFile: tempSwaggerDefinitionFile,
  targetDir: join(process.cwd(), 'apiDoc'),
  quiet: true,
});

unlinkSync(tempSwaggerDefinitionFile);
