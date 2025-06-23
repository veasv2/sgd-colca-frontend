// En app/dashboard/unidades/page.tsx
import { getUnidadesOrganicas } from "@/lib/api"; // Asegúrate que la ruta sea correcta
import { UnidadesTable } from "./_components/unidades-table"; // Crearemos este componente a continuación

export default async function UnidadesPage() {
    // Obtenemos los datos en el servidor
    const unidades = await getUnidadesOrganicas();
    console.log(unidades)
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Gestión de Unidades Orgánicas</h1>
            {/* Pasamos los datos iniciales al componente cliente.
            Toda la lógica de CRUD (modales, botones, etc.) vivirá dentro de UnidadesTable.
          */}
            <UnidadesTable initialData={unidades.items} />
        </div>
    );
}
