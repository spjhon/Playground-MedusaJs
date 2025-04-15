import type {SubscriberConfig, SubscriberArgs} from "@medusajs/framework"

import { syncBrandToCmsWorkflow } from "../workflows/sync-brands-to-cms"
import { sendBrandConfirmationWorkflow } from "../workflows/send-brand-confirmation"
  

export default async function brandCreatedHandler({event: { data }, container }: SubscriberArgs<{ id: string }>) {

  await syncBrandToCmsWorkflow(container).run({input: data})

  await sendBrandConfirmationWorkflow(container).run({input: {id: data.id}})
  
}
  
export const config: SubscriberConfig = {event: "brand.created"}