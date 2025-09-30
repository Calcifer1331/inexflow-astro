import { createJournalEntrySchema } from '@schema/journal_entry.schema';
import type { JournalEntry, NewJournalEntry, NewLedgerRecord, LedgerRecord } from '@db/schema';
import { ActionError, defineAction } from 'astro:actions';
import { validateUserSession } from '../utils';
import { findNextJournalEntryCodeAndId, createJournalEntry } from '@db/journal_entry.repository';
import { createLedgerRecord, createLedgerRecordBatch } from '@db/ledger_record.repository';
import { journalCodeFormatter } from '@/lib/helpers/journal';

export const journalEntry = {
    create: defineAction({
        accept: "json",
        input: createJournalEntrySchema,
        handler: async (createItem, { session }) => {

            const user = await validateUserSession(session, 'businessman');

            try {

                const { code, id } = await findNextJournalEntryCodeAndId(user.businessId, createItem.date.getFullYear());

                const newJournalEntry: NewJournalEntry = { ...createItem, id, businessId: user.businessId, code, createdBy: user.email };
                const newLedgerRecords: NewLedgerRecord[] = createItem.records.map(record => ({
                    ...record,
                    debit: record.debit.toFixed(2),
                    credit: record.credit.toFixed(2),
                    journalEntryId: id,
                    businessId: user.businessId,
                    createdBy: user.email,
                } as NewLedgerRecord))

                await createJournalEntry(newJournalEntry, newLedgerRecords);

                return {
                    success: true,
                    code: journalCodeFormatter.format(code, createItem.date.getFullYear()),
                }

            } catch (error) {
                console.error("Login Error:", error);
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Error del servidor",
                });
            }
        }
    }),
    // edit: defineAction({
    //     accept: "form",
    //     input: editAccountSubtypeSchema,
    //     handler: async (editItem, { locals }) => {

    //         const { authenticatedUser } = locals;

    //         if (authenticatedUser.role !== "businessman")
    //             throw new ActionError({
    //                 code: 'UNAUTHORIZED',
    //                 message: 'No tiene autorizacion para ver realizar esta accion'
    //             })

    //         try {

    //             const data: EditAccountSubtype = {
    //                 ...editItem,
    //                 updatedBy: authenticatedUser.email,
    //             };

    //             await updateAccountSubtypeByIdAndBusinessId(editItem.id, authenticatedUser.businessId, data);

    //         } catch (error) {
    //             console.error("Login Error:", error);
    //             throw new ActionError({
    //                 code: 'INTERNAL_SERVER_ERROR',
    //                 message: "Error del servidor",
    //             });
    //         }

    //         return {
    //             success: true
    //         }
    //     }
    // }),
    // delete: defineAction({
    //     accept: "form",
    //     input: deleteAccountSubtypeSchema,
    //     handler: async ({ id }, { locals }) => {

    //         const { authenticatedUser } = locals;

    //         if (authenticatedUser.role !== "businessman")
    //             throw new ActionError({
    //                 code: 'UNAUTHORIZED',
    //                 message: 'No tiene autorizacion para realizar esta accion'
    //             });


    //         try {

    //             await deleteAccountSubtypeByIdAndBusinessId(id, authenticatedUser.businessId);

    //         } catch (error) {
    //             console.error("Login Error:", error);
    //             throw new ActionError({
    //                 code: 'INTERNAL_SERVER_ERROR',
    //                 message: "Error del servidor",
    //             });
    //         }

    //         return {
    //             success: true
    //         }
    //     }
    // }),
}
export default journalEntry;