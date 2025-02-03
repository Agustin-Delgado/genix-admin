import { z } from "zod";

export const clientSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  identification_number: z.string(),
  birth_date: z.string(),
  gender: z.string(),
  phone_number: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    userable_type: z.string(),
    state: z.enum(["active", "inactive", "pending"]),
  }),
})

export const clientStudiesSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    title: z.string(),
    code: z.string(),
    date: z.string(),
    state: z.string(),
    client_name: z.string(),
    metadata: z.object({}),
  })),
  current_page: z.number(),
  per_page: z.number(),
  total_pages: z.number(),
  total_elements: z.number(),
})

export type Client = z.infer<typeof clientSchema>
export type ClientStudies = z.infer<typeof clientStudiesSchema>