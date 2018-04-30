# Documentation

The documentation uses the OpenAPI / Swagger 2.0 format and convert it to an HTML tempate with [Spectacle](https://www.npmjs.com/package/spectacle-docs).

There is three sources of information used to generate the docs:

### Components

Located in `misc/internals/docsComponents/*.ts`, these files should exports an object that will be merged in the final OpenAPI specification. You can changes the `info.ts` file to add a better description or other fields like license (more information in the [documentation](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#infoObject)).

### Schemas

The script will look at every file corresponding to `**/*Schema.ts` and import the Joi schemas declarations. The schemas will be used to documente the objects fields that can be used in as requests or responses in the API routes. You can reference these schemas in the routes documentation.

### API Routes

The routes are defined as JSDoc comments describing a OpenAPI endpoint. Every file is parsed to look for these comments. You should take a look at the [OpenAPI documentation](tps://swagger.io/docs/specification/2-0/basic-structure/) for more information about what you can do here.

If you don't like these types of comments, you can document them by creating files inside the `docsComponents` folder and using the `paths` object.