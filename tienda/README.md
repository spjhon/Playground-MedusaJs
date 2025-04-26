# README medusa backend starter

## Compatibility

This starter is compatible with versions >= 2 of `@medusajs/medusa`.

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/learn/installation) to set up a server.

Visit the [Docs](https://docs.medusajs.com/learn/installation#get-started) to learn more about our system requirements.

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa’s architecture](https://docs.medusajs.com/learn/introduction/architecture) and [commerce modules](https://docs.medusajs.com/learn/fundamentals/modules/commerce-modules) in the Docs.

## Medusa Tips

### El src

- **admin**: Holds your admin dashboard's custom widgets and UI routes.
- **api**: Holds your custom API routes that are added as endpoints in your Medusa application.
- **jobs**: Holds your scheduled jobs that run at a specified interval during your Medusa application's runtime.
- **links**: Holds your module links that build associations between data models of different modules.
- **modules**: Holds your custom modules that implement custom business logic.
- **scripts**: Holds your custom scripts to be executed using Medusa's CLI tool.
- **subscribers**: Holds your event listeners that are executed asynchronously whenever an event is emitted.
- **workflows**: Holds your custom flows that can be executed from anywhere in your application.

### Arquitectura minima para extender medusa

In a common Medusa application, requests go through four layers in the stack. In order of entry, those are:

1. **API Routes (HTTP)**: Our API Routes are the typical entry point. The Medusa server is based on Express.js, which handles incoming requests. It can also connect to a Redis database that stores the server session data.
2. **Workflows**: API Routes consume workflows that hold the opinionated business logic of your application.
3. **Modules**: Workflows use domain-specific modules for resource management.
4. **Data store**: Modules query the underlying datastore, which is a PostgreSQL database in common cases.

### Para extender a medusa

- **Module Links**: Link data models of different modules without building direct dependencies, ensuring that the Medusa application integrates your modules without side effects.
- **Workflow Hooks**: inject custom functionalities into a workflow at predefined points, called hooks. This allows you to perform custom actions as a part of a core workflow without hacky workarounds.
- **Additional Data in API Routes**: Configure core API routes to accept request parameters relevant to your customizations. These parameters are passed to the underlying workflow's hooks, where you can manage your custom data as part of an existing flow.

### Entendiendo los modulos

#### Auth Module

El moduclo cuenta con dos tablas:

- `auth_identity`  
- `provider_identity`

Uno posee una identidad de autorizacion que solo es un id de autorizacion y el proveedor es el que tiene la constraseña y el usuario al que pertenece ademas de saber a que tipo de autenticacion pertenece (google, emailpass, github)

Esto se hace ya que un ACTOR TYPE puede ser User, Customer, etc.

#### Cart Module

El carrito trae su tabla `cart` la cual trae referencias de `shipping adress` y `billing adress` y basciamente cart es como un carrito vacio en la base de datos y cada item que se agrega es un `cart line item` en donde esta el articulo y su cantidad y otros datos para asociar.

Algo importante, en una tabla sql, EL QUE TIENE LA LLAVE FORANEA ES EL QUE SOLO PUEDE TENER UNO DEL OTRO, UNO Y NADA MAS.
