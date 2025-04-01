import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createBrandWorkflow } from "../../../workflows/create-brand";

import { z } from "zod"
import { PostAdminCreateBrand } from "./validators"

/*
ESTE TIPADO YA NO IRIA SINO QUE SE UTILIZARIA ZOD PARA LA VALIDACION DE TYPES
type PostAdminCreateBrandType = {
  name: string;
};
*/


type PostAdminCreateBrandType = z.infer<typeof PostAdminCreateBrand>


export const POST = async (
  req: MedusaRequest<PostAdminCreateBrandType>,
  res: MedusaResponse
) => {

  const { result } = await createBrandWorkflow(req.scope).run({input: req.validatedBody});

  console.log("validatedbody del endpoint admin/brands ", req.validatedBody)
  console.log("llamada Api del endpoin admin/brands")
  //The MedusaRequest object's scope property is the Medusa container that holds framework 
  // tools and custom and core modules' services.

  res.json({ brand: result });
};







/*
export const GET: Exporta una función GET, lo que indica que esta es una ruta HTTP de tipo GET.
req: MedusaRequest: Representa la solicitud HTTP entrante.
res: MedusaResponse: Representa la respuesta HTTP que se enviará al cliente.
  */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    
  /*
req.scope.resolve("query"): Obtiene el servicio de consultas (query) desde el contenedor de dependencias de Medusa.
Esto permite acceder a la base de datos utilizando el ORM de Medusa.
When you reach a point in your code where you need a tool, you resolve it from the container and use it.
  */

  const query = req.scope.resolve("query")
  
  /*
Aquí se hace una consulta a la base de datos usando el método graph(), que:
- Consulta la entidad "brand", lo que significa que está obteniendo datos de la tabla brands en la base de datos.
- Usa ...req.queryConfig, lo que permite incluir filtros, paginación y otros parámetros de la consulta que vengan en la solicitud req.
  */

 /*
En cuanto al =, Si metadata no existiera en la respuesta, se usa {} para evitar errores de destructuración.
 */
  const { data: brands, metadata: { count, take, skip } = {},} = await query.graph({entity: "brand",...req.queryConfig,})

  res.json({ 
    brands,
    count,
    limit: take,
    offset: skip,
  })
}



/*
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  
  const { data: brands } = await query.graph({entity: "brand",fields: ["*", "products.*"],})

  res.json({ brands })}
*/