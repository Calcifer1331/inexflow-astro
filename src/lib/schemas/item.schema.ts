import { z } from "astro:schema";
import { stringBuilder, uuidBuilder, numBuilder, auditSchema, tenant } from "./common.schema";

export const itemTypeValues = ['product', 'supply'] as const;

export const itemSchema = z.object({
    id: numBuilder('El id', 1),
    name: stringBuilder("El nombre", 5, 250, true),
    type: z.enum(itemTypeValues, { message: "El tipo de elemento es incorrecto" }),
    cost: numBuilder('El costo', 0.00, undefined, 0.01).default(0.01),
    sellingPrice: numBuilder('El costo', 0.00, undefined, 0.01).nullable(),
    stock: numBuilder('El stock', 0).default(0),
    minStock: numBuilder('El stock', 0).default(10),
    measureUnitId: numBuilder('El id de unidad de medida', 1),
}).merge(auditSchema).merge(tenant);

export const editItemSchema = itemSchema.omit({ createdAt: true, updatedAt: true, businessId: true })
export const createItemSchema = editItemSchema.omit({ id: true });
export const deleteItemSchema = itemSchema.pick({ id: true, type: true });

export type ItemSchema = z.infer<typeof itemSchema>;
export type EditItemSchema = z.infer<typeof editItemSchema>;
export type CreateItemSchema = z.infer<typeof createItemSchema>;
export type DeleteItemSchema = z.infer<typeof deleteItemSchema>;

export type ItemType = (typeof itemTypeValues)[number];
export const itemTypeOptions: Record<ItemType, string> =
{
    product: 'Productos',
    supply: 'Suministros'
};