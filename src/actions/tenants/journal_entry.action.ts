import { createJournalEntrySchema } from '@schema/journal_entry.schema';
import type { JournalEntry, NewJournalEntry, NewLedgerRecord, LedgerRecord } from '@db/schema';
import { updateAccountSubtypeByIdAndBusinessId, deleteAccountSubtypeByIdAndBusinessId, createAccountSubtype } from '@db/account_subtype.repository';
import { ActionError, defineAction } from 'astro:actions';
import { validateUserSession } from '../utils';
import { findLastJournalEntryCode } from '@/lib/server/db/journal_entry.repository';
import { journalCodeFormatter } from '@/lib/helpers/journal';

export const journalEntry = {
    create: defineAction({
        accept: "form",
        input: createJournalEntrySchema,
        handler: async (createItem, { session }) => {

            const user = await validateUserSession(session, 'businessman');


            try {
                // await createAccountSubtype(data);

                const lastJournalCode = await findLastJournalEntryCode(user.businessId);

                // const data: NewAccountSubtype = {
                //     ...createItem,
                //     businessId: authenticatedUser.businessId,
                //     createdBy: authenticatedUser.email,
                //     updatedBy: authenticatedUser.email,
                // };
                const data = createItem;

                console.log(data);

                const code = journalCodeFormatter.format(lastJournalCode, createItem.date.getFullYear())
                return {
                    success: true,
                    code,
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