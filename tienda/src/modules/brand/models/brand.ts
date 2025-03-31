import { model } from "@medusajs/framework/utils"

//Un data model representa una tabla en la base de datos

export const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text(),
})