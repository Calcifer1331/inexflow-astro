import { createAccountSubtypeSchema, deleteAccountSubtypeSchema, editAccountSubtypeSchema } from '@schema/account.schema';
import type { NewAccountSubtype, EditAccountSubtype } from '@db/schema';
import { updateAccountSubtypeByIdAndBusinessId, deleteAccountSubtypeByIdAndBusinessId, createAccountSubtype } from '@db/account_subtype.repository';
import { ActionError, defineAction } from 'astro:actions';

export const accountSubtype = {
    create: defineAction({
        accept: "form",
        input: createAccountSubtypeSchema,
        handler: async (createItem, { locals: { authenticatedUser } }) => {


            if (authenticatedUser.role !== "businessman")
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'No tiene autorizacion para ver realizar esta accion'
                })

            const data: NewAccountSubtype = {
                ...createItem,
                businessId: authenticatedUser.businessId,
                createdBy: authenticatedUser.email,
                updatedBy: authenticatedUser.email,
            };

            try {
                await createAccountSubtype(data);
            } catch (error) {
                console.error("Login Error:", error);
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Error del servidor",
                });
            }

            return {
                success: true,
                name: data.name,
            }
        }
    }),
    edit: defineAction({
        accept: "form",
        input: editAccountSubtypeSchema,
        handler: async (editItem, { locals: { authenticatedUser } }) => {


            if (authenticatedUser.role !== "businessman")
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'No tiene autorizacion para ver realizar esta accion'
                })

            try {

                const data: EditAccountSubtype = {
                    ...editItem,
                    updatedBy: authenticatedUser.email,
                };

                await updateAccountSubtypeByIdAndBusinessId(editItem.id, authenticatedUser.businessId, data);

            } catch (error) {
                console.error("Login Error:", error);
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Error del servidor",
                });
            }

            return {
                success: true
            }
        }
    }),
    delete: defineAction({
        accept: "form",
        input: deleteAccountSubtypeSchema,
        handler: async ({ id }, { locals: { authenticatedUser } }) => {


            if (authenticatedUser.role !== "businessman")
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'No tiene autorizacion para realizar esta accion'
                });


            try {

                await deleteAccountSubtypeByIdAndBusinessId(id, authenticatedUser.businessId);

            } catch (error) {
                console.error("Login Error:", error);
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Error del servidor",
                });
            }

            return {
                success: true
            }
        }
    }),
}
export default accountSubtype;