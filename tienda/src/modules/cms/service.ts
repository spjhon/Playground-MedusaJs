import { Logger, ConfigModule } from "@medusajs/framework/types"

export type ModuleOptions = {
  apiKey: string
}

type InjectedDependencies = {
  logger: Logger
  configModule: ConfigModule
}

class CmsModuleService {
  private options_: ModuleOptions
  private logger_: Logger

  constructor({ logger }: InjectedDependencies, options: ModuleOptions) {
    this.logger_ = logger
    this.options_ = options

    // TODO initialize SDK

    

  }


// ...

  // a dummy method to simulate sending a request,
  // in a realistic scenario, you'd use an SDK, fetch, or axios clients
  private async sendRequest(url: string, method: string, data?: any) {
    this.logger_.info(`Se ah activado el envio al CMS con la siguiente info:`)
    this.logger_.info(`Enviendo un ${method} a la direccion ${url}.`)
    this.logger_.info(`Los datos que se envian son: ${JSON.stringify(data, null, 2)}`)
    this.logger_.info(`Esta es la api-key del CMS: ${JSON.stringify(this.options_.apiKey, null, 2)}`)
  }

  async createBrand(brand: Record<string, unknown>) {
    await this.sendRequest("/brands", "POST", brand)
  }

  async deleteBrand(id: string) {
    await this.sendRequest(`/brands/${id}`, "DELETE")
  }

  async retrieveBrands(): Promise<Record<string, unknown>[]> {
    await this.sendRequest("/brands", "GET")

    return []
  }

}

export default CmsModuleService