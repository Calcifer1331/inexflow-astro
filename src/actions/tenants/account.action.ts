import { createAccountSchema, deleteAccountSchema, editAccountSchema } from '@schema/account.schema';
import type { EditAccount, NewAccount } from '@db/schema';
import { createAccount, deleteAccountByIdAndBusinessId, findAllAccountsToSelect, updateAccountByIdAndBusinessId } from '@db/account.repository';
import { ActionError, defineAction } from 'astro:actions';
import { validateUserSession } from '../utils';

export const account = {
    findAll: defineAction({
        accept: 'json',
        handler: async (_, { session }) => {

            await validateUserSession(session, 'businessman');

            try {
                return await findAllAccountsToSelect();
            } catch (error) {
                console.error("Login Error:", error);
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Error del servidor",
                });
            }

        }
    }),
    create: defineAction({
        accept: "form",
        input: createAccountSchema,
        handler: async (createItem, { locals: { authenticatedUser } }) => {

            if (authenticatedUser.role !== "businessman")
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'No tiene autorizacion para ver realizar esta accion'
                })

            const data: NewAccount = {
                ...createItem,
                businessId: authenticatedUser.businessId,
                createdBy: authenticatedUser.email,
                updatedBy: authenticatedUser.email,
            };

            try {
                await createAccount(data);
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
        input: editAccountSchema,
        handler: async (editItem, { locals }) => {

            const { authenticatedUser } = locals;

            if (authenticatedUser.role !== "businessman")
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'No tiene autorizacion para ver realizar esta accion'
                })

            try {

                const data: EditAccount = {
                    ...editItem,
                    updatedBy: authenticatedUser.email,
                };

                await updateAccountByIdAndBusinessId(editItem.id, authenticatedUser.businessId, data);

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
        input: deleteAccountSchema,
        handler: async ({ id }, { locals }) => {

            const { authenticatedUser } = locals;

            if (authenticatedUser.role !== "businessman")
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'No tiene autorizacion para realizar esta accion'
                });


            try {

                await deleteAccountByIdAndBusinessId(id, authenticatedUser.businessId);

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
export default account;