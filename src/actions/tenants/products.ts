import { itemDeleteSchema, itemEditSchema } from '@/lib/schemas/item.schema';
import type { Item } from '@/lib/server/db/schema';
import { updateProductByIdAndBusinessIdAndType } from '@db/item.respository';
import { ActionError, defineAction } from 'astro:actions';

export const items = {
    edit: defineAction({
        accept: "form",
        input: itemEditSchema,
        handler: async (editItem, { session, params, locals }) => {

            const { authenticatedUser } = locals;

            if (authenticatedUser.role !== "businessman")
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'No tiene autorizacion para ver realizar esta accion'
                })

            const parseId = parseInt(params.id ?? "0");

            if (!parseId) return new Response(null, { status: 404 });

            const { cost, sellingPrice, ...more } = editItem;

            const data: Partial<Item> = {
                ...more,
                id: parseId,
                cost: cost.toFixed(2),
                sellingPrice: !!sellingPrice ? sellingPrice.toFixed(2) : undefined,
            };

            try {

                await updateProductByIdAndBusinessIdAndType(parseId, authenticatedUser.businessId, data);

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
        input: itemDeleteSchema,
        handler: async ({ id }, { session, locals }) => {

            const { authenticatedUser } = locals;

            if (authenticatedUser.role !== "businessman")
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'No tiene autorizacion para ver realizar esta accion'
                });


            try {

                await updateProductByIdAndBusinessIdAndType(parseId, authenticatedUser.businessId, data);

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