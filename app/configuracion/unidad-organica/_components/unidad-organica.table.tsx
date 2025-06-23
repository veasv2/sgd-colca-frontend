// En app/dashboard/unidades/_components/unidades-table.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner"; // <--- CAMBIO: Importar desde "sonner"

import { UnidadOrganica } from "@/lib/types";
import { deleteUnidadOrganica } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// Ya no se necesita useToast

// Importa el formulario
import { UnidadOrganicaForm } from "./unidad-organica.form";


interface UnidadesTableProps {
    initialData: UnidadOrganica[];
}

export function UnidadesTable({ initialData }: UnidadesTableProps) {
    const router = useRouter();
    // const { toast } = useToast(); // <--- CAMBIO: Línea eliminada

    const [data, setData] = useState<UnidadOrganica[]>(initialData);
    
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUnidad, setSelectedUnidad] = useState<UnidadOrganica | null>(null);
    
    const unidadesMap = new Map(initialData.map(u => [u.id, u.nombre]));

    const handleRefresh = () => {
        router.refresh();
    };

    const handleDelete = async () => {
        if (!selectedUnidad) return;
        try {
            await deleteUnidadOrganica(selectedUnidad.id);
            // <--- CAMBIO: API de sonner más simple y directa
            toast.success("Unidad Orgánica eliminada correctamente.");
            handleRefresh();
        } catch (error) {
            // <--- CAMBIO: API de sonner más simple y directa
            toast.error("No se pudo eliminar la unidad.", {
              description: error instanceof Error ? error.message : "Error desconocido",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedUnidad(null);
        }
    };

    const columns: ColumnDef<UnidadOrganica>[] = [
        { accessorKey: "codigo", header: "Código" },
        { accessorKey: "nombre", header: "Nombre" },
        { accessorKey: "descripcion", header: "Descripción" },
        { 
          accessorKey: "unidad_padre_id", 
          header: "Unidad Padre",
          cell: ({ row }) => {
            const unidadPadreId = row.getValue("unidad_padre_id");
            // @ts-ignore
            return unidadPadreId ? unidadesMap.get(unidadPadreId) || "No encontrado" : "N/A";
          }
        },
        { accessorKey: "nivel", header: "Nivel" },
        {
            id: "actions",
            cell: ({ row }) => {
                const unidad = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                                setSelectedUnidad(unidad);
                                setIsEditDialogOpen(true);
                            }}>
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => {
                                setSelectedUnidad(unidad);
                                setIsDeleteDialogOpen(true);
                            }}>
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    + Agregar Unidad Orgánica
                </Button>
            </div>
            <div className="border rounded-md">
                <DataTable columns={columns} data={data} />
            </div>
            <UnidadOrganicaForm
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSuccess={handleRefresh}
                unidadesList={initialData}
            />
            {selectedUnidad && (
                <UnidadOrganicaForm
                    isOpen={isEditDialogOpen}
                    onClose={() => {
                        setIsEditDialogOpen(false);
                        setSelectedUnidad(null);
                    }}
                    onSuccess={handleRefresh}
                    unidadToEdit={selectedUnidad}
                    unidadesList={initialData}
                />
            )}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la unidad orgánica
                            <span className="font-bold"> "{selectedUnidad?.nombre}"</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Sí, eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
