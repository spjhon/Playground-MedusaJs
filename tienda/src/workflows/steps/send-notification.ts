import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CreateNotificationDTO } from "@medusajs/framework/types";

export const sendNotificationStep = createStep(
  "send-notification",

  async (data: CreateNotificationDTO[], { container }) => {

    const notificationModuleService = container.resolve(Modules.NOTIFICATION);

    const notification = await notificationModuleService.createNotifications(data);

    console.log("Se ha ejecutado el step sendNotificationStep que activa el notificationModuleService.createNotifications() ")
    
    return new StepResponse(notification);
  }
  
);
