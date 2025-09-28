import { z } from "astro:schema";
import { stringBuilder, uuidBuilder, numBuilder, historicalFields, tenant, auditSchema, dateBuilder } from "./common.schema";

export const journalEntrySchema = z.object({
    id: numBuilder('El id', 1),
    code: numBuilder("El Código", 1),
    name: stringBuilder("El nombre", 2, 250, true),
    description: stringBuilder("La escripción", 2, 250, true),
    date: dateBuilder('La fecha', true),
    year: numBuilder('El año', 1500, 3000),
}).merge(auditSchema).merge(tenant);

export const editJournalEntrySchema = journalEntrySchema.omit({ year: true, createdAt: true, updatedAt: true, businessId: true, createdBy: true, updatedBy: true })
// export const createJournalEntrySchema = editJournalEntrySchema.omit({ id: true });
export const deleteJournalEntrySchema = editJournalEntrySchema.pick({ id: true });

export type JournalEntrySchema = z.infer<typeof journalEntrySchema>;
export type EditJournalEntrySchema = z.infer<typeof editJournalEntrySchema>;
export type DeleteJournalEntrySchema = z.infer<typeof deleteJournalEntrySchema>;


export const ledgerRecordSchema = z.object({
    id: numBuilder('El id', 1),
    voucher: stringBuilder("El comprobante", 2, 250, true),
    reference: stringBuilder("La referencia", 2, 250, true),
    accountId: numBuilder('El id de la cuenta', 1),
    journalEntryId: numBuilder('El id de la entrada', 1),
    debit: numBuilder('El debito', 0.00, undefined, 0.01).default(0.01),
    credit: numBuilder('El credito', 0.00, undefined, 0.01).default(0.01),
}).merge(auditSchema).merge(tenant)

export const editLedgerRecordSchema = ledgerRecordSchema.omit({ createdAt: true, updatedAt: true, businessId: true, createdBy: true, updatedBy: true })
export const createLedgerRecordSchema = editLedgerRecordSchema.omit({ id: true, journalEntryId: true })
export const createLedgerRecordSchemaV2 = createLedgerRecordSchema.refine(({ debit, credit }) => !(debit === 0 && credit === 0), {
    message: "El debito y el credito no pueden ser los dos 0",
    path: ["debit", 'credit'],
});;
export const deleteLedgerRecordSchema = deleteJournalEntrySchema

export type LedgerRecordSchema = z.infer<typeof ledgerRecordSchema>;
export type EditLedgerRecordSchema = z.infer<typeof editLedgerRecordSchema>;
export type CreateLedgerRecordSchema = z.infer<typeof createLedgerRecordSchema>;
export type DeleteLedgerRecordSchema = DeleteJournalEntrySchema;


export const createJournalEntrySchema = editJournalEntrySchema.omit({ id: true, code: true }).extend({
    records: z.array(createLedgerRecordSchemaV2).min(2, { message: 'Tiene que haber minimo 2 registros' })
});

export type CreateJournalEntrySchema = z.infer<typeof createJournalEntrySchema>;
