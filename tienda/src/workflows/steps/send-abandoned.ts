import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { CartDTO, CustomerDTO } from "@medusajs/framework/types";



//este es un step del tutotial de los docs que no tiene conexion con algun otro modulo o archivo en este projecto
//es solo la demostracion de como se puede invocar el modulo de notificaciones y moldear los datos para que se envien
//a los templates del service del modulo de notificaciones
type SendAbandonedNotificationsStepInput = {carts: (CartDTO & {customer: CustomerDTO;}) [] ;};

export const sendAbandonedNotificationsStep = createStep(

    "send-abandoned-notifications",

    async (input: SendAbandonedNotificationsStepInput, { container }) => {

        const notificationModuleService = container.resolve(Modules.NOTIFICATION);

        const notificationData = input.carts.map((cart) => ({
            to: cart.email!,
            channel: "email",
            template: process.env.ABANDONED_CART_TEMPLATE_ID || "",
            data: {

                customer: {
                    first_name: cart.customer?.first_name || cart.shipping_address?.first_name,
                    last_name: cart.customer?.last_name || cart.shipping_address?.last_name,
                },

                cart_id: cart.id,

                items: cart.items?.map((item) => ({
                    product_title: item.title,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    thumbnail: item.thumbnail,
                }))

            }
        }));

        const notifications = await notificationModuleService.createNotifications(notificationData);

        return new StepResponse({notifications});
    }
);
