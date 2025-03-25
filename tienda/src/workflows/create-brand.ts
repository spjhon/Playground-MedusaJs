
//importaciones para crear un step
import {
    createStep,
    StepResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { BRAND_MODULE } from "../modules/brand"
  import BrandModuleService from "../modules/brand/service"


  //importacione para utilizar el step en un workflow
  import {
    // ...
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk"


  




  export type CreateBrandStepInput = {
    name: string
  }
  
  //este es un step, no es el workflow o la aplicacion de es, es el step que utiliza servicios creados en los modulos po rmedio +
  //del modelo de datos en brand.ts dentro de models y los servicos integrados en services.
  export const createBrandStep = createStep(
    "create-brand-step",
    async (input: CreateBrandStepInput, { container }) => {


      const brandModuleService: BrandModuleService = container.resolve(
        BRAND_MODULE
      )
      

      //esta es la funcion de compensacion que lo que hace es revertir lo que se ha hecho si en algum momento de los spteps
      // sale un error
      async (id: string, { container }) => {
        const brandModuleService: BrandModuleService = container.resolve(
          BRAND_MODULE
        )
        await brandModuleService.deleteBrands(id)
      }

      //No olvidar que el createBrands es una funcion automatica que se crea al crear el service.ts y utiliza las
      //funciones factory de medusa.
      const brand = await brandModuleService.createBrands(input)

      console.log("A continuacion, el container:", container.registrations)

      return new StepResponse(brand, brand.id)
    }
  )



//estos son los types para el workflow
  type CreateBrandWorkflowInput = {
    name: string
  }

  //este es el workflow
  export const createBrandWorkflow = createWorkflow(
    "create-brand",
    //esto segun la documentacion es una funcion constructora que aceta el input que es un object
    (input: CreateBrandWorkflowInput) => {
      const brand = createBrandStep(input)
  
    
      return new WorkflowResponse(brand)
    }
  )