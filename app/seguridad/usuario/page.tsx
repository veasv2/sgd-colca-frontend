// En app/dashboard/unidades/page.tsx
import { getUnidadesOrganicas } from "@/lib/api"; // Asegúrate que la ruta sea correcta
import { UsersTable } from "./_components/usuario-table"; // Crearemos este componente a continuación
import { users } from './data/users'
import { userListSchema } from './data/schema'
import { columns } from './_components/users-columns'
import UsersProvider from './context/users-context'
import { Main } from './main'
import { ThemeSwitch } from './theme-switch'
import { Header } from './header'
import { ProfileDropdown } from './profile-dropdown'
import { UsersPrimaryButtons } from './users-primary-buttons'

export default async function UsuarioPage() {
    // Obtenemos los datos en el servidor
    const userList = userListSchema.parse(users)

    const unidades = await getUnidadesOrganicas();
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
                    <UsersPrimaryButtons />
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
                    <UsersTable data={userList} columns={columns} />
                </div>
            </Main>
        </UsersProvider>
    );
}
