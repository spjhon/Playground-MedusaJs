import type {MedusaRequest, MedusaResponse} from "@medusajs/framework/http"
import {createPostWorkflow} from "../../../workflows/create-post"
  
import { z } from "zod"
import { PostAdminCreateBlogPost } from "./validators"


type PostAdminCreateBlogPostType = z.infer<typeof PostAdminCreateBlogPost>

  export async function POST(req: MedusaRequest<PostAdminCreateBlogPostType>, res: MedusaResponse) {


    const { result } = await createPostWorkflow(req.scope).run({input: req.validatedBody})
  
    console.log("este console log viene desde la api y es el result: ", result)
    res.json({result})


  }