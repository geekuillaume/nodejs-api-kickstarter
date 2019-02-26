import swaggerJSDoc from 'swagger-jsdoc';
import glob from 'glob';
import j2s from 'joi-to-swagger';
import { join } from 'path';
import {
  assign, mapKeys, mapValues, merge, pickBy,
} from 'lodash';
import spectacle from 'spectacle-docs';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {},
  apis: glob.sync('**/*.ts'),
});

const schemasFiles = glob.sync('**/*Schema.ts');
const schemas = pickBy(
  mapKeys(
    assign(
      {},
      ...schemasFiles.map((file) =>
        require(join(process.cwd(), file))), // eslint-disable-line
    ),
    (value, schemaName) => /(.*?)(Schema)?$/.exec(schemaName)[1],
  ),
  (schema) => schema.isJoi,
);

const swaggerDefinition = mapValues(schemas, (schema) => j2s(schema).swagger);

swaggerSpec.definitions = swaggerDefinition;

const docsComponents = glob.sync('misc/internals/docsComponents/**.ts')
  .map((component) => require(join(process.cwd(), component)).default); // eslint-disable-line

merge(swaggerSpec, ...docsComponents);

const tempSwaggerDefinitionFile = join(tmpdir(), 'swaggerDefinition.json');

writeFileSync(tempSwaggerDefinitionFile, JSON.stringify(swaggerSpec));

spectacle({
  specFile: tempSwaggerDefinitionFile,
  targetDir: join(process.cwd(), 'apiDoc'),
  quiet: true,
});

unlinkSync(tempSwaggerDefinitionFile);
