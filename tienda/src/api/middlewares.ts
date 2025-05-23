import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import { PostAdminCreateBrand } from "./admin/brands/validators";
import { z } from "zod";
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { PostAdminCreateBlogPost } from "./blog/posts/validators";

console.log("\x1b[35m  -Se ha incrustado todos los middleware a Medusa JS app-  \x1b[0m")



export const GetBrandsSchema = createFindParams()


export default defineMiddlewares({
  routes: [
    {
      //este es el middleware para hacer validators a lo que llega en este post desde el admin api
    
      matcher: "/admin/brands",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminCreateBrand)],
    },
    {

      //este es el middleware para hacer validators a lo que llega en este post desde el store api
      matcher: "/store/brands",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminCreateBrand)],
    },
    {
      matcher: "/admin/products",
      method: ["POST"],
      additionalDataValidator: {
        brand_id: z.string().optional(),
      },
    },
    //este middleware es de post
    {
      matcher: "/blog/posts",
      method: ["POST"],
      middlewares: [validateAndTransformBody(PostAdminCreateBlogPost)],

    },

    //ojo, curiosamente desde la peticion se puede agregar un "fields" para que con unos params en el query de la ruta de peticion
    //se especifique que campos que tengan lins se adicionen a la peticion

    //este de abajo es un ejemplo de un validacion de types pero en el query y paginacion que se utiliza en una ui route
    {
      matcher: "/admin/brands",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(
          GetBrandsSchema,
          {
            defaults: [
              "id",
              "name",
              "products.*",
            ],
            isList: true,
          }
        ),
      ],
    },


  ],
});
