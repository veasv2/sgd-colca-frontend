import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UserAuthForm } from './_components/sign-in-form'
import Link from 'next/link'

export default function SignIn() {
  return (
    <Card className='shadow-lg'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-semibold text-center'>
          Iniciar Sesión
        </CardTitle>
        <CardDescription className='text-center text-gray-600'>
          Ingresa tu email y contraseña para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <UserAuthForm />
      </CardContent>
      
      <CardFooter className='flex flex-col space-y-4'>
        <div className='text-center'>
          <span className='text-sm text-gray-600'>¿No tienes una cuenta? </span>
          <Link 
            href='/sign-up' 
            className='text-sm text-blue-600 hover:text-blue-500 font-medium'
          >
            Regístrate aquí
          </Link>
        </div>
        
        <p className='text-xs text-gray-500 text-center leading-relaxed'>
          Al iniciar sesión, aceptas nuestros{' '}
          <Link
            href='/terms'
            className='text-blue-600 hover:text-blue-500 underline underline-offset-2'
          >
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link
            href='/privacy'
            className='text-blue-600 hover:text-blue-500 underline underline-offset-2'
          >
            Política de Privacidad
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  )
}