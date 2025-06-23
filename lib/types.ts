/**
 * Representa una Unidad Orgánica como la recibimos desde la API.
 */
export interface UnidadOrganica {
    id: string; // UUID
    codigo: string;
    nombre: string;
    descripcion?: string | null;
    unidad_padre_id?: string | null;
    nivel: number;
    // Opcional: Si tu API devuelve el nombre del padre, añádelo aquí.
    // nombre_unidad_padre?: string; 
}

/**
 * Representa los datos necesarios para crear una nueva Unidad Orgánica.
 * No incluye el 'id', que es generado por el backend.
 */
export type UnidadOrganicaCreate = Omit<UnidadOrganica, 'id'>;

/**
 * Representa los datos para actualizar. Todos los campos son opcionales.
 */
export type UnidadOrganicaUpdate = Partial<UnidadOrganicaCreate>;
