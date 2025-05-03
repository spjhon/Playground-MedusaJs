import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { CustomerDTO } from "@medusajs/framework/types"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { HELLO_MODULE } from "../../modules/hello"
import { createCustomStep } from "./steps/create-custom"

export type CreateCustomFromCustomerWorkflowInput = {
  customer: CustomerDTO
  additional_data?: {custom_name?: string}
}

export const createCustomFromCustomerWorkflow = createWorkflow(
  "create-custom-from-customer",

  (input: CreateCustomFromCustomerWorkflowInput) => 
    {

        const customName = transform({input}, (data) => data.input.additional_data.custom_name || "")

        const custom = createCustomStep({custom_name: customName})

        /**
         * Lo que se observa aqui es que el segundo argumento de when es solo una funcion que devuelve true o false nada mas
         * entonces si el el segundo argumento es false por algun motivo no se ejecuta el then
         */
        when(({ custom }), ({ custom }) => custom !== undefined)
        
            .then(() => {

                createRemoteLinkStep([{

                [Modules.CUSTOMER]: {
                    customer_id: input.customer.id,
                },

                [HELLO_MODULE]: {
                    custom_id: custom.id,
                },

                }])
            })

        return new WorkflowResponse({custom})
    }
)