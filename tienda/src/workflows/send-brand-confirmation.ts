import { 
    createWorkflow, 
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk"
  //import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
  import { sendNotificationStep } from "./steps/send-notification"
  
  type WorkflowInput = {
    id: string
  }
  
  export const sendBrandConfirmationWorkflow = createWorkflow(
    "send-brand-confirmation",
    ({ id }: WorkflowInput) => {
      // @ts-ignore
      /*const { data: brand } = useQueryGraphStep({
        entity: "order",
        fields: [
          "id",
          "email",
          "currency_code",
          "total",
          "items.*",
        ],
        filters: {
          id,
        },
      })*/

        const brand = [{
            email: "tortlink8@gmail.com",
            id: "este es el id"
        }];
      
      const notification = sendNotificationStep([{
        to: brand[0].email!,
        channel: "email",
        template: "brand-created",
        data: {
          brand: brand[0],
        },
      }])
  
      return new WorkflowResponse(notification)
    }
  )