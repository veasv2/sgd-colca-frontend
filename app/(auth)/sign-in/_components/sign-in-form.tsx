"use client"

import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useRouter, useSearchParams } from 'next/navigation' // ← NUEVO: Agregado useSearchParams
import { login, saveSession } from '@/lib/auth/auth'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Por favor ingresa tu email' })
    .email({ message: 'Dirección de email inválida' }),
  password: z
    .string()
    .min(1, {
      message: 'Por favor ingresa tu contraseña',
    })
    .min(7, {
      message: 'La contraseña debe tener al menos 7 caracteres',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('') // ← NUEVO: Estado para errores de auth
  const router = useRouter()
  const searchParams = useSearchParams() // ← NUEVO: Para obtener parámetros de URL

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setAuthError('') // Limpiar errores previos
    
    try {
      // Usar servicio de autenticación
      const result = await login({
        email: data.email,
        password: data.password
      })
      
      if (result.success && result.token) {
        // Login exitoso
        console.log('Login exitoso!', result.user)
        
        // Guardar sesión
        saveSession(result.token)
        
        // ← NUEVO: Obtener la ruta de redirect o usar dashboard por defecto
        const redirectTo = searchParams.get('redirect') || '/dashboard'
        
        // Redirigir a la ruta original o dashboard
        router.push(redirectTo)
        
        // El loading se mantendrá hasta que la página cargue
      } else {
        // Credenciales incorrectas
        setIsLoading(false) // ← Solo desactivar loading si hay error
        throw new Error(result.error || 'Error al iniciar sesión')
      }
      
    } catch (error) {
      // Manejar errores
      setIsLoading(false) // ← Desactivar loading en caso de error
      setAuthError(error instanceof Error ? error.message : 'Error al iniciar sesión')
    }
    // ← REMOVIDO: finally block que desactivaba loading
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        {/* ← NUEVO: Mostrar error de autenticación si existe */}
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {authError}
          </div>
        )}

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='nombre@ejemplo.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                href='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </div>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              O continúa con
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}