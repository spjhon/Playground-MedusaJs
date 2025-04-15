//importaciones para crear un step
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { BRAND_MODULE } from "../modules/brand";
import BrandModuleService from "../modules/brand/service";

//importacione para utilizar el step en un workflow
import {
  // ...
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

//este import es para crear un event desde el workflow que lo agarre
//el subscriber y asi hacer algo asyncrono fuera del ciclo normal de medusa
import { emitEventStep } from "@medusajs/medusa/core-flows";

export type CreateBrandStepInput = {
  name: string;
};



//este es un step, no es el workflow o la aplicacion de es, es el step que utiliza servicios creados en los modulos po rmedio +
//del modelo de datos en brand.ts dentro de models y los servicos integrados en services.
export const createBrandStep = createStep(
  "create-brand-step",

  async (input: CreateBrandStepInput, { container }) => {

    //aqui estamos haciendo una instancia del contanier para obtener las factory functions del modulo brand a travez de su servicio
    const brandModuleService: BrandModuleService = container.resolve(BRAND_MODULE);

    //No olvidar que el createBrands es una funcion automatica que se crea al crear el service.ts y utiliza las
    //funciones factory de medusa.
    const brand = await brandModuleService.createBrands(input);

   //este consolelog si funciona, mientras que en el workflow no funciona
    console.log("El step createBrandStep se ha ejecutado correctamente con el input: ", input)

    //entonces por obligacion hay que devolver el stepresponse que devuelve 
    return new StepResponse(brand, brand.id);

  },


//esta es la funcion de compensacion que lo que hace es revertir lo que se ha hecho si en algum momento de los spteps
    // sale un error
    async (id: string, { container }) => {
      const brandModuleService: BrandModuleService = container.resolve(BRAND_MODULE);
      await brandModuleService.deleteBrands(id);
    }


)






//estos son los types para el workflow
//el poder de los workflow es que permite adiconar logica de tipo roll-back, retry, y mucho mas
type CreateBrandWorkflowInput = {
  name: string;
};

//este es el workflow
export const createBrandWorkflow = createWorkflow(
  "create-brand",
  //esto segun la documentacion es una funcion constructora que aceta el input que es un object
  (input: CreateBrandWorkflowInput) => {


    //este es un step dentro del workflow
    const brand = createBrandStep(input);

    //este consolelog no funciona en el workflow, pero si en el step y en la api
    console.log("\x1b[35m  -Se ha incrustado el createBrandWorkflow a Medusa JS app-  \x1b[0m")

    //este es el emisor de eventos que va a escuchar el subscriber para hacer la operacion async al cms
    emitEventStep({
      eventName: "brand.created",
      data: {
        id: brand.id,
      },
    });




    return new WorkflowResponse(brand);
  }
);
