import { createApiKeysWorkflow } from "@medusajs/medusa/core-flows";


//ESTE ES UN HOOK: Este hook lo que va a hacer es incorporar un step en el workflow de createProduct para que se haga POST
//cuando se cree una nueva marca, la magia esta en que gracias a link, se crea el link y la tabla lista para ser consultada

//entonces lo que se hace es utilizar el hook de createProdcutsworkflow para interceptar el productscreated y asi adicionar 
// el brand

createApiKeysWorkflow.hooks.apiKeysCreated(


  //este async es un step function tal cual el que se ven en otros workflow
  //lo que le entra es products (en este caso) ya en otros casos iria otra cosa de acuerdo al hook y el workflow que se importe

  (async ({apiKeys}, { container }) => {

    
    console.log("Estos son los props que se reciben del hook de apiKeysCreated", apiKeys)
  }),

  


)
