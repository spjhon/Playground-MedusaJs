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


    {
      //esta es la forma de registrar el cache de redis que se encuentra en el .env
      resolve: "@medusajs/medusa/cache-redis",
      options: { 
        redisUrl: process.env.CACHE_REDIS_URL,
      },
    },

    {
      //esta es la forma de registrar el event bus para los eventos que se emiten desde los workflows.
      resolve: "@medusajs/medusa/event-bus-redis",
      options: { 
        redisUrl: process.env.EVENTS_REDIS_URL,

      },
    },

    {
      //esta es la forma de registrar el loking module para operaciones asyncronas que se ejecuten en fila.
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          // add providers here...
        ],
      },
    },

    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            options: {
              redisUrl: process.env.LOCKING_REDIS_URL,
            },
          },
        ],
      },
    },


  ]
})
