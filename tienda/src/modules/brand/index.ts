import { Module } from "@medusajs/framework/utils"
import BrandModuleService from "./service"

export const BRAND_MODULE = "brand"
//este es un index para que cuando se haga un resolver del modulo BRAND_MODULE, venga ya con 
// la lista de servicios que en este caso es uno pero podria ser muchos mas
export default Module(BRAND_MODULE, {
  service: BrandModuleService,
})