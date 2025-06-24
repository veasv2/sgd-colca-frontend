// components/providers.tsx
"use client"

import { StrictMode } from 'react'
import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProvider } from '@/context/theme-context'
import { Toaster } from '@/components/ui/sonner'

// Crear QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (process.env.NODE_ENV === 'development') {
          console.log({ failureCount, error })
        }

        if (failureCount >= 0 && process.env.NODE_ENV === 'development') return false
        if (failureCount > 3 && process.env.NODE_ENV === 'production') return false

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        )
      },
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        // handleServerError(error) // Implementa tu función de manejo de errores

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error('Content not modified!')
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Session expired!')
          // useAuthStore.getState().auth.reset() // Tu store de auth
          window.location.href = '/sign-in'
        }
        if (error.response?.status === 500) {
          toast.error('Internal Server Error!')
          window.location.href = '/500'
        }
        if (error.response?.status === 403) {
          // Manejar forbidden
        }
      }
    },
  }),
})

interface ProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: ProvidersProps) {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </NextThemesProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}