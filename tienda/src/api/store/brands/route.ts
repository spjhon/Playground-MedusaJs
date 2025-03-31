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

  const { result } = await createBrandWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  
  console.log("este llamado es desde la api post de store ", req.validatedBody)
  console.log("llamada Api desde endpoint store/brands")
  

//The MedusaRequest object's scope property is the Medusa container that holds framework 
// tools and custom and core modules' services.

  res.json({ brand: result });
};





export const GET = async (req: MedusaRequest, res: MedusaResponse) => {


  const query = req.scope.resolve("query")

  const logger = req.scope.resolve("logger")

 console.log(logger)
  
  const { data: brands } = await query.graph({
    entity: "brand",
    fields: ["*", "products.*"],
    
  
  })
  

  res.json({brands})
}
