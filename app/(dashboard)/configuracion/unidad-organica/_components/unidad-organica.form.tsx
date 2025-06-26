// En app/dashboard/unidades/_components/unidad-organica-form.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronsUpDown, Check } from "lucide-react";
import { toast } from "sonner"; // Cambiado a Sonner

import { UnidadOrganica, UnidadOrganicaCreate } from "@/lib/types";
import { createUnidadOrganica, updateUnidadOrganica } from "@/lib/api";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


// Esquema de validación con Zod
const formSchema = z.object({
    codigo: z.string().min(1, "El código es requerido").max(10),
    nombre: z.string().min(3, "El nombre es requerido").max(200),
    descripcion: z.string().optional(),
    unidad_padre_id: z.string().uuid().optional().nullable(),
    nivel: z.coerce.number().int().min(1, "El nivel debe ser al menos 1"),
});

type FormValues = z.infer<typeof formSchema>;

interface UnidadOrganicaFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    unidadToEdit?: UnidadOrganica | null;
    unidadesList: UnidadOrganica[]; // Para el selector de la unidad padre
}

export function UnidadOrganicaForm({
    isOpen,
    onClose,
    onSuccess,
    unidadToEdit,
    unidadesList,
}: UnidadOrganicaFormProps) {
    const isEditMode = !!unidadToEdit;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            codigo: "",
            nombre: "",
            descripcion: "",
            unidad_padre_id: null,
            nivel: 1,
        },
    });

    useEffect(() => {
        // Si estamos en modo edición, poblamos el formulario con los datos existentes.
        if (isEditMode) {
            form.reset({
                codigo: unidadToEdit.codigo,
                nombre: unidadToEdit.nombre,
                descripcion: unidadToEdit.descripcion || "",
                unidad_padre_id: unidadToEdit.unidad_padre_id,
                nivel: unidadToEdit.nivel,
            });
        } else {
            form.reset(); // Limpiamos el formulario para el modo creación
        }
    }, [unidadToEdit, form, isEditMode]);

    const onSubmit = async (values: FormValues) => {
        try {
            if (isEditMode) {
                await updateUnidadOrganica(unidadToEdit.id, values);
                toast.success("Unidad actualizada correctamente");
            } else {
                await createUnidadOrganica(values as UnidadOrganicaCreate);
                toast.success("Unidad creada correctamente");
            }
            onSuccess(); // Llama a router.refresh() en el componente padre
            onClose(); // Cierra el diálogo
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Ocurrió un error inesperado");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Editar" : "Crear"} Unidad Orgánica</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Actualiza los detalles de la unidad." : "Completa el formulario para agregar una nueva unidad."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="nombre" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl><Input placeholder="Ej: Gerencia General" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="codigo" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código</FormLabel>
                                <FormControl><Input placeholder="Ej: GG-01" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="descripcion" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl><Textarea placeholder="Describe la unidad..." {...field} value={field.value ?? ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="nivel" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nivel</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="unidad_padre_id" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Unidad Padre (Opcional)</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                                {field.value ? unidadesList.find(u => u.id === field.value)?.nombre : "Seleccionar unidad padre"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar unidad..." />
                                            <CommandEmpty>No se encontró la unidad.</CommandEmpty>
                                            <CommandGroup>
                                                {unidadesList
                                                    .filter(u => u.id !== unidadToEdit?.id) // Evitar que una unidad sea su propio padre
                                                    .map((unidad) => (
                                                        <CommandItem value={unidad.nombre} key={unidad.id} onSelect={() => { form.setValue("unidad_padre_id", unidad.id) }}>
                                                            <Check className={cn("mr-2 h-4 w-4", unidad.id === field.value ? "opacity-100" : "opacity-0")} />
                                                            {unidad.nombre}
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Guardando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}