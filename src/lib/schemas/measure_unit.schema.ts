import { z } from "astro:schema";
import { stringBuilder, historicalFields, tenant, numBuilder } from "./common.schema";

export const measureUnitSchema = z.object({
    id: numBuilder('El id', 1),
    value: stringBuilder("El nombre", 1, 250, true),
});

export type MeasureUnitSchema = z.infer<typeof measureUnitSchema>;
