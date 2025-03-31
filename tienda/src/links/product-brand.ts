import BrandModule from "../modules/brand"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"


//este link lo que esta definiendo es una id para conectar al id de producto con el id de brand para saber que product pertenece
//a que brand, ojo, product no sabe que tiene brands, solo la tabla brand sabe que tiene products
//estos links no son automaticos, se deben de hacer mas cambios de codigo para utilizarlos en el workflow por medio de HOOKS
export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  BrandModule.linkable.brand
)