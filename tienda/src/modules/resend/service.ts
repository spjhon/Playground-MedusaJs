import { AbstractNotificationProviderService, MedusaError} from "@medusajs/framework/utils";

import { 
    Logger, 
    //estos provider son utilizados para el envio de los correos en el metodo send
    ProviderSendNotificationDTO, 
    ProviderSendNotificationResultsDTO 
} from "@medusajs/framework/types";

import { 
    Resend, 
    CreateEmailOptions 
} from "resend";

import { orderPlacedEmail } from "./emails/order-placed"
import { brandCreatedEmail } from "./emails/brand-created"


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


enum Templates {ORDER_PLACED = "order-placed", BRAND_CREATED = "brand-created"}


const templates: {[key in Templates]?: (props: unknown) => React.ReactNode} = {
    //TODO estos son los templates de email
    [Templates.ORDER_PLACED]: orderPlacedEmail,
    [Templates.BRAND_CREATED]: brandCreatedEmail,
  }



//esta es la clase que extiende el proceso de notificacion de medusa y lo vamos a llamar resendNotificacionProviderService
//al ser un service se le prodria agregar las factory functions pero como este modulo no tiene una o varias tablas en la base
//de datos entonces se deben de crear los sercicos en esta clase
class ResendNotificationProviderService extends AbstractNotificationProviderService {

    static identifier = "notification-resend";
    private resendClient: Resend;
    private options: ResendOptions;
    private logger: Logger;

    /**
     * En otras palabras: antes de usar la clase ResendNotificationProviderService, 
     * este método se puede usar para asegurarse de que tiene la configuración mínima 
     * necesaria para funcionar (como la API key y el remitente del email).
     * 
     * Es un método estático, así que puedes llamarlo como 
     * ResendNotificationProviderService.validateOptions(...) sin necesidad de crear un objeto.
     * Recibe un objeto llamado options.
     * 
     * En cuanto al { [key: string]: any } Esa es solo una forma de decir "un objeto cualquiera" 
     * (como { clave: valor }). En este contexto:
     * 
     * Medusa 2.0 tiene una arquitectura modular donde, cuando registras un módulo personalizado 
     * (como hiciste con ModuleProvider(Modules.NOTIFICATION, { services: [...] })), el core de Medusa 
     * llama automáticamente al método validateOptions() si está definido como static.
     * ✅ Es una convención. Si el servicio exportado por el módulo tiene un método static validateOptions(options), 
     * Medusa lo ejecuta al momento de instanciar el módulo.
     */
    static validateOptions(options: { [key: string]: any }) {

        console.log("✅ validateOptions() ejecutado con los options: ", options);

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

    /**
     * 
     * @param {ProviderSendNotificationDTO} notification 
     * 
     * Es un método asincrónico que recibe un objeto notification.
     * Devuelve una promesa que resuelve con el resultado del envío del correo.
     * @returns Promise
     */
    async send(notification: ProviderSendNotificationDTO): Promise<ProviderSendNotificationResultsDTO> 
    {
        const template = this.getTemplate(notification.template as Templates)
    
        if (!template) {
          this.logger.error(`Couldn't find an email template for ${notification.template}. The valid options are ${Object.values(Templates)}`)
          return {}
        }
    
        let emailOptions: CreateEmailOptions

        if (typeof template === "string") {
            emailOptions = {
            from: this.options.from,
            to: [notification.to],
            subject: this.getTemplateSubject(notification.template as Templates),
            html: template,
        }
        } else {
        emailOptions = {
            from: this.options.from,
            to: [notification.to],
            subject: this.getTemplateSubject(notification.template as Templates),
            react: template(notification.data),
        }
        }
    
        const { data, error } = await this.resendClient.emails.send(emailOptions)
    
        if (error || !data) {
            if (error) {
              this.logger.error("Failed to send email", error)
            } else {
              this.logger.error("Failed to send email: unknown error")
            }
            return {}
        }
    
        
        return { id: data.id }
    }

}



export default ResendNotificationProviderService;
