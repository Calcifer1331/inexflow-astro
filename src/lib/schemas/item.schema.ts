import { z } from "astro:schema";
import { stringBuilder, uuidBuilder, numBuilder, auditSchema, tenant } from "./common.schema";

export const itemTypeValues = ['product', 'supply'] as const;

export const itemSchema = z.object({
    id: numBuilder('El id', 1),
    name: stringBuilder("El nombre", 5, 250, true),
    type: z.enum(itemTypeValues, { message: "El tipo" }).default('product'),
    cost: numBuilder('El costo', 0.00, undefined, 0.01).default(0.01),
    sellingPrice: numBuilder('El costo', 0.00, undefined, 0.01).nullable(),
    stock: numBuilder('El stock', 0).default(0),
    minStock: numBuilder('El stock', 0).default(10),
    measureUnitId: numBuilder('El id de unidad de medida', 1),
}).merge(auditSchema).merge(tenant);

export const itemEditSchema = itemSchema.omit({ id: true, businessId: true, createdAt: true, updatedAt: true })
export const itemDeleteSchema = itemSchema.pick({ id: true });


export type ItemSchema = z.infer<typeof itemSchema>;
export type ItemEditSchema = z.infer<typeof itemEditSchema>;

export const itemTypeOptions: Record<(typeof itemTypeValues)[number], string> =
{
    product: 'Productos',
    supply: 'Suministros'
};