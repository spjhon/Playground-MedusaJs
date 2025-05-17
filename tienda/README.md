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

### Base de Datos

Medusa utiliza redis para almacenamiento temporal (cache y sessiones de autenticacion) y postgre como base de datos relacional permanente.

lago importante: [DATABASE_URL=postgresql://postgres:Discovery69%25@db.iwnpyckvirejefdxynbr.supabase.co:5432/postgres]

Tips para entender las relaciones de medusa:

- Si dice belongsto, esa tabla tiene la foreing key y la otra dice hasMany casi siempre
- Si dice hasonewithforeingkey, esa tabla tiene la foreingkey y normalmente la otra tabla no dice o dice hasone
- Aunque suene contradictorio, en sql la tabla de muchos es la que tiene la foreingkey y la tabla uno es la que no tiene foreingkey
- una forma de leerlo con fulfillment "UNO solo fulfillment_set esta referenciado en MUCHOS service_zones" osea que el mismo fulfillment_set se va a repetir en diferentes service_zones. 1 FulfillmentSet tiene N ServiceZones. Cada ServiceZone pertenece a un solo FulfillmentSet.
- En cuanto a los lados del link, el que dice esList es el que guarda la foreingkey de la otra y por eso se puede repetir el mismo id de la tabla que no tiene el esList en varios ids de la tabla que si tiene el esList.
- Cuando se muestra que una tabla apunta a otra, es la hija (LA QUE TIENE LA FOREINGKEY) que apunta al padre (QUE NO TIENE FOREING KEY)
- Cuando se le dice borrado en cascada, el borrado en cascada se definiria en la tabla que tiene el foreingkye pero el suceso se registraria en la otra tabla, la tabla padre, si esta talba se borra, borra tambien el registro en donde tenga su foreingkey registrada osea en el hijo que apunta al padre.
- La direccion de los links es importante, por eso: A es el que "apunta" a B en la definicon de los links: defineLink(A, B), La foreign key queda del lado de A. Piensa en esto como: ¿Quién necesita saber del otro? → Ese es el que apunta. ¿Quién guarda la referencia? → Ese es el que apunta.
- En un schema una forma de interpretar que el padre (por ejemplo service_zone), uno solo de esos tiene muchos hijos (shiping_options) y deja su marca dejando su id (el id de service_zone) en la tabla de shiping_options, de esa forma se logra entender que uno o varios shiping options le pertenecen a service_zone.

#### En cuanto a links y su necesidad

📖 ¿Cuándo es una extensión y cuándo una asociación?

📝 Extensión:
Cuando quieres agregarle más campos a un modelo principal, pero no puedes (o no quieres) modificar directamente su definición porque es parte de otro módulo (por modularidad, escalabilidad o clean architecture).

📝 Asociación:
Cuando quieres simplemente relacionar dos modelos que tienen vida propia y no dependen uno del otro.
Ejemplo típico: un Post que hace referencia a un Product.
