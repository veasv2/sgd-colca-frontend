// components/site-header.tsx
import { TopBar } from "@/components/top-bar"

export function SiteHeader() {
  // Aquí puedes obtener los datos del usuario actual
  const user = {
    name: "Juan Pérez",
    email: "juan.perez@sgdcolca.com",
    avatar: "/avatars/juan.jpg" // opcional
  }

  return <TopBar user={user} />
}