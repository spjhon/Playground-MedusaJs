import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import { PostAdminCreateBrand } from "./admin/brands/validators";
import { z } from "zod";
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

console.log("se ejecuto el archivo middleware");



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

    //ojo, curiosamente desde la peticion se puede agregar un "fields" para que con unos params en el query de la ruta de peticion
    //se especifique que campos que tengan lins se adicionen a la peticion
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
