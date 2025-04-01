//el segundo paso para la creacion de un modulo independiente es la asignacion de las funciones para interactuar
//con las tablas creadas en el schema de los modelos, el primer paso es la creacion de las tablas y el paso que sigue es
//exportar su definicion con un index.

import { MedusaService } from "@medusajs/framework/utils"
import Post from "./models/post"

class BlogModuleService extends MedusaService({
  Post,
}){
}

export default BlogModuleService