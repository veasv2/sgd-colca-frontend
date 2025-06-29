// schemas/seguridad/usuario-schema.ts

import { z } from 'zod'

// Enums que coinciden con tu FastAPI
export const estadoUsuarioSchema = z.union([
  z.literal('ACTIVO'),
  z.literal('INACTIVO'),
  z.literal('SUSPENDIDO'),
])
export type EstadoUsuario = z.infer<typeof estadoUsuarioSchema>

export const tipoUsuarioSchema = z.union([
  z.literal('SUPERADMIN'),
  z.literal('ALCALDE'),
  z.literal('FUNCIONARIO'),
])
export type TipoUsuario = z.infer<typeof tipoUsuarioSchema>

// Schema base del usuario (coincide con UsuarioBase de FastAPI)
export const usuarioBaseSchema = z.object({
  username: z.string().min(3, 'El username debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  nombres: z.string().min(2, 'Los nombres son requeridos'),
  apellidos: z.string().min(2, 'Los apellidos son requeridos'),
  dni: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'El DNI solo debe contener números').optional().nullable(),
  telefono: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos').optional().nullable(),
  tipo_usuario: tipoUsuarioSchema,
  estado: estadoUsuarioSchema.default('ACTIVO'),
  puesto_id: z.number().int().positive().optional().nullable(),
})
export type UsuarioBase = z.infer<typeof usuarioBaseSchema>

// Schema para crear usuario (coincide con UsuarioCreate de FastAPI)
export const usuarioCreateSchema = usuarioBaseSchema.extend({
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
})
export type UsuarioCreate = z.infer<typeof usuarioCreateSchema>

// Schema para actualizar usuario (coincide con UsuarioUpdate de FastAPI)
export const usuarioUpdateSchema = z.object({
  username: z.string().min(3, 'El username debe tener al menos 3 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  nombres: z.string().min(2, 'Los nombres son requeridos').optional(),
  apellidos: z.string().min(2, 'Los apellidos son requeridos').optional(),
  dni: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'El DNI solo debe contener números').optional().nullable(),
  telefono: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos').optional().nullable(),
  tipo_usuario: tipoUsuarioSchema.optional(),
  estado: estadoUsuarioSchema.optional(),
  puesto_id: z.number().int().positive().optional().nullable(),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número')
    .optional(),
})
export type UsuarioUpdate = z.infer<typeof usuarioUpdateSchema>

// Schema completo del usuario en base de datos (coincide con UsuarioInDB de FastAPI)
export const usuarioInDBSchema = usuarioBaseSchema.extend({
  id: z.number().int().positive(),
  uuid: z.string().uuid('UUID inválido'),
  intentos_fallidos: z.number().int().min(0).default(0),
  bloqueado_hasta: z.coerce.date().optional().nullable(),
  ultimo_acceso: z.coerce.date().optional().nullable(),
  fecha_creacion: z.coerce.date(),
  fecha_actualizacion: z.coerce.date(),
})
export type UsuarioInDB = z.infer<typeof usuarioInDBSchema>

// Schema para lectura (coincide con UsuarioRead de FastAPI)
export const usuarioReadSchema = usuarioInDBSchema
export type UsuarioRead = z.infer<typeof usuarioReadSchema>

// Schema para arrays de usuarios
export const usuarioListSchema = z.array(usuarioReadSchema)
export type UsuarioList = z.infer<typeof usuarioListSchema>

// Schemas para formularios específicos
export const loginSchema = z.object({
  username_or_email: z.string().min(1, 'El usuario o email es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})
export type LoginForm = z.infer<typeof loginSchema>

export const cambiarPasswordSchema = z.object({
  password_actual: z.string().min(1, 'La contraseña actual es requerida'),
  password_nueva: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirmar_password: z.string(),
}).refine((data) => data.password_nueva === data.confirmar_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmar_password'],
})
export type CambiarPasswordForm = z.infer<typeof cambiarPasswordSchema>

// Schema para filtros de búsqueda
export const usuarioFiltrosSchema = z.object({
  busqueda: z.string().optional(),
  estados: z.array(estadoUsuarioSchema).optional(),
  tipos_usuario: z.array(tipoUsuarioSchema).optional(),
  fecha_desde: z.coerce.date().optional(),
  fecha_hasta: z.coerce.date().optional(),
  solo_bloqueados: z.boolean().optional(),
})
export type UsuarioFiltros = z.infer<typeof usuarioFiltrosSchema>

// Utilities y helpers
export const esUsuarioActivo = (usuario: UsuarioRead): boolean => {
  return usuario.estado === 'ACTIVO' && !esUsuarioBloqueado(usuario)
}

export const esUsuarioBloqueado = (usuario: UsuarioRead): boolean => {
  if (!usuario.bloqueado_hasta) return false
  return new Date() < new Date(usuario.bloqueado_hasta)
}

export const tieneIntentosFallidos = (usuario: UsuarioRead): boolean => {
  return usuario.intentos_fallidos > 0
}

export const getNombreCompleto = (usuario: UsuarioBase | UsuarioRead): string => {
  return `${usuario.nombres} ${usuario.apellidos}`
}

export const getIniciales = (usuario: UsuarioBase | UsuarioRead): string => {
  const nombres = usuario.nombres.split(' ')[0]
  const apellidos = usuario.apellidos.split(' ')[0]
  return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
}

// Constantes útiles
export const ESTADOS_USUARIO = {
  ACTIVO: 'ACTIVO' as const,
  INACTIVO: 'INACTIVO' as const,
  SUSPENDIDO: 'SUSPENDIDO' as const,
}

export const TIPOS_USUARIO = {
  SUPERADMIN: 'SUPERADMIN' as const,
  ALCALDE: 'ALCALDE' as const,
  FUNCIONARIO: 'FUNCIONARIO' as const,
}

// Configuración de validación
export const VALIDACION_CONFIG = {
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 8,
  DNI_LENGTH: 8,
  TELEFONO_MIN_LENGTH: 9,
  MAX_INTENTOS_FALLIDOS: 5,
} as const