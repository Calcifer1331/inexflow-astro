import { z } from "astro:schema";
import { stringBuilder, numBuilder, auditSchema, tenant } from "./common.schema";

export const contactTypeValues = ['customer', 'provider'] as const;

export const contactSchema = z.object({
    id: numBuilder('El id', 1),
    name: stringBuilder("El nombre ", 5, 250, true),
    email: stringBuilder("El correo electrónico", 1, 250, true)
        .email("Formato de correo electrónico inválido")
        .toLowerCase().nullable(),
    phone: stringBuilder("El numero de telefono", 1, 250, true).nullable(),
    address: stringBuilder("La direccion ", 5, 250, true).nullable(),
    type: z.enum(contactTypeValues, { message: "El rol del usuario es incorrecto" }).default('customer'),
}).merge(auditSchema).merge(tenant);


export type ContactSchema = z.infer<typeof contactSchema>;
export const contactTypeOptions: Record<(typeof contactTypeValues)[number], string> =
{
    customer: 'Cliente',
    provider: 'Proveedor'
};