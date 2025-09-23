import { z } from "astro:schema";
import { stringBuilder, dateBuilder, booleanBuilder, numBuilder, auditSchema, tenant } from "./common.schema";

export const userRoleValues = ['admin', 'businessman'] as const;

export const userSchema = z.object({
    id: numBuilder('El id', 1),
    name: stringBuilder("El nombre ", 5, 250, true),
    email: stringBuilder("El correo electrónico", 1, 250, true)
        .email("Formato de correo electrónico inválido")
        .toLowerCase(),
    password: stringBuilder("La contraseña", 8, 250, true),
    role: z.enum(userRoleValues, { message: "El rol del usuario es incorrecto" }).default('businessman'),
    isActive: booleanBuilder('El estado de activo'),
}).merge(auditSchema).merge(tenant);


export type UserSchema = z.infer<typeof userSchema>;

export function isActiveOptions(isActive: boolean) {
    return isActive ? "Habilitado" : "Deshabilitado";
}

export const userRoleOptions: Record<(typeof userRoleValues)[number], string> =
{
    admin: 'Administrador',
    businessman: 'Empresario'
};