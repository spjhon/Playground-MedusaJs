import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    
    {
      //Este modulo es la forma de agregarlo a la configuracino y que se accione el BRAND-MODULE
      //con sus respectivos servicios
      //cuando se crea un modulo y se llega hasta aqui, es el punto perfecto para correr migrations
      resolve: "./src/modules/brand",
    },
    {
      resolve: "./src/modules/cms",
      options: {
        apiKey: process.env.CMS_API_KEY,
      },
    },
    {
      resolve: "./src/modules/blog",
    },
  ]
})
