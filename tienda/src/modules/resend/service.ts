import { AbstractNotificationProviderService, MedusaError} from "@medusajs/framework/utils";

import { Logger } from "@medusajs/framework/types";

import { Resend } from "resend";

//Estos son los types para las opciones que entran al instanciarse una clase de tipo notificacion de email
type ResendOptions = {
  api_key: string;
  from: string;
  html_templates?: Record<string, {subject?: string; content: string;}>;
};

//estas son las dependencias inyectadas a travez del logger
type InjectedDependencies = {
    logger: Logger
}

enum Templates {ORDER_PLACED = "order-placed"}


const templates: {[key in Templates]?: (props: unknown) => React.ReactNode} = {
    // TODO add templates
  }



//esta es la clase que extiende el proceso de notificacion de medusa y lo vamos a llamar resendNotificacionProviderService
//al ser un service se le prodria agregar las factory functions pero como este modulo no tiene una o varias tablas en la base
//de datos entonces se deben de crear los sercicos en esta clase
class ResendNotificationProviderService extends AbstractNotificationProviderService {

    static identifier = "notification-resend";
    private resendClient: Resend;
    private options: ResendOptions;
    private logger: Logger;

    static validateOptions(options: Record<any, any>) {

        if (!options.api_key) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "Option `api_key` is required in the provider's options."
            )
        }

        if (!options.from) {
        throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "Option `from` is required in the provider's options."
            )
        }
    }

  // ...

    constructor({ logger }: InjectedDependencies, options: ResendOptions) {
        super()
        this.resendClient = new Resend(options.api_key)
        this.options = options
        this.logger = logger
    }



    getTemplate(template: Templates) {
        if (this.options.html_templates?.[template]) {
            return this.options.html_templates[template].content
        }

        const allowedTemplates = Object.keys(templates)

        if (!allowedTemplates.includes(template)) {
            return null
        }

        return templates[template]
    }


    getTemplateSubject(template: Templates) {

        if (this.options.html_templates?.[template]?.subject) {
            return this.options.html_templates[template].subject
        }

        switch(template) {
            case Templates.ORDER_PLACED:
                return "Order Confirmation"
            default: 
                return "New Email"
        }
    }

}



export default ResendNotificationProviderService;
