import { createItemSchema, deleteItemSchema, editItemSchema } from '@/lib/schemas/item.schema';
import type { EditItem, Item, NewItem } from '@/lib/server/db/schema';
import { create, deleteByIdAndBusinessIdAndType, updateByIdAndBusinessIdAndType } from '@db/item.respository';
import { ActionError, defineAction } from 'astro:actions';

export const items = {
    create: defineAction({
        accept: "form",
        input: createItemSchema,
        handler: async (createItem, { locals }) => {

            const { authenticatedUser } = locals;

            if (authenticatedUser.role !== "businessman")
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'No tiene autorizacion para ver realizar esta accion'
                })

            const { cost, sellingPrice, ...more } = createItem;

            const data: NewItem = {
                ...more,
                businessId: authenticatedUser.businessId,
                cost: cost.toFixed(2),
                sellingPrice: !!sellingPrice ? sellingPrice.toFixed(2) : undefined,
            };

            try {

                await create(data);

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
        input: editItemSchema,
        handler: async (editItem, { locals }) => {

            const { authenticatedUser } = locals;

            if (authenticatedUser.role !== "businessman")
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'No tiene autorizacion para ver realizar esta accion'
                })

            const { id, cost, type, sellingPrice, ...more } = editItem;

            const data: EditItem = {
                ...more,
                cost: cost.toFixed(2),
                sellingPrice: !!sellingPrice ? sellingPrice.toFixed(2) : undefined,
            };

            try {

                await updateByIdAndBusinessIdAndType(id, authenticatedUser.businessId, type, data);

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
        input: deleteItemSchema,
        handler: async ({ id, type }, { locals }) => {

            const { authenticatedUser } = locals;

            if (authenticatedUser.role !== "businessman")
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'No tiene autorizacion para ver realizar esta accion'
                });


            try {

                await deleteByIdAndBusinessIdAndType(id, authenticatedUser.businessId, type);

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
export default items;