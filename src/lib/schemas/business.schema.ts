import { z } from "astro:schema";
import { stringBuilder, auditSchema, uuidBuilder } from "./common.schema";


export const businessSchema = z.object({
    id: uuidBuilder('El id'),
    name: stringBuilder("El nombre", 5, 250, true),
    phone: stringBuilder("El numero de telefono", 1, 250, true),
}).merge(auditSchema);


export type BusinessSchema = z.infer<typeof businessSchema>;
