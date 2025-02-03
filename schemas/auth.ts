import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({
    message: "El email es requerido",
  }),
  password: z.string({ required_error: "La contraseña es requerida" }).min(1, {
    message: "La contraseña es requerida",
  }),
})

export const userSchema = z.object({
  email: z.string(),
  id: z.string(),
  state: z.enum(["active", "inactive"]),
  userable: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  userable_type: z.string(),
})

type SignInSuccess = {
  token: string
}

type SignInError = {
  message: string
}

export type SignInResponse = SignInSuccess | SignInError
export type SignInRequest = z.infer<typeof signInSchema>
export type User = z.infer<typeof userSchema>