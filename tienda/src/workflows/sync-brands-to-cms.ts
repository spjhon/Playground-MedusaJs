import { 
    createStep, 
    StepResponse, 
    createWorkflow, 
    WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { InferTypeOf } from "@medusajs/framework/types"
import { Brand } from "../modules/brand/models/brand"
import { CMS_MODULE } from "../modules/cms"
import CmsModuleService from "../modules/cms/service"

import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

type SyncBrandToCmsStepInput = {
  brand: InferTypeOf<typeof Brand>
}


type SyncBrandToCmsWorkflowInput = {
    id: string
  }

const syncBrandToCmsStep = createStep(
  "sync-brand-to-cms",


  async ({ brand }: SyncBrandToCmsStepInput, { container }) => {

    console.log("Se ha ejecutado el syncBrandToCmsStep que ejecuta el cmsModuleService.createBrand() service ")

    const cmsModuleService: CmsModuleService = container.resolve(CMS_MODULE)

    await cmsModuleService.createBrand(brand)

    return new StepResponse(null, brand.id)
  },

  //esta es la funcion de compenzacion
  async (id, { container }) => {
    if (!id) {
      return
    }

    const cmsModuleService: CmsModuleService = container.resolve(CMS_MODULE)

    await cmsModuleService.deleteBrand(id)
  }


)




//desde aqui empieza el workflow

export const syncBrandToCmsWorkflow = createWorkflow(
    "sync-brand-to-cms",
    (input: SyncBrandToCmsWorkflowInput) => {

      console.log("\x1b[35m  -Se ha incrustado el syncBrandToCmsWorkflow a Medusa JS app-  \x1b[0m")

      // @ts-ignore
      const { data: brands } = useQueryGraphStep({entity: "brand", fields: ["*"], filters: {id: input.id},
        //Throw an error if a brand with the specified ID doesn't exist.
        options: {throwIfKeyNotFound: true}
      })
  
      syncBrandToCmsStep({brand: brands[0]} as SyncBrandToCmsStepInput)
  
      return new WorkflowResponse({})

    }
)