import { z } from "zod"

export const PostAdminCreateBlogPost = z.object({
  title: z.string(),
})