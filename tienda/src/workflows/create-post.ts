import { 
    createStep, 
    createWorkflow, 
    StepResponse, 
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { BLOG_MODULE } from "../modules/blog"
  import BlogModuleService from "../modules/blog/service"
  
  type CreatePostWorkflowInput = {
    title: string
  }
  
  //este es uno de los steps que se utilizan dentro del workflow y que pueden haber otro steps en los hooks por ejemplo
  const createPostStep = createStep("create-post",

    async ({ title }: CreatePostWorkflowInput, { container }) => {
      const blogModuleService: BlogModuleService = container.resolve(BLOG_MODULE)
  
      const post = await blogModuleService.createPosts({title})

      console.log("este llamado viene desde el step: este es el post completo:", post)
      console.log("este llamado viene desde el step: este es el id del post", post.id)
      console.log("este llamado viene desde el step: este es el title del post", title)

  
      return new StepResponse(post, post.id)
    },

    async (id: string, { container }) => {
      
      const blogModuleService: BlogModuleService = container.resolve(BLOG_MODULE)
  
      await blogModuleService.deletePosts(id)
    }
  )
  


  //este es el workflow, aqui los console log no funcionan
  export const createPostWorkflow = createWorkflow(
    "create-post",
    (postInput: CreatePostWorkflowInput) => {
      const post = createPostStep(postInput)

      //este consolelog no funciona en el workflow, pero si en el step y en la api
    console.log("este console log viene desde el workflow CreatePostWorkflowInput, NO DEBERIA VERSE")
  
      return new WorkflowResponse(post)
    }
  )