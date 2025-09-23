import { z } from "astro:schema";
import { itemSchema } from "./item.schema";

export const serviceTypeValues = ['income', 'expense'] as const;

export const serviceSchema = itemSchema.omit({ stock: true, minStock: true });

export const serviceEditSchema = serviceSchema.omit({ id: true, businessId: true, createdAt: true, updatedAt: true })
export const serviceDeleteSchema = serviceSchema.pick({ id: true });


export type ServiceSchema = z.infer<typeof serviceSchema>;
export type ServiceEditSchema = z.infer<typeof serviceEditSchema>;

export const serviceTypeOptions: Record<(typeof serviceTypeValues)[number], string> =
{
    expense: 'Gasto',
    income: 'Ingreso'
};