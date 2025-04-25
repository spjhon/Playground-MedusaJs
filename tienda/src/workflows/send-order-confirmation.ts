import { 
    createWorkflow, 
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
  import { sendNotificationStep } from "./steps/send-notification"
  
  type WorkflowInput = {
    id: string
  }
  
  export const sendOrderConfirmationWorkflow = createWorkflow(

    "send-order-confirmation",


    function ({ id }: WorkflowInput) {

      console.log("\x1b[35m  -Se ha incrustado el sendOrderConfirmationWorkflow a Medusa JS app-  \x1b[0m")

      // @ts-ignore
      const { data: orders } = useQueryGraphStep({
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
      })
      
      const notification = sendNotificationStep([{
        to: orders[0].email!,
        channel: "email",
        template: "order-placed",
        data: {
          order: orders[0],
        },
      }])
  
      return new WorkflowResponse(notification)
    }


  )