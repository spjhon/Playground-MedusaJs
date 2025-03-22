import { 
    defineMiddlewares,
    validateAndTransformBody,
  } from "@medusajs/framework/http"
  import { PostAdminCreateBrand } from "./admin/brands/validators"
  
console.log("se ejecuto el archivo middleware")

  export default defineMiddlewares({
    routes: [
      {
        matcher: "/admin/brands",
        method: "POST",
        middlewares: [
          validateAndTransformBody(PostAdminCreateBrand),
        ],
      },
    ],
  })