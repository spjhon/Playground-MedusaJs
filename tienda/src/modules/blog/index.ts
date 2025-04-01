//el paso que sigue (el paso anterior es la creacion del service) es la exportacion de la definicion del modulo, por ultimo
//seguiria colocar el modulo en la configuracion de medusa

import BlogModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const BLOG_MODULE = "blog"

export default Module(BLOG_MODULE, {
  service: BlogModuleService,
})
