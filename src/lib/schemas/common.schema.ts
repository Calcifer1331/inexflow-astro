// /lib/schemas/common.ts
import type { UUID } from "crypto";
import { z } from "astro:schema";

// Tipos base reutilizables
export const stringBuilder = (fieldName: string, min?: number, max?: number, nonempty?: boolean) => {
    let zString = z.string({
        required_error: `${fieldName} es requerido`,
        invalid_type_error: `${fieldName} debe ser un texto`
    });
    if (nonempty || (min != undefined && max != undefined))
        zString = zString.trim().nonempty(`${fieldName} no puede estar vacío`);

    if (min !== undefined)
        zString = zString.min(min, `${fieldName} debe tener al menos ${min} caracteres`);

    if (max !== undefined)
        zString = zString.max(max, `${fieldName} no puede exceder los ${max} caracteres`);

    return zString;
}

export const booleanBuilder = (fieldName: string) => z.boolean({
    required_error: `${fieldName} es requerido`,
    invalid_type_error: `${fieldName} debe ser de tipo 'Si', 'No'`
})

export const numBuilder = (fieldName: string, min?: number, max?: number, step?: number) => {
    let zNumber = z.number({
        required_error: `${fieldName} es requerido`,
        invalid_type_error: `${fieldName} debe ser un numero`
    });

    if (min !== undefined)
        zNumber = zNumber.gte(min, `${fieldName} debe ser mayor a ${min}`);

    if (max !== undefined)
        zNumber = zNumber.lte(max, `${fieldName} debe ser menor a ${max}`);

    if (step !== undefined)
        zNumber = zNumber.step(step, `${fieldName} debe tener el formato ${step}`);

    return zNumber;
}

export const dateBuilder = (fieldName: string, coerce?: boolean) =>
    (coerce ? z.coerce : z).date({
        required_error: `${fieldName} es requerida`,
        invalid_type_error: `${fieldName} debe ser una fecha valida.`
    })

export const uuidBuilder = (fieldName: string) => stringBuilder(fieldName)
    .nonempty(`${fieldName} no puede estar vacío`)
    .uuid(`${fieldName} debe ser un UUID válido`)
    .refine(val => val === val.trim(), {
        message: `${fieldName} no debe contener espacios al inicio o final`
    }).transform((val) => val as UUID);

export const UUIDParser = uuidBuilder('UUID');

export type { UUID } from 'crypto';

export const imageFile = z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
        message: "Debe ser una imagen válida",
    });

export const historicalFields = z.object({
    createdAt: dateBuilder('La fecha de creacion'),
    updatedAt: dateBuilder('La fecha de actualizacion'),
})
export const auditSchema = z.object({
    createdBy: stringBuilder('El usuario que lo creo').nullable(),
    updatedBy: stringBuilder('El usuario que lo actualizo').nullable(),
}).merge(historicalFields)

export const tenant = z.object({ businessId: uuidBuilder('El id del negocio') });