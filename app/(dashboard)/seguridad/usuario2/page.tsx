// En app/dashboard/unidades/page.tsx
import { UsersTable } from "./_components/usuario-table"; // Crearemos este componente a continuación
import { users } from '@/mock/seguridad/mock-usuario'
import { userListSchema } from '@/schemas/seguridad/usuario2-schema'
import { AppMain } from '@/components/layout/app-main'
import UsersProvider from './_context/usuario-context'
import { columns } from './_components/usuario-table-column'
import { UsuarioBarButtons } from './_components/usuario-bar-buttons'
import { Main } from './main'

export default async function UsuarioPage() {
    // Obtenemos los datos en el servidor
    const userList = userListSchema.parse(users)

    return (
        <UsersProvider>
            <Main>
                <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
                        <p className='text-muted-foreground'>
                            Manage your users and their roles here.
                        </p>
                    </div>
                    <UsuarioBarButtons />
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
                    <UsersTable data={userList} columns={columns} />
                </div>
            </Main>

        </UsersProvider>
    );
}
