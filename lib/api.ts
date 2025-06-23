// En lib/api.ts

import { UnidadOrganica, UnidadOrganicaCreate, UnidadOrganicaUpdate } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
}

const UNIDADES_ENDPOINT = `${API_URL}/api/v1/unidad_organica/unidades-organicas`; // Ajusta esta ruta a tu endpoint real de FastAPI

/**
 * Obtiene todas las unidades orgánicas.
 */
export async function getUnidadesOrganicas(): Promise<UnidadOrganica[]> {
  const res = await fetch(UNIDADES_ENDPOINT, { cache: 'no-store' }); // 'no-store' para datos dinámicos
  if (!res.ok) {
    // Esto activará el error.tsx más cercano
    throw new Error('Failed to fetch Unidades Orgánicas');
  }
  return res.json();
}

/**
 * Crea una nueva unidad orgánica.
 */
export async function createUnidadOrganica(data: UnidadOrganicaCreate): Promise<UnidadOrganica> {
    const res = await fetch(UNIDADES_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error al crear la unidad');
    }
    return res.json();
}

/**
 * Actualiza una unidad orgánica existente.
 */
export async function updateUnidadOrganica(id: string, data: UnidadOrganicaUpdate): Promise<UnidadOrganica> {
    const res = await fetch(`${UNIDADES_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error al actualizar la unidad');
    }
    return res.json();
}

/**
 * Elimina una unidad orgánica.
 */
export async function deleteUnidadOrganica(id: string): Promise<Response> {
    const res = await fetch(`${UNIDADES_ENDPOINT}/${id}`, {
        method: 'DELETE',
    });
     if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error al eliminar la unidad');
    }
    // DELETE a menudo devuelve 204 No Content, así que solo devolvemos la respuesta.
    return res;
}
