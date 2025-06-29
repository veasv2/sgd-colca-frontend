// app/(dashboard)/seguridad/usuario/page.tsx

import { UsersTable } from "./_components/usuario-table"
import { getUsuarios } from '@/lib/api/seguridad/usuarios'
import UsersProvider from './_context/usuario-context'
import { columns } from './_components/usuario-table-column'
import { UsuarioBarButtons } from './_components/usuario-bar-buttons'

interface UsuarioPageProps {
  searchParams: {
    skip?: string
    limit?: string
  }
}

export default async function UsuarioPage({ searchParams }: UsuarioPageProps) {
  const skip = parseInt(searchParams.skip || '0')
  const limit = parseInt(searchParams.limit || '100')

  try {
    const usuarios = await getUsuarios(skip, limit)

    return (
      <UsersProvider>
        <main className='peer-[.header-fixed]/header:mt-16 px-4 py-6'>
          {/* Encabezado con título y botones */}
          <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
              <p className='text-muted-foreground'>
                Manage your users and their roles here.
              </p>
            </div>
            <UsuarioBarButtons />
          </div>

          {/* Tabla */}
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
            <UsersTable data={usuarios} columns={columns} />
          </div>
        </main>
      </UsersProvider>
    )
  } catch (error) {
    console.error('Error fetching usuarios:', error)

    return (
      <UsersProvider>
        <main className='peer-[.header-fixed]/header:mt-16 px-4 py-6'>
          <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
              <p className='text-muted-foreground'>
                Manage your users and their roles here.
              </p>
            </div>
            <UsuarioBarButtons />
          </div>

          {/* Contenedor de error */}
          <div className='bg-white rounded-lg border border-border p-6'>
            <div className='flex items-center justify-center h-96'>
              <div className='text-center space-y-4'>
                <div className='text-6xl text-red-100'>⚠️</div>
                <h3 className='text-lg font-semibold text-red-600 mb-2'>
                  Error loading users
                </h3>
                <p className='text-muted-foreground max-w-md'>
                  Unable to connect to the server. Please verify that the API is working properly.
                </p>
                <details className='mt-4 text-left bg-muted rounded-lg p-4'>
                  <summary className='cursor-pointer text-sm font-medium mb-2'>
                    View error details
                  </summary>
                  <pre className='text-xs text-foreground bg-white p-2 rounded border overflow-auto'>
                    {error instanceof Error ? error.message : 'Unknown error'}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </main>
      </UsersProvider>
    )
  }
}
