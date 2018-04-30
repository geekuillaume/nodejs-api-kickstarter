export default {
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Formatted as \'Bearer {Token}\'',
    },
  },
};
