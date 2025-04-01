//Este es el primer paso para crear un modulo pora un post para un blog en medusa js, aqui se crean los
//modelos que son las tablas en la base de datos, en este caso es una sola tabla

import { model } from "@medusajs/framework/utils"

  
  const Post = model.define("post", {
    id: model.id().primaryKey(),
    title: model.text(),
  })
  
  export default Post