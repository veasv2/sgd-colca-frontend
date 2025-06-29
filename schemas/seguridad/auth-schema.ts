// lib/validations/auth-schema.ts

import { z } from "zod"

// Schema para login
export const loginSchema = z.object({
  email: z.string()
    .min(1, "Email es requerido")
    .email("Formato de email inválido"),
  password: z.string()
    .min(1, "Contraseña es requerida")
    .min(3, "Contraseña debe tener al menos 3 caracteres")
})

// Schema para registro de usuario
export const registerSchema = z.object({
  username: z.string()
    .min(3, "Username debe tener al menos 3 caracteres")
    .max(50, "Username no puede exceder 50 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Username solo puede contener letras, números y guiones bajos"),
  email: z.string()
    .min(1, "Email es requerido")
    .email("Formato de email inválido")
    .max(100, "Email no puede exceder 100 caracteres"),
  password: z.string()
    .min(8, "Contraseña debe tener al menos 8 caracteres")
    .max(100, "Contraseña no puede exceder 100 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Contraseña debe contener al menos una minúscula, una mayúscula y un número"),
  nombres: z.string()
    .min(1, "Nombres son requeridos")
    .max(100, "Nombres no pueden exceder 100 caracteres"),
  apellidos: z.string()
    .min(1, "Apellidos son requeridos")
    .max(100, "Apellidos no pueden exceder 100 caracteres"),
  dni: z.string()
    .length(8, "DNI debe tener exactamente 8 dígitos")
    .regex(/^\d+$/, "DNI solo puede contener números")
    .optional(),
  telefono: z.string()
    .regex(/^[+]?[\d\s-()]+$/, "Formato de teléfono inválido")
    .optional(),
  tipo_usuario: z.enum(["SUPERADMIN", "ALCALDE", "FUNCIONARIO"], {
    errorMap: () => ({ message: "Tipo de usuario inválido" })
  }),
  puesto_id: z.number().optional()
})

// Schema para cambio de contraseña
export const changePasswordSchema = z.object({
  current_password: z.string()
    .min(1, "Contraseña actual es requerida"),
  new_password: z.string()
    .min(8, "Nueva contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Nueva contraseña debe contener al menos una minúscula, una mayúscula y un número")
}).refine((data) => data.current_password !== data.new_password, {
  message: "La nueva contraseña debe ser diferente a la actual",
  path: ["new_password"]
})

// Tipos TypeScript derivados de los schemas
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>