// src/lib/validations/auth.ts
import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

export type LoginFormData = z.infer<typeof loginSchema>