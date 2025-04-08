import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { LinkDefinition } from "@medusajs/framework/types";
import { BRAND_MODULE } from "../../modules/brand";
import BrandModuleService from "../../modules/brand/service";

//ESTE ES UN HOOK: Este hook lo que va a hacer es incorporar un step en el workflow de createProduct para que se haga POST
//cuando se cree una nueva marca, la magia esta en que gracias a link, se crea el link y la tabla lista para ser consultada

//entonces lo que se hace es utilizar el hook de createProdcutsworkflow para interceptar el productscreated y asi adicionar 
// el brand

createProductsWorkflow.hooks.productsCreated(


  //este async es un step function tal cual el que se ven en otros workflow
  //lo que le entra es products (en este caso) ya en otros casos iria otra cosa de acuerdo al hook y el workflow que se importe

  (async ({ products, additional_data }, { container }) => {

    //aqui se esta preguntando si algo esta llegando en los additional_data, en caso de no ser asi, pues el step no hace nada
    if (!additional_data?.brand_id) {
      return new StepResponse([], []);
    }

    //aqui estamos haciendo una instancia del contanier para obtener las factory functions del modulo brand a travez de su servicio
    const brandModuleService: BrandModuleService = container.resolve(BRAND_MODULE);

    // if the brand doesn't exist, an error is thrown.
    await brandModuleService.retrieveBrand(additional_data.brand_id as string);

    // TODO link brand to product
    //aqui le estamos dando superpoderes a link para poder hacer el link en la base de datos
    const link = container.resolve("link");
    //este logger es para generar un log del suceso.
    const logger = container.resolve("logger");

    //este array contiene la definicion de los links que se van a ligar en la tabla
    const links: LinkDefinition[] = [];

    for (const product of products) {
      links.push({
        [Modules.PRODUCT]: {
          product_id: product.id,
        },
        [BRAND_MODULE]: {
          brand_id: additional_data.brand_id,
        },
      });
    }

    await link.create(links);

    logger.info("se ha ligado un brand a un producto");


    return new StepResponse(links, links);
    
  }),

  
  //Esta es la funcion de compensacion por si algo sale mal y  hay que deshacer lo que se hizo
  (async (links, { container }) => {
    if (!links?.length) {
      return
    }

    const link = container.resolve("link")

    await link.dismiss(links)
  })


)
