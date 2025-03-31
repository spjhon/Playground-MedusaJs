import { MedusaService } from "@medusajs/framework/utils"
import { Brand } from "./models/brand"

class BrandModuleService extends MedusaService({
  Brand,
}) {

}
//Aqui se crean unas funiones que luego se heredan cuando se invoca el BrandModuleService
export default BrandModuleService