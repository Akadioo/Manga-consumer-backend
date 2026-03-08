export default () => ({
  appPort: process.env.APP_PORT || 3001,
  environment: process.env.ENVIRONMENT || 'development',
  crudUrl: process.env.CRUD_URL || 'http://localhost:3000',
  appTokenCrud: process.env.APP_TOKEN_CRUD || 'secret',
});
