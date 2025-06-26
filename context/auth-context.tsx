'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

interface User {
    email: string
    name: string
    role: string
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    isLoading: boolean
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuario hardcodeado para desarrollo
const DEMO_USER = {
    email: 'veas.v2@gmail.com',
    password: 'admin123', // Contraseña temporal
    name: 'Alcalde de Colca',
    role: 'ALCALDE'
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Verificar si hay un usuario guardado en cookies al cargar
        const savedUser = Cookies.get('sgd_user')
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch (error) {
                console.error('Error parsing saved user:', error)
                Cookies.remove('sgd_user')
            }
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true)

        // Simular llamada a API con delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Validación hardcodeada
        if (email === DEMO_USER.email && password === DEMO_USER.password) {
            const userData = {
                email: DEMO_USER.email,
                name: DEMO_USER.name,
                role: DEMO_USER.role
            }

            setUser(userData)

            // Guardar en cookies (expira en 7 días)
            Cookies.set('sgd_user', JSON.stringify(userData), { expires: 7 })

            setIsLoading(false)
            return true
        }

        setIsLoading(false)
        return false
    }

    const logout = () => {
        setUser(null)
        Cookies.remove('sgd_user')
    }

    const value = {
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}